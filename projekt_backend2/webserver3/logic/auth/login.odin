package auth

import "../../pool"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "core:encoding/json"

import "core:log"
import "core:fmt"

@(private = "file")
BodyAs :: struct {
    username: string,
    password: string
}

login :: proc (conn: ^http.Conn) {
    mw.application_json(conn, login_query)
}

@(private = "file")
login_query :: proc (conn: ^http.Conn) {
    body := (cast(mw.StaticBody)conn.user_data[mw.StaticBody])^

    as := new(BodyAs)
    json.unmarshal(body, as)

    if as.password == "" || as.username == "" {
        util.stop(conn, 400, "Missing paramter.")
        return
    }
    conn.user_data[BodyAs] = as
    pool.query_mw(conn, login_verify, "get_user_id_role_and_password_by_username", "testuser")
    fmt.println( as.username)
}

@(private = "file")
login_verify :: proc (conn: ^http.Conn) {
    as := cast(^BodyAs)conn.user_data[BodyAs]
    resutl := cast(pool.Result)conn.user_data[pool.Result]
    
    status, errMsg := pool.status(resutl)
    if status != .TuplesOK {
        log.error(errMsg)
        util.reset(conn, 500, "Internal server error.")
        return
    }
    data := pool.unmarshal(resutl)
    fmt.println(data)
    util.reset(conn, 200, "test")
}
