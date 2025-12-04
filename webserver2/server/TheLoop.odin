package loop

import "core:net"
import "core:time"
import "core:log"
import "core:fmt"

TICK :: 100 * time.Millisecond
TIMEOUT :: 5 * time.Second
MAX_HEADER_LENGTH :: 1024 //8192

Server :: struct {

}

BodyBuffer :: struct {
    data: []u8,
    written: int
}

Request :: struct {
    header: Header,
    body: BodyBuffer
}

Socket :: struct {
    soc: net.TCP_Socket,
    last_heard: time.Time
}

Conn :: struct {
    soc: Socket,
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

        make_headers(&conns)

        for v, i in conns {
            if !v.req.header.done {
                fmt.println(v)
            }  
        }

    }
}

@(private="file")
init_listener_soc :: proc (port: int) -> (soc: net.TCP_Socket) {
    err := proc (soc: ^net.TCP_Socket,  port: int) -> net.Network_Error {
        soc^ = net.listen_tcp(net.Endpoint { address = net.IP4_Address([4]u8{0,0,0,0}), port = port }) or_return
        net.set_blocking(soc^, false) or_return
        return nil
    } (&soc, port) 
    if err != nil do log.panic("Could not create listening socket!", err) 
    return 
}

@(private="file")
listen :: proc (conns: ^[dynamic]Conn, soc: net.TCP_Socket) {
    for {
        client, _, err := net.accept_tcp(soc)
        if err == .None && client != 0 {
            err := net.set_blocking(client, false) 
            if err != nil do log.panic("Can't set blocking!", err)
            append(conns, Conn { soc = Socket { soc = client, last_heard = time.now() } })
        } else if err == .Would_Block do break
        else do log.panic("Can't accept TCP connections!", err)        
    }
}

@(private="file")
make_headers :: proc (conns: ^[dynamic]Conn) {
    for &conn, i in conns {
        if !get_header(&conn) {
            clean_up_Conn(&conn)
            unordered_remove(conns, i)
        }
    }
}

@(private="file")
get_header :: proc (conn: ^Conn) -> bool {
    recv_header(conn) or_return
    Parse(&conn.req.header) or_return
    return true
}

@(private="file")
recv_header :: proc (conn: ^Conn) -> bool {
    n, ok := recv(&conn.soc, conn.req.header.buf.data[conn.req.header.buf.written:])
    conn.req.header.buf.written += n
    return ok
}

@(private="file")
recv :: proc (soc: ^Socket, to: []u8) -> (recived: int, ok: bool) {
    n, recvErr := net.recv_tcp(soc.soc, to)
    #partial switch recvErr {
        case .None: 
            if n == 0 do return 0, false
            else do soc.last_heard = time.now()
        case .Would_Block: 
            if diff := time.diff(soc.last_heard, time.now()) ; diff > TIMEOUT do return 0, false
        case: return 0, false
    }
    return n, true
}

@(private="file")
clean_up_Conn :: proc (conn: ^Conn) {
    if conn.req.body.written != 0 {
        delete(conn.req.body.data)
    }
    net.close(conn.soc.soc)
}

 
