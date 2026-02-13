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
BodyAs :: struct {
    description: string 
}

appointment_book :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.stop(conn, 400, "Missing parameter.")
        return
    }
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, appointment_book_query)
    })
}

@(private = "file")
appointment_book_query :: proc (conn: ^http.Conn) {
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]
    payload := cast(^auth.Payload)conn.user_data[auth.Payload]
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    as := new(BodyAs)
    json.unmarshal(body^, as)

    if as.description == "" {
        util.reset(conn, 400, "Missing parameter.")
        return
    }

    pool_mw.query(conn, appointment_book_respond, "appoint_appointment", 
        {fmt.aprint(payload.id), fmt.aprint(qp["id"]), as.description})
}

@(private = "file")
appointment_book_respond :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .CommandOK {
        util.stop(conn, 500, "Failed to update appointment.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = `{"message": "Appointment booked successfully"}`
    })
    http.reset_conn(conn)
}