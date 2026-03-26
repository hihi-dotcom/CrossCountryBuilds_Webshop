package appointment

import "core:encoding/json"
import "../../http"
import "../../http/util"
import "../../pool"
import "../../pool/pool_mw"
import "../auth"

@(private = "file")
ResponseFromat :: struct {
    id: string,
    service_date: string,
}

appointment_get_free :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        pool_mw.query(conn, appointment_get_free_responder, "appointment_get_free")
    })
}

@(private = "file")
appointment_get_free_responder :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Getting appointments failed.")
        return
    }

    table := pool.unmarshal(result)

    response := make([]ResponseFromat, len(table))
    for &resp, i in response {
        resp.id = table[i]["id"]
        resp.service_date = table[i]["service_date"]
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