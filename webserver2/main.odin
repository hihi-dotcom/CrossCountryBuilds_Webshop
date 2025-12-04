package main

import "./server"

main :: proc () {
    s: server.Server

    server.run(s, 30000)
}