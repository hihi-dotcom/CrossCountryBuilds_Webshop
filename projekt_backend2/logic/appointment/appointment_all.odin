package appointment

import "core:encoding/json"
import "../../http"
import "../../http/util"
import "../../pool"
import "../../pool/pool_mw"
import "../auth"

Appointment :: struct {
    id: string,
    service_date: string,
    user_id: string,
    customer_name: string,
    problem_description: string,
    service_name: string,
    service_price: string,
    bringback_date: string,
    status: string,
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
        appointments[i].service_date = table["service_date"]
        appointments[i].user_id = table["user_id"]
        username, ok := table["username"]
        appointments[i].customer_name = username if ok else ""
        appointments[i].problem_description = table["problem_description"]
        appointments[i].service_name = table["service_name"]
        appointments[i].service_price = table["service_price"]
        appointments[i].bringback_date = table["bringback_date"]
        appointments[i].status = table["status"]
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