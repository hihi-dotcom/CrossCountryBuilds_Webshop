package server

import "core:sync"
import "core:sync/chan"

Priority :: enum u8 {
    High,
    Medium,
    Low
}

Get_Work :: proc(wtd: ^Worker_Thread_Data($P)) -> Work(P) {
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



