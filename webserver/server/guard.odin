package server

import "core:net"
import "core:fmt"
import "core:log"
import "core:time"
import "core:thread"
import "core:sync/chan"
import "./header_parser"

TIMEOUT :: 45 * time.Second
TICK :: time.Duration(100 * time.Millisecond) 

Guard_Data :: struct {
    send_chans: Send_Chans,
    guard_chan: Recv_Guard
}

Recv_Guard :: chan.Chan(Guard_Order, chan.Direction.Recv)
Send_Guard :: chan.Chan(Guard_Order, chan.Direction.Send)

Guard_Work :: struct {
    work: Work,
    record: Guard_Record
}

Guard_Order :: union {
    Guard_Work,

}

Guard_Record :: struct {
    lastHeard: time.Time,
    priority: Priority
}

Guard_Proc :: proc(t: ^thread.Thread) {
    gd := cast(^Guard_Data)t.data
    to_watch: [dynamic]Guard_Order

    for {
        start_cycle := time.now()
        defer {
            end_cycle := time.now()
            if diff := time.diff(start_cycle, end_cycle) ; diff < TICK {
                time.sleep(TICK - diff)
            }
        }

        for {
            if data, ok := chan.try_recv(gd.guard_chan) ; ok {
                append(&to_watch, data)
            } else { break }
        }

        for order in to_watch {
            switch v in order {
                case Guard_Work:
                    net.recv_tcp(v.work, )
                case: log.panic("You problalbly not implemented an order for the guard!")
            }
        }
        

        

        
    }
}

clean_up :: proc(to: Guard_Order) {
    switch v in to{
        
    }
}