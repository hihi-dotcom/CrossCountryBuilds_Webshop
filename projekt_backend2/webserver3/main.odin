package main

import "core:log"
import "core:strconv"
import "core:fmt"
import "core:thread"
import "core:net"
import "core:sync/chan"
import "core:time"
import "core:encoding/json"
import "core:os"
import "core:strings"
import "core:math/big"
import "core:math"

import "http"
import "http/util"
import "pool"
import "token"

import "logic"
import "logic/order"
import "logic/auth"

PORT :: 30000

main :: proc () {
    token.SECRET = "hehe" //token.create_secret()
    logic.prepare()

    http.listen_and_serve(PORT, proc (conn: ^http.Conn) {
        fmt.println(conn.source, ":", conn.header["method"][0], conn.header["path"][0])
        path, params := util.query_parameter(conn.header["path"][0])

        if path == "/api/login" do auth.login(conn)
        if path == "/api/register" do auth.register(conn)
        if path == "/api/user" do auth.user(conn)
        if path == "/api/order" do order.order_status(conn, params)
        

        
        /*
        switch path {
            case:
            case:
                util.simple_send(conn.soc, 404, "Not found.")
                conn.to_run = nil
        }
        */
    })
}

/*

    
*/