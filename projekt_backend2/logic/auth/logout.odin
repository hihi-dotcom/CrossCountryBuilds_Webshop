package auth

import "../../http"
import "../../http/util"

logout :: proc (conn: ^http.Conn) {
    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = `{"ok":true,"message":"Logged out successfully"}`
    })
    http.reset_conn(conn)
}