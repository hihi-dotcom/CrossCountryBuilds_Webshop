package middleware

import "../../http"
import "../util"

application_json :: proc (conn: ^http.Conn, to_run_after: http.Handler) {
    header, ok := conn.header["content-type"]
    if !ok ||
    len(header[0]) < len("application/json") ||
    header[0][:len("application/json")] != "application/json" {
        util.simple_send(conn.soc, 406, "This route expects json body.")
        conn.to_run = nil
        return
    }
    static_body(conn, to_run_after)
}