package test

import "core:mem"
import "base:runtime"
import "core:fmt"
import vmem "core:mem/virtual"
import "../server/header"

main :: proc () {
    test := "GET /index.html HTTP/1.1\r\nHost: example.com\r\nUser-Agent: TestClient/1.0\r\nAccept: */*\r\nAccept-Language: en-US,en;q=0.9\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\n\r\n"
    octets := transmute([]u8)test
    
    state, b, err := header.Header_parser(octets, nil)

    fmt.printfln("%#v", state)
    fmt.printfln("%#v", state.header)
    fmt.println(b, len(octets))
    fmt.println(err)
}


