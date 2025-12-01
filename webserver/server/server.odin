package server

import "core:sync"
import "core:fmt"
import "core:os"
import "core:log"
import "core:time"
import "core:net"
import "./header_parser"
import "./responder"
import "./static"
import "core:thread"
import "core:sync/chan"

CHANNEL_BUFFER_SIZE :: 1024

Server :: struct {
    endpoints: map[Endpoint]Handler,
    root: string,
    workers: u8,
}

Body :: string
Params :: map[string]string

Request :: struct {
    params: Params,
    header: header_parser.Maybe_Header,
    body: Body
}

Handler :: struct {
    toRun: Handler_proc,
}

Handler_proc :: proc(Request, responder.Response)

Endpoint :: struct {
    method: string,
    path: string
}

add :: proc(s: ^Server, ep: Endpoint, toRun: Handler_proc) {
    s.endpoints[ep] = {
        toRun = toRun
    }
}

run :: proc(server: Server, port: int) {
    context.logger = log.create_console_logger()
    recv, send, guard_send, guard_recv := make_Work_chans()
    
    t1 := thread.create(Listener_Proc)
    t1.init_context = context
    t1.data = &Listener_Thread_Data {
        port = port,
        chans = send
    }
    thread.start(t1)

    t2 := thread.create(Worker_Porc)
    t2.init_context = context
    t2.data = &Worker_Thread_Data {
        chans = recv,
        guard = guard_send,
        server = server
    }
    thread.start(t2)

    t3 := thread.create(Guard_Proc)
    t3.init_context = context
    t3.data = &Guard_Data {
        send_chans = send,
        guard_chan = guard_recv
    }
    thread.start(t3)
    
    for { time.sleep(1000000000) }
}

make_Work_chans :: proc() -> (recv: Recv_Chans, send: Send_Chans, guard_send: Send_Guard, guard_recv: Recv_Guard) {
    low, cerr1 := chan.create_buffered(chan.Chan(Work, .Both), CHANNEL_BUFFER_SIZE, context.allocator)
    medium, cerr2 := chan.create_buffered(chan.Chan(Work, .Both), CHANNEL_BUFFER_SIZE, context.allocator)
    high, cerr3 := chan.create_buffered(chan.Chan(Work, .Both), CHANNEL_BUFFER_SIZE,  context.allocator)
    guard, cerr4 := chan.create_buffered(chan.Chan(Guard_Order, .Both), CHANNEL_BUFFER_SIZE, context.allocator)
    
    sema := new(sync.Sema)

    assert(cerr1 == .None)
    assert(cerr2 == .None)
    assert(cerr3 == .None)
    assert(cerr4 == .None)
    
    recv = Recv_Chans {
        high = chan.as_recv(high),
        medium = chan.as_recv(medium),
        low = chan.as_recv(low),
        sema = sema
    }
    send = Send_Chans {
        high = chan.as_send(high),
        medium = chan.as_send(medium),
        low = chan.as_send(low),
        sema = sema
    }
    guard_send = chan.as_send(guard)
    guard_recv = chan.as_recv(guard)

    return
}

clean_up_Request :: proc(rq: Request) {
    assert(rq.body == "") 
    delete(rq.params)

    switch v in rq.header {
        case ^header_parser.Parser_State:
            header_parser.parser_state_and_contents_free(v)
        case ^header_parser.Header:
            header_parser.header_free(v)
        case: log.panic("You probably should not be here!")
    }
}