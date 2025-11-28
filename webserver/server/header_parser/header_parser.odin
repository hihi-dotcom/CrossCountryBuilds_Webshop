// kell majd talán -- tárolni a többször mejelenő fejléceket külön, kis berű - nagy betű, üres fejlécek

package header_parser


@(private)
HEADER_BUFFER_SIZE : uint : 1024 * 8 

Parse_Error :: enum {
    None,
    Partial,
    TooLong
}

Maybe_Header :: union {
    ^Parser_State,
    ^Header,
}

Header :: struct {
    Method: string,
    Path: string,
    Protocol: string,
    Host: string,
    User_Agent: string,
    Accept: string,
    Accept_Language: string,
    Accept_Encoding: string,
    Content_Length: string,
    Transfer_Encoding: string,
    Content_Type: string,
    Connection: string,
    Authorization: string,

    header_data: Buffer,
    rest: map[string]string,
}

/* Talán kell valmi ilyen majd
Options :: struct {
    Top: string,
    Origin: string,
    Access_Control_Request_Method: string,
    Access_Control_Request_Headers: string,

    rest: map[string]string,
    arena: vmem.Arena
}
*/

Buffer :: struct {
    data: [HEADER_BUFFER_SIZE]u8,
    end: int,
}

Parser_State :: struct {
    header: ^Header,
    cursor: int,
    line_break: u8,
}

Parse :: proc(state: ^Parser_State) -> (err: Parse_Error) {
    if state == nil {
        panic("No Header_parser_state provided!")
    }

    state.cursor = 0

    is_header_data_whole(state) or_return
    first_line(state, "Method")
    first_line(state, "Path")
    first_line(state, "Protocol")
    not_the_first_line(state)

    return
}

@(private)
k_or_v :: enum {
    Key,
    Value
}

@(private)
spans :: struct {
    key_start: int,
    value_start: int,
    key_end: int,
    value_end: int
}

@(private)
not_the_first_line :: proc(state: ^Parser_State) {
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
                            inserter(state.header, string(state.header.header_data.data[spanss.key_start:spanss.key_end]), string(state.header.header_data.data[spanss.value_start:spanss.value_end]))
                        }
                    case ' ', ':', '\t': continue
                    case: 
                        if !hit {
                            spanss.value_start = i
                            hit = true
                        }
                }
        }
    }
}

@(private)
first_line :: proc(state: ^Parser_State, key: string) {
    start := state.cursor
    hit := false
    for i := state.cursor ; i < state.header.header_data.end - 1 ; i += 1 {
        switch state.header.header_data.data[i] {
            case ' ',  '\r', '\n', '\t':
                if hit {
                    inserter(state.header, key, string(state.header.header_data.data[start:i]))
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

@(private)
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

parser_state_maker :: proc() -> (state: ^Parser_State) {
    state = new(Parser_State)
    state.header = new(Header) 
    return 
}

parser_state_free :: proc(h: ^Parser_State) {
    free(h)
}

header_free :: proc(h: ^Header) {
    delete(h.rest)
    free(h)
}

parser_state_and_contents_free :: proc(h: ^Parser_State) {
    header_free(h.header)
    parser_state_free(h)
}

@(private)
inserter :: proc (header: ^Header, key: string, value: string) {
    switch key {
        case "Method":
            header.Method = value
        case "Path":
            header.Path = value
        case "Protocol":
            header.Protocol = value
        case "Host":
            header.Host = value
        case "User-Agent":
            header.User_Agent = value
        case "Accept":
            header.Accept = value
        case "Accept-Language":
            header.Accept_Language = value
        case "Accept-Encoding":
            header.Accept_Encoding = value
        case "Connection":
            header.Connection = value
        case "Authorization":
            header.Authorization = value
        case "Content-Length":
            header.Content_Length = value
        case "Transfer-Encoding":
            header.Transfer_Encoding = value
        case "Content-Type":
            header.Content_Type = value
        case:
            header.rest[key] = value
    }
}