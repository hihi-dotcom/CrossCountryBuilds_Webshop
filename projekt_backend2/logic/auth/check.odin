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
        util.reset(conn, 401, "Unathorised")
        return
    }

    incoming_token_with_bearer := incoming_tokens[0]
    // SECURITY: Validate "Bearer " prefix exists before slicing
    if len(incoming_token_with_bearer) < 7 || incoming_token_with_bearer[:7] != "Bearer " {
        util.reset(conn, 401, "Invalid authorization header format")
        return
    }
    incoming_token := incoming_token_with_bearer[7:]

    payload, authentic := token.verify(incoming_token)
    if !authentic {
        util.reset(conn, 401, "Token expired")
        return
    }

    conn.user_data[Payload] = convert(payload)
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
        util.reset(conn, 401, "Unathorised")
        return
    }
    conn.to_run = state.to_run_after
}

@(private = "file")
convert :: proc (payload: string) -> ^Payload {
    index_of := 0
    for char, i in payload {
        if char == '$' {
            index_of = i
            break
        }
    }

    id_string := payload[:index_of]
    role := payload[index_of + 1:]
    id, _ := strconv.parse_int(id_string, 10)

    the_payload := new(Payload)
    the_payload.id = id
    the_payload.role = role

    return the_payload
}