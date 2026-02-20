package pool_mw

import "../../http"
import "../../pool"

@(private = "file")
PinMwState :: struct {
    ticket: int,
    to_run_after: http.Handler,
    prepared_name: cstring,
    params: []string
}

release :: proc (conn: http.Conn) {
    state := cast(^PinMwState)conn.user_data[PinMwState]
    pool.release(state.ticket)
}

pin :: proc (conn: ^http.Conn, to_run_after: http.Handler, prepared_name: cstring, params: []string = {}) {
    state_ptr, exists := conn.user_data[PinMwState]

    if exists {
        state := cast(^PinMwState)state_ptr

        state.params = make([]string, len(params))
        copy(state.params, params)
        state.prepared_name = prepared_name
        state.to_run_after = to_run_after

        conn.to_run = pin_exec
        return
    }
    
    state := new(PinMwState)
    state.params = make([]string, len(params))
    copy(state.params, params)
    state.prepared_name = prepared_name
    state.to_run_after = to_run_after
    state.ticket = -1
    conn.user_data[PinMwState] = state

    conn.to_run = pin_actually
}

@(private = "file")
pin_actually :: proc (conn: ^http.Conn) {
    state := cast(^PinMwState)conn.user_data[PinMwState]

    ticket := pool.pin()
    if ticket == -1 do return

    state.ticket = ticket
    conn.to_run = pin_exec
}

@(private = "file")
pin_exec :: proc (conn: ^http.Conn) {
    state := cast(^PinMwState)conn.user_data[PinMwState]

    pool.exec_pinned(state.prepared_name, state.params, state.ticket)
    conn.to_run = pin_poll
}

@(private = "file")
pin_poll :: proc (conn: ^http.Conn) {
    state := cast(^PinMwState)conn.user_data[PinMwState]

    result, ready := pool.poll(state.ticket)
    if !ready do return

    conn.user_data[pool.Result] = result
    conn.to_run = state.to_run_after
}