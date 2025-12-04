package main

import "./server"
import "core:fmt"
import "core:strconv"

main :: proc () {
    s: server.Server

    server.use(&s, log_request)

    server.add(&s, {"GET", "/"}, send_hehe)

    server.add(&s, {"POST", "/"}, get_static_body, proc (conn: ^server.Conn) -> server.Appeal {
        fmt.println(string(conn.req.body.data[:]))
        res: server.Response
        res.status = 200
        res.options["content-length"] = "0" 
        server.Send(&conn.soc, res)
        delete(res.options)
        return .Stop
    })

    server.run(s, 30000)
}

log_request : server.Handler : proc (conn: ^server.Conn) -> server.Appeal {
    fmt.println(conn.req.header.pairs["method"], conn.req.header.pairs["path"])
    return .None
}

send_hehe : server.Handler : proc (conn: ^server.Conn) -> server.Appeal {
    file, len, _ := server.load_whole_file("./root/hehe.html")
    b: [1024]u8
    res: server.Response
    res.status = 200
    res.options["content-length"] = fmt.bprint(b[:], len)
    res.options["content-type"] = "text/html"
    res.body = file
    server.Send(&conn.soc, res)
    delete(file)
    delete(res.options)
    return .Stop
}

get_static_body : server.Handler : proc (conn: ^server.Conn) -> server.Appeal {
    if cl, ok := conn.req.header.pairs["content-length"] ; ok {
        if length, ok := strconv.parse_int(cl) ; ok {
            if len(conn.req.body.data) != length {
                conn.req.body.data = make([]u8, length)
            }
            conn.req.body.written += server.excess_header_data(&conn.req.header, conn.req.body.data)
            if conn.req.body.written == len(conn.req.body.data) do return .None
            n, ok := server.recv(&conn.soc, conn.req.body.data[conn.req.body.written:])
            if !ok do return .Error
            conn.req.body.written += n
            if conn.req.body.written == len(conn.req.body.data) {
                return .None
            } else {
                return .Retry
            }
        } else {
            server.Send(&conn.soc, { status = 411 })
            return .Error
        } 
    } else {
        server.Send(&conn.soc, { status = 411 })
        return .Error
    }
}