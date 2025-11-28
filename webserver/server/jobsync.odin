package server

import "core:log"
import "core:sync"
import "core:sync/chan"

Priority :: enum u8 {
    High,
    Medium,
    Low
}

Recv_Chans :: struct {
    high: chan.Chan(Work, chan.Direction.Recv),
    medium: chan.Chan(Work, chan.Direction.Recv),
    low: chan.Chan(Work, chan.Direction.Recv),
    sema: ^sync.Sema,
}

Send_Chans :: struct {
    high: chan.Chan(Work, chan.Direction.Send),
    medium: chan.Chan(Work, chan.Direction.Send),
    low: chan.Chan(Work, chan.Direction.Send),
    sema: ^sync.Sema,
}

Set_Work :: proc(chans: Send_Chans, w: Work, p: Priority) {
    switch p {
        case .Low:
            if ok := chan.send(chans.low, w) ; !ok do log.panic("Work channel is closed! Low")
            sync.sema_post(chans.sema)
        case .Medium:
            if ok := chan.send(chans.medium, w) ; !ok do log.panic("Work channel is closed! Medium")
            sync.sema_post(chans.sema)
        case .High:
            if ok := chan.send(chans.high, w) ; !ok do log.panic("Work channel is closed! High")
            sync.sema_post(chans.sema)
        case:
            log.panic("You should not be here!")
    }
}

Get_Work :: proc(chans: Recv_Chans) -> Work {
    sync.sema_wait(chans.sema)
    if w, ok := chan.try_recv(chans.high) ; ok {
        return w
    } else if w, ok := chan.try_recv(chans.medium) ; ok {
        return w
    } else if w, ok := chan.try_recv(chans.low) ; ok {
        return w
    }
    log.panic("How can this be?")
}



