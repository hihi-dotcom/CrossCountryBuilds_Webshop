package server

import "core:net"
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
    guard: chan.Chan(Guard_Work, chan.Direction.Send),
    testingChans: Send_Chans // for testing
}

Worker_Porc :: proc(t: ^thread.Thread) {
    wtd := cast(^Worker_Thread_Data)t.data

    for {
        work := Get_Work(wtd.chans)

        if ok := try_header(wtd, &work) ; !ok do continue

        fmt.println(work)
        

    }
    
}

@(private="file")
try_header :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (ok: bool) {
    switch v in w.request.header {
        case ^header_parser.Header:
            return true
        case ^header_parser.Parser_State:
            for {
                parse_err := header_parser.Parse(v)
                if parse_err == .None {
                    return true
                } else if parse_err == .TooLong {
                    return clean_up(w)
                }
                if !try_recv(wtd, w) do return false
            }
        case:
            w.request.header = header_parser.parser_state_maker()
            for {
                if !try_recv(wtd, w) do return false
                parse_err := header_parser.Parse(w.request.header.(^header_parser.Parser_State))
                if parse_err == .None {
                    return true
                } else if parse_err == .TooLong {
                    return clean_up(w)
                }
            }
    }
    log.panic("You shold not be here!")
}

@(private="file")
try_recv :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (ok: bool) {
    if state, ok := w.request.header.(^header_parser.Parser_State) ; ok {
        n, recvErr := net.recv_tcp(w.socket, state.header.header_data.data[state.header.header_data.end:])
        if recvErr == .Would_Block {
            return send_to_guard(wtd, w^) 
        } else if recvErr != nil {
            return clean_up(w)
        }
    } else { log.panic("The header was done, so it should not be here.")}
    return
}

@(private="file")
clean_up :: proc(w: ^Work) -> (ok: bool) {
    header_parser.parser_state_and_contents_free(w.request.header.(^header_parser.Parser_State))
    net.close(w.socket)
    return false
}

@(private="file")
send_to_guard :: proc(wtd: ^Worker_Thread_Data, w: Work) -> (ok: bool) {
    //"To be implemented"
    Set_Work(wtd.testingChans, w, .Medium)
    return true
}
