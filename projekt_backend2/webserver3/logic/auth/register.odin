package auth

import "../../pool"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../passwd"
import "../../token"
import "core:encoding/json"
import "core:strconv"
import "core:time"

import "core:log"
import "core:fmt"

@(private = "file")
BodyAs :: struct {
    username: string,
    password: string,
    email: string
}

@(private = "file")
Token :: struct {
    token: string
}


register :: proc (conn: ^http.Conn) {
    mw.application_json(conn, register_start_query)
}

@(private = "file")
register_start_query :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    as := new(BodyAs)
    if json.unmarshal(body^, as) != nil {
        util.stop(conn, 400, "Body is not parsable as json.")
        return
    }

    if as.username == "" || as.email == "" || as.password == "" {
        util.reset(conn, 400, "One or more parameters missing.")
        return
    }  

    conn.user_data[BodyAs] = as

    hash := passwd.hash(as.password)

    pool.query_mw(conn, register_is_good, "insert_user", {as.username, as.email, hash})
}

@(private = "file")
register_is_good :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    as := cast(^BodyAs)conn.user_data[BodyAs]

    status, errMs := pool.status(result)
    if status != .CommandOK {
        util.reset(conn, 409, "There is already a user with this username or email.")
        return
    }

    pool.query_mw(conn, register_token, "get_user_id_role_and_password_by_username", {as.username})
}

@(private = "file")
register_token :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, errMs := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Internal server error.")
        return
    }

    new_user := pool.unmarshal(result)

    token := token.sign(fmt.aprint(new_user[0]["id"], "$", new_user[0]["role"]), 5 * time.Hour)
    resopnse_body, marshal_err := json.marshal(Token{token=token})
    if marshal_err != nil {
        util.stop(conn, 500, "Marshal error.")
        return
    }

    util.static_send(conn.soc, util.Response{
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(resopnse_body)
    })
    http.reset_conn(conn)
}