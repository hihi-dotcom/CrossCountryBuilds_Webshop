// kell majd talán -- tárolni a többször mejelenő fejléceket külön, üres fejlécek

package loop

HeaderBuffer :: struct {
    data: [MAX_HEADER_LENGTH]u8,
    end: int,
    written: int
}

Header :: struct {
    pairs: map[string]string,
    buf: HeaderBuffer,
    done: bool
}

Parse :: proc(header: ^Header) -> bool {
    if header.done do return true
    is_header_data_whole(header) or_return
    if !header.done do return true
    cursor := 0
    first_line(&cursor, header, "method")
    first_line(&cursor, header, "path")
    first_line(&cursor, header, "protocol")
    not_the_first_line(&cursor, header)
    return true
}

@(private="file")
k_or_v :: enum {
    Key,
    Value
}

@(private="file")
spans :: struct {
    key: start_and_end,
    value: start_and_end
}

@(private="file")
start_and_end :: struct {
    start: int,
    end: int
}


@(private="file")
not_the_first_line :: proc(cursor: ^int, header: ^Header) {
    which: k_or_v = .Key
    hit := false
    spanss: spans
    for i := cursor^ ; i < header.buf.end ; i += 1 {
        switch which {
            case .Key:
                switch header.buf.data[i] {
                    case ' ',  '\r', '\n', ':', '\t':
                        if hit {
                            spanss.key.end = i
                            which = .Value
                            hit = false
                        }
                    case 'A'..='Z':
                        header.buf.data[i] += 32
                        fallthrough
                    case:
                        if !hit {
                            hit = true
                            spanss.key.start = i
                        }
                }
            case .Value:
                switch header.buf.data[i] {
                    case '\r', '\n':
                        if hit {
                            spanss.value.end = i
                            which = .Key
                            hit = false
                            header.pairs[string(header.buf.data[spanss.key.start:spanss.key.end])] = string(header.buf.data[spanss.value.start:spanss.value.end])
                        }
                    case ' ', ':', '\t': continue
                    case 'A'..='Z':
                        header.buf.data[i] += 32
                        fallthrough
                    case: 
                        if !hit {
                            spanss.value.start = i
                            hit = true
                        }
                }
        }
    }
}

@(private="file")
first_line :: proc(cursor: ^int, header: ^Header, key: string) {
    hit := false
    start := 0
    for i := cursor^ ; i < header.buf.end ; i += 1 {
        cursor^ += 1
        switch header.buf.data[i] {
            case ' ',  '\r', '\n', '\t':
                if hit {
                    header.pairs[key] = string(header.buf.data[start:i])
                    return
                }
            case:
                if !hit {
                    hit = true
                    start = i
                }
        }
    }
}

@(private="file")
is_header_data_whole :: proc(header: ^Header) -> bool {
    line_break := 0
    for i := 0 ; i < header.buf.written ; i += 1 {
        switch header.buf.data[i] {
            case '\r', '\n':
                line_break += 1
            case:
                line_break = 0
        }
        if line_break == 4 {
            header.done = true
            if i == 0 do header.buf.end = 0
            else do header.buf.end = i + 1
            break
        }
    }
    if len(header.buf.data) == header.buf.written && !header.done do return false
    return true
}