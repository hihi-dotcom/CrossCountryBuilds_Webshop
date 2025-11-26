package server

import "core:net"
import "core:time"
import "core:thread"

TIMEOUT :: 45 * time.Second

Guard_Data :: struct {

}

Guard_Work :: union {
    Guard_Header,
}

Guard_Record :: struct {
    lastHeard: time.Time,
    priority: Priority
}

Guard_Header :: struct {
    //???
    socket: net.TCP_Socket,
    record: Guard_Record
}

Guard_Proc :: proc(t: ^thread.Thread) {
    data := cast(^Guard_Data)t.data


}