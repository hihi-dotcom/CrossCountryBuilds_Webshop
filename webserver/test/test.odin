package test

import "core:mem" 
import "core:fmt"
import vmem "core:mem/virtual"
import "core:strings"
import "../server/header_parser"

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

    t1: header_parser.Maybe_Header = header_parser.parser_state_maker()
    t2: header_parser.Maybe_Header = t1.(^header_parser.Parser_State).header
    t3: header_parser.Maybe_Header = nil

    asd := []header_parser.Maybe_Header{t1,t3,t2}

    for i in asd {
        switch v in i {
            case ^header_parser.Parser_State:
                fmt.println(typeid_of(type_of(v)))
            case ^header_parser.Header:
                fmt.println(typeid_of(type_of(v)))
            case:
                fmt.println(typeid_of(type_of(v)))
        }
    }

   


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


