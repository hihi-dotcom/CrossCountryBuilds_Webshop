package header

import "base:runtime"
import vmem "core:mem/virtual"
import "core:strings"

MAX_HEADER_SIZE : uint : 8192
PAGE_SIZE : uint : 4096


Parse_Error :: enum {
    Partial,
    Broken
}

Header_Parse_Error :: union {
    vmem.Allocator_Error,
    Parse_Error
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

Buffer :: struct {
    data: [1024]u8,
    end: u16
}

LineBreak :: struct {
    n1: bool,
    r1: bool,
    n2: bool,
    r2: bool
}

FirstLine :: struct {
    method: bool,
    path: bool,
    potocol: bool,
}

Header_parser_state :: struct {
    header: ^Header,
    cursor: u16,

    key_buffer: Buffer,
    value_buffer: Buffer,

    line_break: LineBreak,

    first_line: FirstLine
}

Header_parser :: proc (message: []u8, s: ^Header_parser_state) -> (state: ^Header_parser_state, body_start: int, err: Header_Parse_Error) {
    arena_allocator: runtime.Allocator
    if s == nil {
        s = new(Header_parser_state)
        s.header = new(Header)
        vmem.arena_init_static(&s.header.arena, MAX_HEADER_SIZE, PAGE_SIZE) or_return
        arena_allocator = vmem.arena_allocator(&s.header.arena)
        s.header.rest = make(map[string]string, arena_allocator)
    }
    if arena_allocator.procedure == nil {
        arena_allocator = vmem.arena_allocator(&s.header.arena)
    }

    if !s.first_line.method {
        for i := s.cursor ; i < 10 ; i += 1 {

        }
    }

    
}

Header_inserter :: proc (header: ^Header, key: string, value: string) {
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