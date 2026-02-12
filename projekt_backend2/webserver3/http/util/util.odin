package util

import "../../http"
import "core:fmt"

stop :: proc (conn: ^http.Conn, status: int, message: string) {
    simple_json_send(conn.soc, status, fmt.aprint("{\"message\":\"", message,"\",\"ok\": \"false\"}", sep=""))
    conn.to_run = nil
}

reset :: proc (conn: ^http.Conn, status: int, message: string) {
    simple_json_send(conn.soc, status, fmt.aprint("{\"message\":\"", message,"\",\"ok\": \"false\"}", sep=""))
    http.reset_conn(conn)
}