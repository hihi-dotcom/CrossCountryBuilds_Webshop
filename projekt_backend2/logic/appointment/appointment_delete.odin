package appointment

import "../../pool"
import "../../http"
import "../../http/util"
import "../../pool/pool_mw"
import "../auth"

appointment_delete :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.reset(conn, 400, "Missing parameter.")
        return
    }
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_admin_mw(conn, appointment_delete_query)
}

@(private = "file")
appointment_delete_query :: proc (conn: ^http.Conn) {
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]
    pool_mw.query(conn, appointment_delete_respond, "appointment_delete", {qp["id"]})
}

@(private = "file")
appointment_delete_respond :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Failed to delete appointment.")
        return
    }

    tables := pool.unmarshal(result)
    if len(tables) == 0 {
        util.reset(conn, 404, "Appointment doesn't exist.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = `{"message": "Appointment deleted successfully"}`
    })
    http.reset_conn(conn)
}