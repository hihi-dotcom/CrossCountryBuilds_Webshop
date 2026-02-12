package appointment

import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../pool"
import "../../pool/pool_mw"
import "../../logic/auth"
import "core:encoding/json"
import "core:fmt"

@(private = "file")
ResponseFromat :: struct {
    id: string,
    username: string,
    email: string,
    role: string,
}

user_all :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, proc(conn: ^http.Conn) {
        pool_mw.query(conn, user_all_responder, "user_all")
    })
}

@(private = "file")
user_all_responder :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.stop(conn, 500, "Failed to delete user.")
        return
    }

    table := pool.unmarshal(result)

    response := make([]ResponseFromat, len(table))
    for &r, i in response {
        r.email = table[i]["email"]
        r.id = table[i]["id"]
        r.role = table[i]["role"]
        r.username = table[i]["username"]
    }

    response_body, _ := json.marshal(response)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(response_body)
    })
    http.reset_conn(conn)
}