package server

import "core:net"
import "core:sync/chan"
import "core:thread"
import "core:time"
import "core:sync"
import "./header_parser"

Work :: struct($P: typeid) {
    handler: Handler(P),
    header: header_parser.Maybe_Header,
    socket: net.TCP_Socket
}

Worker_Thread_Data :: struct($P: typeid) {
    chans: Work_Chans(P),
    guard: ^chan.Chan(Guard_Work, chan.Direction.Send)
}

Worker_Porc :: proc(t: ^thread.Thread, $P: typeid) {
    data := cast(^Worker_Thread_Data(P))t.data

    for {
        work := Get_Work(data.chans)

        



        




        




    }
    
}

try_header :: proc(wtd: ^Worker_Thread_Data, w: Work($P)) -> (h: ^header_parser.Header, ok: bool) {
    state: header_parser.Parser_State
    switch v in w.header {
        case ^header_parser.Header:
            return v, true
        case ^header_parser.Parser_State:
            state = v
        case:
            state = header_parser.parser_state_maker()
    }
    
    n, recvErr := net.recv_tcp(w.socket, state.header.header_data.data[state.header.header_data.end:])
    if recvErr == .Would_Block {
        // send the socket back to the guard
        return nil, false
    } else if recvErr != nil {
        header.parser_state_and_contents_free(state)
        net.close(w.socket)
        return nil, false
    }

    header_parser.Parse(&state)

}
