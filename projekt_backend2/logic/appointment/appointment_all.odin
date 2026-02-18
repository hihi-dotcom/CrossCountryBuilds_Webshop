package appointment

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "../../pool/pool_mw"
import "../auth"

Appointment :: struct {
    id: string,
    appointmentDate: string,
    user_id: string,
    description: string,
}

appointment_all :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, appointment_all_query)
}

@(private = "file")
appointment_all_query :: proc (conn: ^http.Conn) {
    pool_mw.query(conn, appointment_all_respond, "appointment_all", {})
}

@(private = "file")
appointment_all_respond :: proc (conn: ^http.Conn) {
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
        appointments[i].appointmentDate = table["service_date"]
        appointments[i].user_id = table["user_id"]
        appointments[i].description = table["problem_description"]
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