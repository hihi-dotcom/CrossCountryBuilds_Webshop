package loop

import "core:net"
import "core:time"
import "core:log"
import "core:c/libc"
import "core:fmt"

TICK :: 100 * time.Millisecond
TIMEOUT :: 5 * time.Second
MAX_HEADER_LENGTH :: 1024 //8192

Server :: struct {
    global: [dynamic]Handler,
    handlers: map[Endpoint][dynamic]Handler
}

Endpoint :: [2]string

Handler :: proc (conn: ^Conn) -> Appeal

Maybe_More :: union {
    Handler,
    []Handler
}

Appeal :: enum {
    None,
    Retry,
    Error,
    Stop
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

use :: proc (server: ^Server, handlers: ..Maybe_More) {
    concatonated := concatenate_handlers(..handlers)
    for h in concatonated {
        append(&server.global, h) 
    }
    delete(concatonated)
}

add :: proc (server: ^Server, ep: Endpoint, handlers: ..Maybe_More) {
    concatenated := concatenate_handlers(..handlers)
    server.handlers[ep] = concatenated
}

should_stop := false
run :: proc (server: Server, port: int) {
    context.logger = log.create_console_logger()
    signal := libc.signal(libc.SIGINT, proc "c" (i: i32) { if i == libc.SIGINT do should_stop = true  })
    conns: [dynamic]Conn
    listener := init_listener_soc(port)

    for !should_stop || len(conns) != 0 {
        cycle_start := time.now()
        defer {
            cycle_end := time.now()
            if diff := time.diff(cycle_start, cycle_end) ; diff < TICK {
                time.sleep(TICK - diff)
            }
        }
        
        if !should_stop do listen(&conns, listener)
        make_headers(&conns)
        serve(server, &conns)
    }
    
}

@(private="file")
serve :: proc (server: Server, conns: ^[dynamic]Conn) {
    for &conn, i in conns {
        if conn.req.header.done {
            res: Response
            if !run_handlers(&conn, conns, i, server.global) do continue
            if handler, ok := server.handlers[{conn.req.header.pairs["method"], conn.req.header.pairs["path"]}] ; ok {
                if !run_handlers(&conn, conns, i, handler) do continue
            } else {
                Send(&conn.soc, Response { status = 404 } )
                clean_up_Conn(&conn)
                unordered_remove(conns, i)
            }
        }
    }   
}

@(private="file")
run_handlers :: proc (conn: ^Conn, conns: ^[dynamic]Conn, index: int, handlers: [dynamic]Handler) -> bool {
    err: Appeal
    for h in handlers {
        err = h(conn)
        if err == .Retry || err == .Stop || err == .Error do break
    }
    if err == .Retry do return false
    if err == .Stop {
        return_Conn(conn)
        return false
    }
    if err == .Error {
        clean_up_Conn(conn)
        unordered_remove(conns, index)
        return false
    }
    return true
}

@(private="file")
concatenate_handlers :: proc (handlers: ..Maybe_More) -> (hlist: [dynamic]Handler) {
    for maybe, i in handlers {
        switch v in maybe {
            case Handler:
                append(&hlist, v)
            case []Handler:
                for h in v do append(&hlist, h) 
            case: log.panic("???")
        }
    }
    return
}
 
@(private="file")
return_Conn :: proc (conn: ^Conn) {
    delete(conn.req.body.data)
    delete(conn.req.header.pairs)
    new: Request
    new.header.buf.written += excess_header_data(&conn.req.header, new.header.buf.data[:])
    conn.req = new
}

excess_header_data :: proc (header: ^Header, to: []u8) -> (n: int) {
    n = copyer(header.buf.data[header.buf.end:header.buf.written], to)
    header.buf.end += n
    return n
}

@(private="file")
copyer :: proc (from: []u8, to: []u8) -> (written: int) {
    for b, i in from {
        to[i] = b
        written += 1
    }
    return
}

@(private="file")
init_listener_soc :: proc (port: int) -> (soc: net.TCP_Socket) {
    err := proc (soc: ^net.TCP_Socket,  port: int) -> net.Network_Error {
        ep := net.Endpoint { address = net.IP4_Address([4]u8{0,0,0,0}), port = port }
        soc^ = net.listen_tcp(ep) or_return
        log.info("Server started on", ep)
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
    Parse(&conn.req.header) or_return
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
    delete(conn.req.body.data)
    delete(conn.req.header.pairs)

    net.close(conn.soc.soc)
}
