package auth

import "../../pool"
import "../../pool/pool_mw"
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
    confirmPassword: string,
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

    if as.username == "" || as.email == "" || as.password == "" || as.confirmPassword == "" {
        util.reset(conn, 400, "One or more parameters missing.")
        return
    }  

    if as.password != as.confirmPassword {
        util.reset(conn, 400, "A jelszavak nem egyeznek meg.")
        return
    }

    conn.user_data[BodyAs] = as

    hash := passwd.hash(as.password)

    pool_mw.query(conn, register_is_good, "insert_user", {as.username, as.email, hash})
}

@(private = "file")
register_is_good :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    as := cast(^BodyAs)conn.user_data[BodyAs]

    status, errMs := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 409, "There is already a user with this username or email.")
        return
    }

    new_user := pool.unmarshal(result)

    new_token := token.sign(fmt.aprint(new_user[0]["id"], "$", new_user[0]["role"], sep = ""), 5 * time.Hour)
    resopnse_body, marshal_err := json.marshal(Token{token=new_token})
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