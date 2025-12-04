package main

import "./server"

main :: proc () {
    s: server.Server

    //server.add({'get', "/"}, func1, func2)

    server.delete()



    server.run(s, 30000)
}