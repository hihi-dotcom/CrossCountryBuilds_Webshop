package server

import "core:net"
import "core:fmt"
import "core:log"
import "core:time"
import "core:thread"
import "core:sync/chan"
import "./header_parser"

TIMEOUT :: 5 * time.Second
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
    fmt.println("Guard thread started")
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

        for &order, index in to_watch {
            switch &v in order {
                case Guard_Work:
                    if state, ok := v.work.request.header.(^header_parser.Parser_State) ; ok {
                        n, err := net.recv_tcp(v.work.socket, state.header.header_data.data[state.header.header_data.end:])
                        #partial switch err { // something is now working, partial should not be required
                            case .None:
                                Set_Work(gd.send_chans, v.work, v.record.priority)
                            case .Would_Block:
                                if diff := time.diff(v.record.lastHeard, time.now()) ; diff > TIMEOUT {
                                    fmt.println(diff, TIMEOUT)
                                    clean_up_Guard_Order(&order)
                                    unordered_remove(&to_watch, index)
                                } 
                            case:
                                clean_up_Guard_Order(&order)
                                unordered_remove(&to_watch, index)
                        }
                    } else { log.panic("A guard should not be watching a completed header!") }
                case: log.panic("You problalbly not implemented an order for the guard!")
            }
        }
    }
}

clean_up_Guard_Order :: proc(to: ^Guard_Order) {
    switch &v in to {
        case Guard_Work:
            clean_up_Work(&v.work)
        case: log.panic("You problalbly not implemented an order for the guard (clean_up)!")
    }
}