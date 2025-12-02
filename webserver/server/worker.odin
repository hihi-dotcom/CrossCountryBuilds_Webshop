package server

import "core:net"
import "core:time"
import "core:sync/chan"
import "core:thread"
import "./header_parser"
import "core:fmt"
import "core:log"
import "./responder"
import "./static"
import "core:strconv"

Work :: struct {
    socket: net.TCP_Socket,
    request: Request
}

Worker_Thread_Data :: struct {
    chans: Recv_Chans,
    guard: Send_Guard,
    server: Server
}

Worker_Porc :: proc(t: ^thread.Thread) {
    fmt.println("Worker thread started")
    wtd := cast(^Worker_Thread_Data)t.data

    for {
        work := Get_Work(wtd.chans)
        fmt.println("Got Work:", work)

        if !try_header(wtd, &work) do continue
        if !try_body(wtd, &work) do continue
        return_the_socket(wtd, work)
        
        

        file, len, _ := static.load_whole_file("./root/hehe.html")
        testbuffer: [1024]u8
 
        slen := fmt.bprint(testbuffer[:], len)
 
        o: map[string]string
        o["content-type"] = "text/html; charset=UTF-8"
        o["content-length"] = slen
 
 
        res := responder.Response {
            status = 200,
            options = o,
            body = file
        }
 
        n, _ := responder.Send(work.socket, res)
        fmt.println(n)
    }
}

@(private="file")
try_body :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (bool) {
    if header, ok := w.request.header.(^header_parser.Header) ; ok {
        if value, ok := header.pairs["content-length"] ; ok {
            if bodyLength, ok := strconv.parse_int(value) ; ok {
                // itt
            }

        } else if value, ok := header.pairs["transfer-encoding"] ; ok {
            if value == "chunked" do fmt.println("Chunked transfer is not implemented!")
        }
        
    } else { log.panic("There should not be a header_state here.") }
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
        case: log.panic("You definitaly should not be here!")
    }
    log.panic("Neither here!")
}

@(private="file")
try_recv :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (bool) {
    if state, ok := w.request.header.(^header_parser.Parser_State) ; ok {
        n, recvErr := net.recv_tcp(w.socket, state.header.header_data.data[state.header.header_data.end:])
        state.header.header_data.written += n
        #partial switch recvErr {
            case .Would_Block:
                return send_to_guard(wtd, w^)
            case .None:
                return true
            case:
                clean_up_Work(w)
                return false
        }
    } else { log.panic("The header was done, so it should not be here.")}
    log.panic("You should not be here!")
}

@(private="file")
send_to_guard :: proc(wtd: ^Worker_Thread_Data, w: Work) -> (ok: bool) {
    if !chan.send(wtd.guard, Guard_Work { work = w }) { log.panic("Guard channel is closed!") }
    return false
}

@(private="file")
return_the_socket :: proc(wtd: ^Worker_Thread_Data, w: Work) {
    if state, ok := w.request.header.(^header_parser.Header) ; ok {
        newWork := Work {
            socket = w.socket,
            request = Request {
                header = header_parser.parser_state_maker()
            }
        }
        if newState, ok := newWork.request.header.(^header_parser.Parser_State) ; ok {
            newState.header.header_data.written = copyer(state.header_data.data[state.header_data.end:state.header_data.written], newState.header.header_data.data[:])
        } else do log.panic("???")
        _ = send_to_guard(wtd, newWork)
    } else do log.panic("There should not be a header_state here.")
}

@(private="file")
copyer :: proc(from: []u8, to: []u8) -> (n: int) {
    for v, i in from {
        to[i] = v
        n = i
    }
    n += 1
    return
}

clean_up_Work :: proc(w: ^Work) {
    net.close(w.socket)
    clean_up_Request(w.request)
}