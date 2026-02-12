package appointment

import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../pool"
import "../../pool/pool_mw"
import "../../logic/auth"
import "core:encoding/json"
import "core:fmt"

user_delete :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.stop(conn, 400, "Missing parameter")
        return
    }
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp
    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]
        pool_mw.query(conn, user_delete_responder, "delete_user", {qp["id"]})
    })
}

@(private = "file")
user_delete_responder :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .CommandOK {
        util.stop(conn, 500, "Failed to delete user.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = `{"message": "User deleted successfully"}`
    })
    http.reset_conn(conn)
}