package middleware

import "core:strconv"

import "../../http"
import "../util"

StaticBody :: ^[]u8

@(private = "file")
StaticBodyState :: struct {
    body: StaticBody,
    written_till: int,

    to_run_after: http.Handler
}

static_body :: proc (conn: ^http.Conn, to_run_after: http.Handler) {
    content_length_string, header_exists := conn.header["content-length"]
    if !header_exists {
        util.simple_send(conn.soc, 411, "No content length provided.")
        conn.to_run = nil
        return
    }

    content_length, can_conv := strconv.parse_int(content_length_string[0])
    if !can_conv {
        util.simple_send(conn.soc, 400, "Malformed request.")
        conn.to_run = nil
        return
    }

    state := new(StaticBodyState)
    state.body = new([]u8)
    state.body^ = make([]u8, content_length)
    state.to_run_after = to_run_after
    conn.user_data[StaticBodyState] = state
    
    state.written_till += http.copy_leftover_header_data(conn, state.body^)
    conn.to_run = try_get_body
}

@(private = "file")
try_get_body :: proc (conn: ^http.Conn) {
    state := cast(^StaticBodyState)conn.user_data[StaticBodyState]

    if state.written_till != len(state.body^) {
        n, should_close_socket := http.try_recv(conn, state.body^[state.written_till:])
        if should_close_socket {
            util.simple_send(conn.soc, 400, "There was a problem reciving the body.")
            conn.to_run = nil
            return
        }
        state.written_till += n
    } else {
        conn.user_data[StaticBody] = state.body
        conn.to_run = state.to_run_after
    }
}