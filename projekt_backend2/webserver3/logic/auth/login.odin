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
import "core:fmt"

@(private = "file")
BodyAs :: struct {
    username: string,
    password: string
}

@(private = "file")
Token :: struct {
    token: string
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
    pool_mw.query(conn, login_verify, "get_user_id_role_and_password_by_username", {as.username})
}

@(private = "file")
login_verify :: proc (conn: ^http.Conn) {
    as := cast(^BodyAs)conn.user_data[BodyAs]
    resutl := cast(pool.Result)conn.user_data[pool.Result]
    
    status, errMsg := pool.status(resutl)
    if status != .TuplesOK {
        util.stop(conn, 500, "Internal server error. 1")
        return
    }

    data := pool.unmarshal(resutl)
    if len(data) == 0 {
        util.reset(conn, 401, "Wrong password or username.")
        return
    }

    username, password, id, role, ok := proc(data: pool.StrMap) -> (username: string, password: string, id: int, role: string, ok: bool){
        username = data[0]["username"] or_return
        password = data[0]["password"] or_return
        role = data[0]["role"] or_return
        id_string := data[0]["id"] or_return
        id = strconv.parse_int(id_string) or_return
        ok = true
        return 
    } (data) 
    if !ok  {
        util.stop(conn, 500, "Internal server error. 2")
        return
    }

    if !passwd.verify(as.password, password) {
        util.reset(conn, 401, "Wrong password or username.")
        return
    }

    token := token.sign(fmt.aprint(id, "$", role, sep = ""), 5 * time.Hour)
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
