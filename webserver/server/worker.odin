package server

import "core:net"
import "core:time"
import "core:sync/chan"
import "core:thread"
import "./header_parser"
import "core:fmt"
import "core:log"

Work :: struct {
    socket: net.TCP_Socket,
    request: Request
}

Worker_Thread_Data :: struct {
    chans: Recv_Chans,
    guard: Send_Guard
}

Worker_Porc :: proc(t: ^thread.Thread) {
    fmt.println("Worker thread started")
    wtd := cast(^Worker_Thread_Data)t.data

    for {
        work := Get_Work(wtd.chans)
        fmt.println("Got Work:", work)

        //if ok := try_header(wtd, &work)  ; !ok do continue

        ok := try_header(wtd, &work)

        if h, ok := work.request.header.(^header_parser.Header) ; ok {
            fmt.println(h.Method, h.Path, h.Protocol)
        } else { fmt.println("What???") }
        
        

    }
    
}

@(private="file")
try_header :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (ok: bool) {
    if w.request.header == nil do w.request.header = header_parser.parser_state_maker()
    switch &v in w.request.header {
        case ^header_parser.Header:
            return true
        case ^header_parser.Parser_State:
            for {
                switch header_parser.Parse(v) {
                    case .None:
                        w.request.header = v.header
                        return true
                    case .TooLong:
                        clean_up_Work(w)
                        return false
                    case .Partial:
                        if !try_recv(wtd, w) do return false
                }  
            }
        case:
            log.panic("You definitaly should not be here!")
    }
    log.panic("Neither here!")
}

@(private="file")
try_recv :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (bool) {
    if state, ok := w.request.header.(^header_parser.Parser_State) ; ok {
        n, recvErr := net.recv_tcp(w.socket, state.header.header_data.data[state.header.header_data.end:])
        if recvErr == .Would_Block {
            return send_to_guard(wtd, w^)
        } else if recvErr == .None {
            return true
        } else {
            clean_up_Work(w)
            return false
        }
    } else { log.panic("The header was done, so it should not be here.")}
    log.panic("You should not be here!")
}

@(private="file")
send_to_guard :: proc(wtd: ^Worker_Thread_Data, w: Work) -> (ok: bool) {
    if ok := chan.send(wtd.guard, Guard_Work {
        work = w,
        record = Guard_Record {
            lastHeard = time.now(),
            priority = .Medium
        }
    }) ; !ok do log.panic("Guard channel is closed!")
    return false
}

clean_up_Work :: proc(w: ^Work) {
    net.close(w.socket)
    clean_up_Request(w.request)
}