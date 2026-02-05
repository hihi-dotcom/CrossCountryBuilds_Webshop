package http

import "core:net"
import "core:time"
import "core:log"
import vmem "core:mem/virtual"

TICK :: 100 * time.Millisecond
TIMEOUT :: 5 * time.Second
MAX_NEW_CONNECTIONS_IN_ONE_GO :: 100
MAX_CONNECTIONS :: 1000
HEADER_SIZE :: 1024 * 8
MAX_NUMBER_OF_SAME_HEADERS :: 2


Conn :: struct {
    soc: net.TCP_Socket,
    source: net.Endpoint,
    last_heard: time.Time,
    header: Header,
    header_data: HeaderData,
    user_data: map[typeid]any,
    to_run: Handler,

    arena: vmem.Arena
}

Header :: map[string][MAX_NUMBER_OF_SAME_HEADERS]string

Handler :: proc (conn: ^Conn)

@(private = "file")
Conns :: [dynamic]Conn

listen_and_serve :: proc (on_request: Handler, port: int) {
    context.logger = log.create_console_logger()
    conns: Conns
    listener := create_listener(port)

    for {
        start := time.now()
        defer {
            if diff := time.diff(start, time.now()) ; diff < TICK {
                time.sleep(TICK - diff)
            }
        }

        listen(&conns, on_request, listener)
        make_headers(&conns)
        serve(&conns)
    }

}

try_recv :: proc (conn: ^Conn, buf: []u8) -> (bytes_read: int, should_close_socket: bool) {
    now := time.now()
    n, err :=  net.recv_tcp(conn.soc, buf)
    if err == .Would_Block && time.diff(conn.last_heard, now) > TIMEOUT do return 0, true
    if err == .Would_Block do return 0, false
    if err != nil && err != .Would_Block do return 0, true
    if err == nil && n == 0 do return 0, true

    conn.last_heard = now
    return n, false
}

reset_conn :: proc (conn: ^Conn, to_run: proc(^Conn)) {
    vmem.arena_destroy(&conn.arena)
    conn^ = {}
    conn.last_heard = time.now()
    conn.to_run = to_run
}

@(private = "file")
make_headers :: proc (conns: ^Conns) {
    for &conn, i in conns {
        if conn.header_data.done do continue
        n, should_close := try_recv(&conn, conn.header_data.buf[conn.header_data.written_till:])
        conn.header_data.written_till += n
        if should_close {
            delete_conn_from_conns(conns, i)
            continue
        } 
        if n == 0 do continue
        if Parse(&conn) {
            delete_conn_from_conns(conns, i)
            continue
        } 
    }
}

@(private = "file")
create_listener :: proc (port: int) -> (soc: net.TCP_Socket) {
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

@(private = "file")
listen :: proc (conns: ^Conns, on_request: Handler, soc: net.TCP_Socket) {
    new_connections := 0
    for {
        if len(conns) > MAX_CONNECTIONS do return
        if new_connections > MAX_NEW_CONNECTIONS_IN_ONE_GO do return
        defer new_connections += 1

        client, source, err := net.accept_tcp(soc)
        set_blocking_err := net.set_blocking(client, false)

        if set_blocking_err != nil do log.panic("Cannot set blocking of socket!", set_blocking_err)
        if err == .Would_Block do return
        if err != nil && err != .Would_Block do log.panic("There is an error with the listener socket: ", err)
        

        new_conn: Conn

        new_conn.to_run = on_request
        new_conn.soc = client
        new_conn.source = source
        new_conn.last_heard = time.now()

        arena_init_err := vmem.arena_init_growing(&new_conn.arena)
        if arena_init_err != nil do log.panic("Could not initialise arena:", arena_init_err)
        arena_allocator := vmem.arena_allocator(&new_conn.arena)
        
        new_conn.header_data.buf = make([]u8, HEADER_SIZE, arena_allocator)
        new_conn.user_data = make(map[typeid]any, arena_allocator)
        new_conn.header = make(map[string][MAX_NUMBER_OF_SAME_HEADERS]string, arena_allocator)

        append(conns, new_conn)
    }
}

@(private = "file")
delete_conn_from_conns :: proc (conns: ^Conns, i: int) {
    net.close(conns[i].soc)
    vmem.arena_destroy(&conns[i].arena)
    unordered_remove(conns, i)
}

@(private = "file")
serve :: proc (conns: ^Conns) {
    for &conn, i in conns {
        if !conn.header_data.done do continue
        if conn.to_run == nil {
            delete_conn_from_conns(conns, i)
            continue
        }
        context.allocator = vmem.arena_allocator(&conn.arena) 
        conn.to_run(&conn)
    }
}