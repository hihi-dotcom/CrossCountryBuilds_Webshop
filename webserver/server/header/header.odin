package header

import "base:runtime"
import vmem "core:mem/virtual"
import "core:strings"
import "core:fmt"

MAX_HEADER_ARENA_SIZE : uint : 8192
PAGE_SIZE : uint : 4096
HEADER_BUFFER_SIZE : uint : 8192



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
    done: bool
}

FirstLine :: struct {
    method: bool,
    path: bool,
    protocol: bool
}

Header_parser_state :: struct {
    header: ^Header,

    cursor: int,

    line_break: int,
    first_line: FirstLine
}

Header_parser :: proc(in_state: ^Header_parser_state) -> (state: ^Header_parser_state, err: Header_Parse_Error) {
    state = in_state
    if state == nil {
        panic("No Header_parser_state provided!")
    }

    state.cursor = 0

    if !state.header.header_data.done {
        data_stepper: for i := state.header.header_data.end ; i < len(state.header.header_data.data) ; i += 1 {
            switch state.header.header_data.data[i] {
                case '\r', '\n':
                    fmt.println("1")
                    state.line_break += 1
                case 0:
                    fmt.println("2")
                    state.header.header_data.end = i - 1
                    // partial
                    break data_stepper 
                case: 
                    fmt.println("3")
                    state.line_break = 0
            }
            if state.line_break == 4 {
                fmt.println("4")
                state.header.header_data.done = true
                state.header.header_data.end = i
                break data_stepper
            }
        }
        // partial
    }
    fmt.println("5")
    return
}

header_parser_state_maker :: proc() -> (state: ^Header_parser_state, err: runtime.Allocator_Error) {
    state = new(Header_parser_state) or_return
    state.header = new(Header) or_return
    return 
}