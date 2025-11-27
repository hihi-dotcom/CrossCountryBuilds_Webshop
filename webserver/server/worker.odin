package server

import "core:text/regex/virtual_machine"
import "core:net"
import "core:sync/chan"
import "core:thread"
import "core:time"
import "core:sync"
import "./header_parser"
import "core:fmt"

Work :: struct($P: typeid) {
    socket: net.TCP_Socket,
    handler: Handler(P),
    header: header_parser.Maybe_Header,
    body: ^[]u8

}

Worker_Thread_Data :: struct($P: typeid) {
    chans: Work_Chans(P),
    guard: ^chan.Chan(Guard_Work, chan.Direction.Send)
}

Worker_Porc :: proc(t: ^thread.Thread, $P: typeid) {
    wtd := cast(^Worker_Thread_Data(P))t.data

    for {
        work := Get_Work(wtd.chans)

        if ok := try_header(wtd, work) ; !ok do continue

        fmt.println(work)
        

    }
    
}

@(private="file")
try_header :: proc(wtd: ^Worker_Thread_Data, w: Work($P)) -> (ok: bool) {
    switch v in w.header {
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
            w.header = header_parser.parser_state_maker()
            for {
                if !try_recv(wtd, w) do return false
                parse_err := header_parser.Parse(v)
                if parse_err == .None {
                    return true
                } else if parse_err == .TooLong {
                    return clean_up(w)
                }
            }
    }
    panic("You shold not be here!")
    return false
}

@(private="file")
try_recv :: proc(wtd: ^Worker_Thread_Data, w: Work($P)) -> (ok: bool) {
    if state, ok := w.header.(^header_parser.Parser_State) ; ok {
        n, recvErr := net.recv_tcp(w.socket, state.header.header_data.data[state.header.header_data.end:])
        if recvErr == .Would_Block {
            return send_to_guard() 
        } else if recvErr != nil {
            return clean_up(w)
        }
    } else { panic("The header was done, so it should not be here.")}
    return
}

@(private="file")
clean_up :: proc(w: Work($P)) -> (ok: bool) {
    header_parser.parser_state_and_contents_free(w.header.(^header_parser.Parser_State))
    net.close(w.socket)
    return false
}

@(private="file")
send_to_guard :: proc() -> (ok: bool) {
    panic("To be implemented")
}
