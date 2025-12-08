package test

import "base:runtime"
import "core:net"
import "core:fmt"
import "core:time"
import "core:c/libc"
import "../pq"

main :: proc () {
    conn := pq.connectdb("dbname=hehe user=postgres password=1234 host=127.0.0.1 port=5432")
    
    if status := pq.status(conn) ; status != pq.Conn_Status.OK {
        fmt.println("Connection error: ", status)
        pq.finish(conn)
        return
    } else {
        fmt.println("jo?", status)
        pq.finish(conn)
        return
    }
}