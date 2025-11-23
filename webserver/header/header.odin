package header

import vmem "core:mem/virtual"
import "core:strings"

MAX_HEADER_SIZE : uint : 8192
PAGE_SIZE : uint : 4096


Parse_Error :: enum {
    Error
}

Header_Error :: union {
    vmem.Allocator_Error,
    Parse_Error
}

Header :: struct {
    Top: string,
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

    rest: map[string]string,
    arena: vmem.Arena
}

Options :: struct {
    Top: string,
    Origin: string,
    Access_Control_Request_Method: string,
    Access_Control_Request_Headers: string,

    rest: map[string]string,
    arena: vmem.Arena
}

Header_parser :: proc (message: string) -> (header: Header, body_start: int, err: Header_Error) {
    h: Header
    vmem.arena_init_static(&h.arena, MAX_HEADER_SIZE, PAGE_SIZE) or_return
    arena_allocator := vmem.arena_allocator(&h.arena)
    h.rest = make(map[string]string, arena_allocator)

    start := 0
    key := "Top"
    for char, n in message {
        switch char {
            case '\n':
                if key != "" {
                    value := strings.clone(strip(message[start:n-1]), arena_allocator) or_return

                    Header_inserter(&h, strip(key), value)

                    key = ""
                    start = n+1
                } else {
                    return h, n+3, nil
                }
            case ':':
                if key == "" {
                    key = message[start:n]
                    start = n+1
                }
        }
    }
    return h, 0, Parse_Error.Error
}

Header_inserter :: proc (header: ^Header, key: string, value: string) {
    switch key {
        case "Top":
            header.Top = value
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

strip :: proc (s: string) -> string {
    slice_start := 0
    slice_end := len(s)
    for c in s {
        if c == ' ' || c == '\n' || c == '\r' {
            slice_start += 1
        } else { break }
    }
    #reverse for c in s {
        if c == ' ' || c == '\n' || c == '\r' {
            slice_end -= 1
        } else { break }
    }
    if slice_start > slice_end do return ""
    return s[slice_start:slice_end]
}