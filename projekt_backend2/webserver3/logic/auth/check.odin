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

check_mw :: proc (conn: ^http.Conn, to_run_after: http.Handler) {
    incoming_tokens, ok := conn.header["Authorization"]
    if !ok {
        util.simple_send(conn.soc, 401, "Unathorised")
        return
    }

    incoming_token_with_bearer := incoming_tokens[0]
    incoming_token := incoming_token_with_bearer[7:]

    payload, authentic := token.verify(incoming_token)
    if !authentic {
        util.simple_send(conn.soc, 401, "Token expired")
        return
    }

    conn.user_data[Payload] = convert(payload)
    conn.to_run = to_run_after
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