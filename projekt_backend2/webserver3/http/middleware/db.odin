package middleware

import "../../http"
import "../../pool"
import "../../pool/pq"

@(private = "file")
QueryState :: struct {
    to_run_after: http.Handler,
    ticket: int,
    prepared_name: cstring,
    params: []any
}

query :: proc (conn: ^http.Conn, to_run_after: http.Handler, prepared_name: cstring, params: ..any) {
    query_state := new(QueryState)
    query_state.to_run_after = to_run_after
    query_state.ticket = -1
    query_state.prepared_name = prepared_name
    query_state.params = params
    conn.user_data[QueryState] = query_state
    
    conn.to_run = try_get_pool_thread
}

@(private = "file")
try_get_pool_thread :: proc (conn: ^http.Conn) {
    state := cast(^QueryState)conn.user_data[QueryState]

    state.ticket = pool.exec(state.prepared_name, ..state.params)
    if state.ticket == -1 do return

    conn.to_run = try_get_result
}

@(private = "file")
try_get_result :: proc (conn: ^http.Conn) {
    state := cast(^QueryState)conn.user_data[QueryState]

    result, ready := pool.poll(state.ticket)
    if !ready do return

    conn.user_data[pq.Result] = result
    conn.to_run = state.to_run_after
}