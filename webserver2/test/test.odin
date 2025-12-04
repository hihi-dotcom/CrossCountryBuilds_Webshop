package test

import "core:net"
import "core:fmt"
import "core:time"

main :: proc () {
    s := "asdf"
    n := 0
    for i := n ; i < 2 ; i += 1 {
        n += 1
        fmt.println(rune(s[i]))
    }
    for i := n ; i < len(s) ; i += 1 {
        fmt.println(rune(s[i]))
    }
}

a := `
soc, _ := net.listen_tcp(net.Endpoint { address = net.IP4_Address([4]u8{0,0,0,0}), port = 30001} )
    net.set_blocking(soc, false)

    c: net.TCP_Socket
    err: net.Accept_Error
    for {
        time.sleep(1 * time.Second)
        c, _, err = net.accept_tcp(soc)
        fmt.println(c, err)
        if err == nil do break
    }

    net.set_blocking(c, false)
    
    b: [1024]u8
    for {
        time.sleep(1 * time.Second)
        n, err := net.recv_tcp(c, b[:])
        fmt.println(n, err)
        if err != .None && err != .Would_Block {
            fmt.println(err, n)
        }
    }
    
    fmt.println(nil)
`