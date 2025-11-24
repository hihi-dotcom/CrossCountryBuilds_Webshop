package server

import "core:net"
import "core:sync/chan"
import "core:thread"
import "core:time"
import "core:sync"
import "./header"

Work :: struct($Permission: typeid) {
    handler: Handler(Permission),
    buffer: Buffer,
    socket: net.TCP_Socket
}

Worker_Thread_Data :: struct($Permission: typeid) {
    high: ^chan.Chan(Work(Permission), chan.Direction.Recv),
    medium: ^chan.Chan(Work(Permission), chan.Direction.Recv),
    low: ^chan.Chan(Work(Permission), chan.Direction.Recv),
    sema: ^sync.Sema,

    guard: ^chan.Chan(Guard_Work, chan.Direction.Send),
}

Worker_Porc :: proc(t: ^thread.Thread, $Permissions: typeid) {
    b: [8*1024]u8
    data := cast(^Worker_Thread_Data(Permissions))t.data

    for {
        work := Get_Work(data)


        




        




    }
    
}

try_recv_header :: proc(wtd: ^Worker_Thread_Data, w: Work($P)) -> (h: header.Header, ok: bool) {
    if w.buffer.data == nil {
        w.buffer.data = make([]u8, 8*1024)
        n, recvErr := net.recv_tcp(w.socket, w.buffer.data)
        if recvErr == net.TCP_Recv_Error.Would_Block {
            ok := chan.send(wtd.guard, {
                buffer = {
                    data = w.buffer.data,
                    start = 0
                },
                socket = w.socket,
                lastHeard = time.now(),
                priority = .Medium
            }) 
            assert(ok)
            return nil, false
        } else if recvErr != nil {
            delete(w.buffer.data)
            net.close(w.socket)
            return nil, false
        }

        
        
    }

}