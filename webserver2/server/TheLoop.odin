package loop

import "core:net"
import "core:time"
import "core:log"

TICK :: 100 * time.Millisecond
MAX_HEADER_LENGTH :: 8192

Server :: struct {

}

HeaderBuffer :: struct {
    data: [MAX_HEADER_LENGTH]u8,
    end: int,
    written: int
}

Header :: struct {
    pairs: map[string]string,
    buf: HeaderBuffer
}

BodyBuffer :: struct {
    data: []u8,
    written: int
}

Request :: struct {
    header: Header, 
    body: BodyBuffer
}

Conn :: struct {
    soc: net.TCP_Socket,
    req: Request
}

run :: proc (server: Server, port: int) {
    context.logger = log.create_console_logger()
    conns: [dynamic]Conn
    listener := init_listener_soc(port)

    for {
        cycle_start := time.now()
        defer {
            cycle_end := time.now()
            if diff := time.diff(cycle_start, cycle_end) ; diff < TICK {
                time.sleep(TICK - diff)
            }
        }

        listen(&conns, listener)









    }
}

@(private)
init_listener_soc :: proc (port: int) -> (soc: net.TCP_Socket) {
    err := proc (soc: ^net.TCP_Socket,  port: int) -> net.Network_Error {
        soc^ = net.listen_tcp(net.Endpoint { address = net.IP4_Address([4]u8{0,0,0,0}), port = port }) or_return
        net.set_blocking(soc^, false) or_return
        return nil
    } (&soc, port) 
    if err != nil do log.panic("Could not create listening socket!", err) 
    return 
}

@(private)
listen :: proc (conns: ^[dynamic]Conn, soc: net.TCP_Socket) {
    for {
        client, _, err := net.accept_tcp(soc)
        if err == .None && client != 0 {
            err := net.set_blocking(client, false) 
            if err != nil do log.panic("Can't set blocking!", err)
            append(conns, Conn { soc = client })
        } else if err == .Would_Block do break
        else do log.panic("Can't accept TCP connections!", err)        
    }
}

get_header :: proc (conns: ^[dynamic]Conn, ) {

}


 
