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
import "core:fmt"

Payload :: struct {
    role: string,
    id: int
}

@(private = "file")
State :: struct {
    to_run_after: http.Handler
} 

check_mw :: proc (conn: ^http.Conn, to_run_after: http.Handler) {
    incoming_tokens, ok := conn.header["authorization"]
    if !ok {
        util.reset(conn, 401, "Unauthorized")
        return
    }

    incoming_token_with_bearer := incoming_tokens[0]
    if len(incoming_token_with_bearer) < 7 || incoming_token_with_bearer[:7] != "Bearer " {
        util.reset(conn, 401, "Invalid authorization header format")
        return
    }
    incoming_token := incoming_token_with_bearer[7:]

    payload, authentic := token.verify(incoming_token)
    if !authentic {
        util.reset(conn, 401, "Token expired or invalid")
        return
    }

    payload_ptr := convert(payload)
    if payload_ptr == nil {
        util.reset(conn, 401, "Invalid token payload")
        return
    }
    conn.user_data[Payload] = payload_ptr
    conn.to_run = to_run_after
}

check_admin_mw :: proc (conn: ^http.Conn, to_run_after: http.Handler) {
    state := new(State)
    state.to_run_after = to_run_after
    conn.user_data[State] = state

    check_mw(conn, check_admin_end)
}

@(private = "file")
check_admin_end :: proc (conn: ^http.Conn) {
    state := cast(^State)conn.user_data[State]
    payload := cast(^Payload)conn.user_data[Payload]

    if payload.role != "admin" {
        util.reset(conn, 401, "Unauthorized")
        return
    }
    conn.to_run = state.to_run_after
}

@(private = "file")
convert :: proc (payload: string) -> ^Payload {
    index_of := -1
    for char, i in payload {
        if char == '$' {
            index_of = i
            break
        }
    }

    if index_of <= 0 {
        return nil
    }

    id_string := payload[:index_of]
    role := payload[index_of + 1:]
    id, ok := strconv.parse_int(id_string, 10)
    if !ok {
        return nil
    }

    the_payload := new(Payload)
    the_payload.id = id
    the_payload.role = role

    return the_payload
}