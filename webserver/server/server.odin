package server

import "core:sync"
import "core:fmt"
import "core:os"
import "core:log"
import "core:time"
import "core:net"
import "./header_parser"
import "core:thread"
import "core:sync/chan"

CHANNEL_BUFFER_SIZE :: 1024

Server :: struct($Permissions: typeid) {
    root: string,
    endpoints: map[Endpoint]Handler(Permissions),
    workers: u8,
    permissions: Permissions,
    permissions_handler: proc(Request) -> Permissions
}

Body :: string
Params :: map[string]string

Request :: struct {
    params: Params,
    header: header_parser.Maybe_Header,
    body: Body
}

Settings :: struct($Permission: typeid) {
    acceptable_permissions: []Permission,
    acceptable_MIMEtypes: []string,
}


Handler :: struct($Permission: typeid) {
    toRun: Handler_proc,
    settings: Settings(Permission)
}

Handler_proc :: proc(Request, Response)

Response :: struct {
    status: u16,

}

Endpoint :: struct {
    method: string,
    path: string
}

Setter :: proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc)

get : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"POST", path}] = {
        toRun = toRun,
        settings = settings
    }
}
post : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"POST", path}] = {
        toRun = toRun,
        settings = settings
    }
}
put : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"PUT", path}] = {
        toRun = toRun,
        settings = settings
    }
}
patch : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"PATCH", path}] = {
        toRun = toRun,
        settings = settings
    }
}
delete : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"DELETE", path}] = {
        toRun = toRun,
        settings = settings
    }
}

run :: proc(port: int, $P: typeid) {
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
        guard = guard_send
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