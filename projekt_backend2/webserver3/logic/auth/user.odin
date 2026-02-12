package auth

import "../../pool"
import "../../pool/pool_mw"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "core:strconv"
import "core:log"

@(private = "file")
User :: struct {
    id: string,
    username: string,
    email: string,
    role: string
}

user :: proc (conn: ^http.Conn) {
    check_mw(conn, user_query)
}

@(private = "file")
user_query :: proc (conn: ^http.Conn) {
    payload := cast(^Payload)conn.user_data[Payload]

    buf := make([]u8, 12)
    pool_mw.query(conn, user_return, "get_user_by_id", {strconv.write_int(buf[:], i64(payload.id), 10)})
}

@(private = "file")
user_return :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, errMs := pool.status(result)
    if status != .TuplesOK {
        log.error(errMs)
        util.stop(conn, 500, "Internal server error.")
        return
    }

    user_table := pool.unmarshal(result)

    user_data := User{
        email = user_table[0]["email"],
        username = user_table[0]["username"],
        id = user_table[0]["id"],
        role = user_table[0]["role"]
    }

    body_bytes, _ := json.marshal(user_data)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(body_bytes)
    })
    http.reset_conn(conn)
}