package appointment

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "../../pool/pool_mw"
import "../auth"

appointment_by_id :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.stop(conn, 400, "Missing parameter")
        return
    }

    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_admin_mw(conn, appointment_by_id_query)
}

@(private = "file")
appointment_by_id_query :: proc (conn: ^http.Conn) {
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]
    pool_mw.query(conn, appointment_by_id_respond, "appointment_by_id", {qp["id"]})
}

@(private = "file")
appointment_by_id_respond :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.stop(conn, 500, "Internal server error.")
        return
    }

    tables := pool.unmarshal(result)

    appointments := make([]Appointment, len(tables))
    for table, i in tables {
        appointments[i].id = table["id"]
        appointments[i].service_date = table["service_date"]
        appointments[i].user_id = table["user_id"]
        username, ok := table["username"]
        appointments[i].customer_name = username if ok else ""
        appointments[i].problem_description = table["problem_description"]
        appointments[i].service_name = table["service_name"]
        appointments[i].service_price = table["service_price"]
        appointments[i].bringback_date = table["bringback_date"]
        if table["bringback_date"] != "" {
            appointments[i].status = "kész"
        } else {
            appointments[i].status = "folyamatban"
        }
    }

    body_bytes, _ := json.marshal(appointments)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(body_bytes)
    })
    http.reset_conn(conn)
}