package server

import "core:net"
import "core:fmt"
import "core:log"
import "core:thread"

Listener_Thread_Data :: struct {
    chans: Send_Chans,
    port: int
}

Listener_Proc :: proc(t: ^thread.Thread) {
    ltd := cast(^Listener_Thread_Data)t.data

    ep := net.Endpoint { address = net.IP4_Address([4]u8{0,0,0,0}), port = ltd.port } 
    soc, listen_err := net.listen_tcp(ep)
    if listen_err != nil do log.panic("There was an error when creating the listener socket!")

    fmt.println("Listener started on port:", ep)

    for {
        client, _, accept_err := net.accept_tcp(soc)
        if accept_err != nil do log.panic("TCP accept error!") 
        set_blocking_err := net.set_blocking(client, false)
        if set_blocking_err != nil do log.panic("Failed to set blocking!") 
        work := Work {
            socket = client
        }
        Set_Work(ltd.chans, work, .Low)

        fmt.println("New work:", work) // Should be removed if everything works 
    }
}