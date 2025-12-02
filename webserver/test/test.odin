package test

import "core:terminal/ansi"
import "core:mem" 
import "core:fmt"
import vmem "core:mem/virtual"
import "core:strings"
import "../server/header_parser"

ttttttttest :: struct {
    t1: string,
    t3: string,
}

main :: proc() {
    track: mem.Tracking_Allocator
    mem.tracking_allocator_init(&track, context.allocator)
    context.allocator = mem.tracking_allocator(&track)

    defer {
        if len(track.allocation_map) > 0 {
            for _, entry in track.allocation_map {
                fmt.eprintf("%v leaked %v bytes\n", entry.location, entry.size)
            }
        }
        mem.tracking_allocator_destroy(&track)
    }

    /* for i in 0..=25 {
        fmt.println(rune('0' + i),'0' + i)
    } */

    
}

hundreds_and_tens_and_ones :: proc(number: int) -> (hundreds: int, tens: int, ones: int) {
    hundreds = number / 100
    tens = (number - (hundreds * 100)) / 10
    ones = (number - (hundreds * 100) - (tens * 10))
    return
}
status_to_bytes :: proc(number: int) -> (bytes: [3]u8) {
    hundreds := number / 100
    tens := (number - (hundreds * 100)) / 10
    ones := (number - (hundreds * 100) - (tens * 10))

    bytes[0] = u8('0') + u8(hundreds)
    bytes[1] = u8('0') + u8(tens)
    bytes[2] = u8('0') + u8(ones)
    return
}

tttest :: proc() {
    test := "GET /index.html HTTP/1.1\r\nHost: example.com\r\nUser-Agent: TestClient/1.0\r\nAccept: */*\r\ncept-Language: en-US,en;q=0.9\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\n\r\n"
    octets := transmute([]u8)test
    hps := header_parser.parser_state_maker()
    copyer(hps.header.header_data.data[:], octets)
    header_parser.Parse(hps)
    fmt.printfln("%v", hps.header)
}

copyer :: proc(to: []u8, from: []u8) {
    for _, i in from {
        to[i] = from[i]
    }
}

strip :: proc (s: []u8) -> []u8 {
    slice_start := 0
    slice_end := len(s)
    for c in s {
        if c == ' ' {
            slice_start += 1
        } else { break }
    }
    #reverse for c in s {
        if c == ' ' {
            slice_end -= 1
        } else { break }
    }
    if slice_start > slice_end do return s[0:0]
    return s[slice_start:slice_end]
}


e := `
main :: proc () {
    test := "GET /index.html HTTP/1.1\r\nHost: example.com\r\nUser-Agent: TestClient/1.0\r\nAccept: */*\r\nAccept-Language: en-US,en;q=0.9\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\n\r\n"
    octets := transmute([]u8)test
    
    state, b, err := header.Header_parser(octets, nil)

    fmt.printfln("%#v", state)
    fmt.printfln("%#v", state.header)
    fmt.println(b, len(octets))
    fmt.println(err)
}
`


