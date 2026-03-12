package appointment

import "core:encoding/json"
import "core:fmt"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../pool"
import "../../pool/pool_mw"
import "../../logic/auth"


@(private = "file")
BookBody :: struct {
    problem_description: string,
}

@(private = "file")
FinalizeBody :: struct {
    service_id: string,
    price: int,
    bringBackDate: string,
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

    finalizeBody := new(FinalizeBody)
    if json.unmarshal(body^, finalizeBody) == nil && finalizeBody.price > 0 {
        // SECURITY: Only admins can finalize appointments (set price, service, bringback date)
        if payload.role != "admin" {
            util.reset(conn, 403, "Only administrators can finalize appointments.")
            return
        }
        conn.user_data[^FinalizeBody] = finalizeBody
        pool_mw.query(conn, appointment_finalize_respond, "finalize_appointment",
            {fmt.aprint(qp["id"]), finalizeBody.service_id, fmt.aprint(finalizeBody.price), finalizeBody.bringBackDate})
        return
    }

    bookBody := new(BookBody)
    if json.unmarshal(body^, bookBody) != nil {
        util.reset(conn, 400, "JSON parsing failed.")
        return
    }

    if bookBody.problem_description == "" {
        util.reset(conn, 400, "Missing parameter.")
        return
    }

    pool_mw.query(conn, appointment_book_respond, "appoint_appointment",
        {fmt.aprint(qp["id"]), fmt.aprint(payload.id), bookBody.problem_description})
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

@(private = "file")
appointment_finalize_respond :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .CommandOK {
        util.stop(conn, 500, "Failed to finalize appointment.")
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