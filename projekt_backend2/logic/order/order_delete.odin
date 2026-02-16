package orders

import "../../pool"
import "../../pool/pq"
import "../../pool/pool_mw"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../passwd"
import "../../token"
import "../auth"
import "core:encoding/json"
import "core:strconv"
import "core:time"
import "core:fmt"
import "core:log"
import "core:text/regex"
import "core:strings"

order_delete :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_admin_mw(conn, order_delete_delete)
}

@(private = "file")
order_delete_delete :: proc (conn: ^http.Conn) {
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]

    if qp["id"] == "" {
        util.stop(conn, 400, "Missing parameters.")
        return
    }

    pool_mw.query(conn, order_delete_delete_delete, "order_delete", {qp["id"]})
}

@(private = "file")
order_delete_delete_delete :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .CommandOK {
        util.reset(conn, 500, "Failed to delete order.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        }, 
        body = `{"message": "Order deleted successfully"}`
    })
    http.reset_conn(conn)
}