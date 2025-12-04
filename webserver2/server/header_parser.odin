// kell majd talán -- tárolni a többször mejelenő fejléceket külön, üres fejlécek

package loop

Parse :: proc(header: ^Header) {
    is_header_data_whole(header) 
    first_line(header, "method")
    first_line(header, "path")
    first_line(header, "protocol")
    not_the_first_line(header)
}

@(private="file")
k_or_v :: enum {
    Key,
    Value
}

@(private="file")
spans :: struct {
    key_start: int,
    value_start: int,
    key_end: int,
    value_end: int
}

@(private="file")
not_the_first_line :: proc(state: ^Header) {
    which: k_or_v = .Key
    hit := false
    spanss: spans
    for i := state.cursor ; i < state.header.header_data.end - 1 ; i += 1 {
        switch which {
            case .Key:
                switch state.header.header_data.data[i] {
                    case ' ',  '\r', '\n', ':', '\t':
                        if hit {
                            spanss.key_end = i
                            which = .Value
                            hit = false
                        }
                    case 'A'..='Z':
                        state.header.header_data.data[i] += 32
                        fallthrough
                    case:
                        if !hit {
                            hit = true
                            spanss.key_start = i
                        }
                }
            case .Value:
                switch state.header.header_data.data[i] {
                    case '\r', '\n':
                        if hit {
                            spanss.value_end = i
                            which = .Key
                            hit = false
                            state.header.pairs[string(state.header.header_data.data[spanss.key_start:spanss.key_end])] = string(state.header.header_data.data[spanss.value_start:spanss.value_end])
                        }
                    case ' ', ':', '\t': continue
                    case 'A'..='Z':
                        state.header.header_data.data[i] += 32
                        fallthrough
                    case: 
                        if !hit {
                            spanss.value_start = i
                            hit = true
                        }
                }
        }
    }
}

@(private="file")
first_line :: proc(state: ^Parser_State, key: string) {
    start := state.cursor
    hit := false
    for i := state.cursor ; i < state.header.header_data.end - 1 ; i += 1 {
        switch state.header.header_data.data[i] {
            case ' ',  '\r', '\n', '\t':
                if hit {
                    state.header.pairs[key] = string(state.header.header_data.data[start:i])
                    state.cursor = i
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
is_header_data_whole :: proc(state: ^Parser_State) -> (err: Parse_Error) {
    for i := state.header.header_data.end ; i < len(state.header.header_data.data) ; i += 1 {
        switch state.header.header_data.data[i] {
            case '\r', '\n':
                state.line_break += 1
            case 0:
                state.header.header_data.end = i
                return .Partial 
            case: 
                state.line_break = 0
        }
        if state.line_break == 4 {
            state.header.header_data.end = i + 1
            return .None
        }
    }
    return .TooLong
}