package server

import "core:net"
import "core:time"
import "core:thread"

TIMEOUT :: 45 * time.Second

Guard_Data :: struct {

}

Guard_Work :: union {
    Guard_Socket,
}

Guard_Socket :: struct {
    buffer: Buffer,
    socket: net.TCP_Socket,
    lastHeard: time.Time,
    priority: Priority
}

Buffer :: struct {
    data: []u8,
    start: u64
} 

Guard_Proc :: proc(t: ^thread.Thread) {
    data := cast(^Guard_Data)t.data


}