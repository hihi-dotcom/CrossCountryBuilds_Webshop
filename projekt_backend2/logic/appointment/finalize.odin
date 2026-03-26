package appointment

import "../../pool"
import "../../pool/pool_mw"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../auth"
import "core:encoding/json"
import "core:fmt"

@(private = "file")
FinalizeBody :: struct {
    service_id: string,
    service_price: int,
    bringback_date: string,
}

finalize :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.reset(conn, 400, "Missing id parameter.")
        return
    }
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, finalize_start)
    })
}

@(private = "file")
finalize_start :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]

    input := new(FinalizeBody)
    if json.unmarshal(body^, input) != nil {
        util.reset(conn, 400, "Invalid JSON format.")
        return
    }

    pool_mw.query(conn, finalize_finish, "finalize_appointment", 
        {qp["id"], input.service_id, fmt.aprintf("%d", input.service_price), input.bringback_date})
}

@(private = "file")
finalize_finish :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Failed to finalize appointment.")
        return
    }

    tables := pool.unmarshal(result)
    if len(tables) == 0 {
        util.reset(conn, 404, "Appointment not found.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        }, 
        body = `{"message": "Appointment finalized successfully"}`
    })
    http.reset_conn(conn)
}