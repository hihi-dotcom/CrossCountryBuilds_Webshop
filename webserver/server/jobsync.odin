package server

import "core:sync"
import "core:sync/chan"

Priority :: enum u8 {
    High,
    Medium,
    Low
}

Work_Chans :: struct($P: typeid) {
    high: ^chan.Chan(Work(P), chan.Direction.Recv),
    medium: ^chan.Chan(Work(P), chan.Direction.Recv),
    low: ^chan.Chan(Work(P), chan.Direction.Recv),
    sema: ^sync.Sema,
}

Get_Work :: proc(wtd: ^Work_Chans($P)) -> Work(P) {
    for {
        sync.sema_wait(wtd.sema)
        if w, ok := chan.try_recv(wtd.high) ; ok {
            return w
        } else if w, ok := chan.try_recv(wtd.medium) ; ok {
            return w
        } else if w, ok := chan.try_recv(wtd.low) ; ok {
            return w
        }
    }
}



