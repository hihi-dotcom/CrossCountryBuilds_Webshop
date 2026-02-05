package main

import "core:fmt"
import "core:thread"
import "core:net"
import "core:sync/chan"
import "core:time"

import "http"
import "http/util"
import "http/pq"

main :: proc () {
    conn := pq.connectdb("host=localhost port=5432 dbname=webshop user=webshop-root password=1234")
    defer pq.finish(conn)
    fmt.println(pq.status(conn))

    result := pq.exec(conn, "SELECT * from users")

    fmt.println(pq.resultStatus(result))
    fmt.println(pq.nfields(result))
    fmt.println(pq.ntuples(result))
    fmt.println(pq.fname(result, 1))
    fmt.println(pq.fname(result, 2))
}

/*
http.listen_and_serve(30000, proc (conn: ^http.Conn) {
        if conn.header["path"][0] == "/" {
            util.Send(conn^, util.Response{
                status = 200,
                header = {
                    fmt.aprint("content-length:", 6)
                },
                body = fmt.aprint("hello!")
            })
            http.reset_conn(conn)
            return
        }
        util.Send(conn^, util.Response {
            status = 404,
            header = {
                fmt.aprint("content-length:", 10),
                fmt.aprint("test header:", "really test")
            },
            body = fmt.aprint("Nem talalt")
        })
        http.reset_conn(conn)
    })
*/


