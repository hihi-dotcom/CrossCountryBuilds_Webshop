package main

import "core:thread"
import "core:fmt"
import "core:sync"
import "core:time"
import "core:net"
import "core:log"
import "core:os"
import "core:strings"
import vmem "core:mem/virtual"
import "core:mem"
import "./server"

main :: proc() {
    context.logger = log.create_console_logger()
    when ODIN_DEBUG {
        track: mem.Tracking_Allocator
        mem.tracking_allocator_init(&track, context.allocator)
        context.allocator = mem.tracking_allocator(&track)

        defer {
            if len(track.allocation_map) > 0 {
                for _, entry in track.allocation_map {
                    fmt.eprintf("%v leaked %v bytes\n", entry.location, entry.size)
                }
            }
            mem.tracking_allocator_destroy(&track)
        }
    }

    
    server.run({}, 30000)   
}

/* test :: proc() {
    b: [4096]u8
    endp, _ := net.parse_endpoint("0.0.0.0:33322")

    soc, tcp_listen_err := net.listen_tcp(endp)
    if tcp_listen_err != nil do log.panic("Make tcp error:", tcp_listen_err)
    client, ep, tcp_accept_err := net.accept_tcp(soc)
    if tcp_accept_err != nil do log.error("Accept error:", tcp_accept_err)

    for {
        n, tcp_recv_err := net.recv_tcp(client, b[:])
        if tcp_recv_err != nil do log.error("Recv error:", tcp_recv_err)

        fmt.println(string(b[:n]))
        response := "HTTP/1.1 200 OK\r\nDate: Tue, 12 Nov 2025 17:10:00 GMT\r\nContent-Length: 3\r\nConnection: keep-alive\r\n\r\nhello"
        net.send_tcp(client,transmute([]u8)response)

        h, i, ok := header.Header_parser(string(b[:n]))
        fmt.printfln("%#v",h)
        fmt.println(i,ok)
        vmem.arena_destroy(&h.arena)

        n2, tcp_recv_err2 := net.recv_tcp(client, b[:])
        if tcp_recv_err2 != nil do log.error("Recv error:", tcp_recv_err2)
        fmt.println(string(b[:n2]))
    }
} */