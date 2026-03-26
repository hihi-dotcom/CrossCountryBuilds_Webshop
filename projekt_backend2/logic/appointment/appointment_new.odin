package appointment

import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../pool"
import "../../pool/pool_mw"
import "../auth"
import "core:encoding/json"

@(private = "file")
BodyAs :: struct {
    appointmentDate: string,
}

@(private = "file")
JsonResponse :: struct {
    id: string,
}

appointment_new :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, appointment_new_query)
    })
}

@(private = "file")
appointment_new_query :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    as := new(BodyAs)
    if json.unmarshal(body^, as) != nil {
        util.reset(conn, 400, "JSON parsing failed.")
        return
    }

    if as.appointmentDate == "" {
        util.reset(conn, 400, "Missing parameter.")
        return
    }

    pool_mw.query(conn, appointment_new_respond, "appointment_new", {as.appointmentDate})
}

@(private = "file")
appointment_new_respond :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Failed to create appointment.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = `{"message": "Sikeres felvétel."}`
    })
    http.reset_conn(conn)
}