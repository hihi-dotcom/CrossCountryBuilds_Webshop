package server

import "core:text/regex/compiler"
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
    sendChans: Send_Chans,
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

        fmt.println(string(work.request.body.data[:]))

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

        back_to_work(wtd, &work)
    }
}

@(private="file")
try_body :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (bool) {
    if header, ok := w.request.header.(^header_parser.Header) ; ok {
        if value, ok := header.pairs["content-length"] ; ok {
            if bodyLength, ok := strconv.parse_int(value) ; ok {
                if len(w.request.body.data) != bodyLength {
                    w.request.body.data = make([]u8, bodyLength)
                    rescue_data_from_header_buffer(wtd, w)
                }
                for len(w.request.body.data) != w.request.body.end {
                    return try_recv(wtd, w)
                }
                return true
            } else {
                length_required(wtd, w)
                return false
            }
        } else if value, ok := header.pairs["transfer-encoding"] ; ok {
            if value == "chunked" do fmt.println("Chunked transfer is not implemented!")
            length_required(wtd, w)
            return false
        } 
    } else { log.panic("There should not be a header_state here.") }
    return true
}

@(private="file")
length_required :: proc(wtd: ^Worker_Thread_Data, w: ^Work) {
    responder.Send(w.socket, responder.Response {
        status = 411
    })
    back_to_work(wtd, w)
}

@(private="file")
rescue_data_from_header_buffer :: proc(wtd: ^Worker_Thread_Data, w: ^Work) {
    if header, ok := w.request.header.(^header_parser.Header) ; ok {
        n := copyer(header.header_data.data[header.header_data.end:header.header_data.end + len(w.request.body.data)], w.request.body.data[w.request.body.end:])
        w.request.body.end += n
        header.header_data.written += n
    } else { log.panic("There should not be a header_state here.") }
}

@(private="file")
try_header :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (ok: bool) {
    if w.request.header == nil do w.request.header = header_parser.parser_state_maker()
    switch &v in w.request.header {
        case ^header_parser.Header:
            return true
        case ^header_parser.Parser_State:
            //for {
                switch header_parser.Parse(v) {
                    case .None:
                        tmp := v.header
                        header_parser.parser_state_free(w.request.header.(^header_parser.Parser_State))
                        w.request.header = tmp
                        return true
                    case .TooLong:
                        clean_up_Work(w)
                        return false
                    case .Partial:
                        if !try_recv(wtd, w) do return false
                        Set_Work(wtd.sendChans, w^, .Medium)
                        return false
                }  
            //}
        case: log.panic("You definitaly should not be here!")
    }
    log.panic("Neither here!")
}

@(private="file")
try_recv :: proc(wtd: ^Worker_Thread_Data, w: ^Work) -> (bool) {
    recvErr: net.TCP_Recv_Error
    switch &v in w.request.header {
        case ^header_parser.Parser_State:
            n, err := net.recv_tcp(w.socket, v.header.header_data.data[v.header.header_data.written:])
            recvErr = err
            v.header.header_data.written += n
        case ^header_parser.Header:
            n, err := net.recv_tcp(w.socket, w.request.body.data[w.request.body.end:])
            recvErr = err
            w.request.body.end += n
        case: log.panic("there is someting wrong here!")
    }
    #partial switch recvErr {
        case .Would_Block:
            return send_to_guard(wtd, w^)
        case .None:
            return true
        case:
            clean_up_Work(w)
            return false
    }
    log.panic("You shold not be here!")
}

@(private="file")
send_to_guard :: proc(wtd: ^Worker_Thread_Data, w: Work) -> (ok: bool) {
    if !chan.send(wtd.guard, Guard_Work { work = w }) { log.panic("Guard channel is closed!") }
    return false
}

@(private="file")
back_to_work :: proc(wtd: ^Worker_Thread_Data, w: ^Work) {
    if state, ok := w.request.header.(^header_parser.Header) ; ok {
        newState := header_parser.parser_state_maker()
        newState.header.header_data.written += copyer(state.header_data.data[state.header_data.end:state.header_data.written], newState.header.header_data.data[:])
        clean_up_Request(&w.request)
        w.request.header = newState
        Set_Work(wtd.sendChans, w^, .Medium)
    } else do log.panic("There should not be a header_state here.")
}

@(private="file")
copyer :: proc(from: []u8, to: []u8, test := #caller_location) -> (n: int) {
    for v, i in from {
        to[i] = v
        n += 1
    }
    return
}

clean_up_Work :: proc(w: ^Work) {
    net.close(w.socket)
    clean_up_Request(&w.request)
}