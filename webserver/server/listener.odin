package server

import "core:net"
import "core:thread"

Listener_Thread_Data :: struct($P: typeid) {
    using chans: Send_Chans(P),
    port: u16
}

Listener_Proc :: proc(t: ^thread.Thread) {
    ltd := cast(^Listener_Thread_Data)t.data

    ep := Endpoint {}
    net.listen_tcp()
}