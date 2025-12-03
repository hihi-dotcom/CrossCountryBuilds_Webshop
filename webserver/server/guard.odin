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
}

Guard_Order :: union {
    Guard_Work,
}

Guard_Record :: struct {
    order: Guard_Order,
    lastHeard: time.Time,
}

Guard_Proc :: proc(t: ^thread.Thread) {
    fmt.println("Guard thread started")
    gd := cast(^Guard_Data)t.data
    to_watch: [dynamic]Guard_Record

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
                append(&to_watch, Guard_Record {
                    order = data,
                    lastHeard = time.now()
                })
            } else { break }
        }

        for &record, index in to_watch {
            switch &v in record.order {
                case Guard_Work:
                    switch state in v.work.request.header{
                        case ^header_parser.Parser_State:
                            try_recv(gd, &v.work, state.header.header_data.data[state.header.header_data.written:], &record, &to_watch, index)
                        case ^header_parser.Header:
                            try_recv(gd, &v.work, v.work.request.body.data[v.work.request.body.end:], &record, &to_watch, index)
                        case: log.panic("This should not be nil!")
                    }
                case: log.panic("You problalbly not implemented an order for the guard!")
            }
        }
    }
}

@(private="file")
try_recv :: proc(gd: ^Guard_Data, w: ^Work, to: []u8, record: ^Guard_Record, list: ^[dynamic]Guard_Record, index: int) {
    n, err := net.recv_tcp(w.socket, to)
    switch &v in w.request.header {
        case ^header_parser.Parser_State:
            v.header.header_data.written += n
        case ^header_parser.Header:
            w.request.body.end += n
        case: log.panic("There problem might be!")
    }
    #partial switch err {
        case .None:
            Set_Work(gd.send_chans, w^, .Medium)
            unordered_remove(list, index)
        case .Would_Block:
            if diff := time.diff(record.lastHeard, time.now()) ; diff > TIMEOUT {
                fmt.println(diff, TIMEOUT)
                clean_up_Guard_Order(&record.order)
                unordered_remove(list, index)
            }
        case:
            clean_up_Guard_Order(&record.order)
            unordered_remove(list, index)
    }
}

clean_up_Guard_Order :: proc(to: ^Guard_Order) {
    switch &v in to {
        case Guard_Work:
            clean_up_Work(&v.work)
        case: log.panic("You problalbly not implemented an order for the guard (clean_up)!")
    }
}