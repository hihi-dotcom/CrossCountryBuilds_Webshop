// kell majd talán kezelni az üres fejléceket

package http

@(private)
HeaderData :: struct {
    buf: []u8,
    written_till: int,
    used_till: int,
    done: bool
}

@(private)
Parse :: proc(conn: ^Conn) -> (should_close_conn: bool) {
    if is_the_header_done(&conn.header_data) do return true
    if !conn.header_data.done do return false

    cursor := 0
    first_line(conn, &cursor, "method")
    first_line(conn, &cursor, "path")
    first_line(conn, &cursor, "protocol")
    not_the_first_line(conn, &cursor)
    return false
}

@(private = "file")
KOrV :: enum {
    Key,
    Value
}

@(private = "file")
Spans :: struct {
    key: StartAndEnd,
    value: StartAndEnd
}

@(private = "file")
StartAndEnd :: struct {
    start: int,
    end: int
}


@(private = "file")
not_the_first_line :: proc(conn: ^Conn, cursor: ^int) {
    which: KOrV = .Key
    hit := false
    spans: Spans
    for ; cursor^ < conn.header_data.used_till ; cursor^ += 1 {
        switch which {
            case .Key:
                switch conn.header_data.buf[cursor^] {
                    case ' ',  '\r', '\n', ':', '\t':
                        if hit {
                            spans.key.end = cursor^
                            which = .Value
                            hit = false
                        }
                    case 'A'..='Z':
                        conn.header_data.buf[cursor^] += 32
                        fallthrough
                    case:
                        if !hit {
                            hit = true
                            spans.key.start = cursor^
                        }
                }
            case .Value:
                switch conn.header_data.buf[cursor^] {
                    case '\r', '\n':
                        if hit {
                            spans.value.end = cursor^
                            which = .Key
                            hit = false

                            key_string := string(conn.header_data.buf[spans.key.start:spans.key.end])
                            value_string := string(conn.header_data.buf[spans.value.start:spans.value.end])
                            if value, ok := conn.header[key_string] ; ok {
                                for &field in value {
                                    if field == "" {
                                        field = value_string
                                        break
                                    }
                                }
                            } else {
                                conn.header[key_string] = {}
                                (&conn.header[key_string])[0] = value_string
                            }
                        }
                    case ' ', ':', '\t': continue
                    case: 
                        if !hit {
                            spans.value.start = cursor^
                            hit = true
                        }
                }
        }
    }
}

@(private = "file")
first_line :: proc(conn: ^Conn, cursor: ^int, key: string) {
    hit := false
    start := 0
    for ; cursor^ < conn.header_data.used_till ; cursor^ += 1 {
        switch conn.header_data.buf[cursor^] {
            case ' ',  '\r', '\n', '\t':
                if hit {
                    conn.header[key] = {}
                    (&conn.header[key])[0] = string(conn.header_data.buf[start:cursor^])
                    return
                }
            case:
                if !hit {
                    hit = true
                    start = cursor^
                }
        }
    }
}

@(private = "file")
is_the_header_done :: proc(data: ^HeaderData) -> (is_there_an_error: bool) {
    line_break := 0
    for char, i in data.buf[:data.written_till] {
        switch char {
            case '\r', '\n':
                line_break += 1
            case:
                line_break = 0
        }
        if line_break == 4 {
            data.done = true
            data.used_till = i + 1
            break
        }
    }
    if len(data.buf) == data.written_till && !data.done do return true
    return false
}