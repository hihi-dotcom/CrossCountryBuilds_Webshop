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

@(private = "file")
BodyAs :: struct {
    status: string
}

order_status :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, order_start_update)
    })
}

@(private = "file")
order_start_update :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]

    as := new(BodyAs)
    json.unmarshal(body^, as)
    if as.status == "" && qp["id"] != "" {
        util.stop(conn, 400, "Missing parameters.")
        return
    }

    pool_mw.query(conn, order_status_finish, "order_status_update", {as.status, qp["id"]})
}

@(private = "file")
order_status_finish :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .CommandOK {
        util.reset(conn, 500, "Failed to update status.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:appliaction/json"
        }, 
        body = `{"message": "Status updated successfully"}`
    })
    http.reset_conn(conn)
}