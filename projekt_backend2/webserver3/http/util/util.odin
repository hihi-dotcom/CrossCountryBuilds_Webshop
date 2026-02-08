package util

import "../../http"

stop :: proc (conn: ^http.Conn, status: int, message: string) {
    simple_send(conn.soc, status, message)
    conn.to_run = nil
}

reset :: proc (conn: ^http.Conn, status: int, message: string) {
    simple_send(conn.soc, status, message)
    http.reset_conn(conn)
}