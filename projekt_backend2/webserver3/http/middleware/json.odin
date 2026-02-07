package middleware

import JsonParser "core:encoding/json"

import "../../http"
import "../util"

@(private = "file")
JsonState :: struct {
    to_run_after: http.Handler
}

Json :: JsonParser.Value

json :: proc (conn: ^http.Conn, to_run_after: http.Handler) {
    json_state := new(JsonState)
    json_state.to_run_after = to_run_after
    conn.user_data[JsonState] = json_state

    static_body(conn, try_make_json)
}

@(private = "file")
try_make_json :: proc (conn: ^http.Conn) {
    state := cast(^JsonState)conn.user_data[JsonState]
    body := cast(StaticBody)conn.user_data[StaticBody]

    value, err := JsonParser.parse(body^)
    if err != nil {
        util.simple_send(conn.soc, 400, "Can't parse body as json.")
        conn.to_run = nil
        return
    }

    json := new(Json)
    json^ = value
    conn.user_data[Json] = json
    conn.to_run = state.to_run_after
}