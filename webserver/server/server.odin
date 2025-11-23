package server

import "core:os"
import "core:net"
import "../header"
import "core:thread"
import "core:sync/chan"

Server :: struct {
    root: string,
    endpoints: map[Endpoint]Handler,
    workers: u8,


}

Body :: string
Params :: string

Request :: struct {
    Params,
    header.Header,
    Body
}

Settings :: struct {

}

Handler :: proc(Request, Response)

Response :: struct {
    status: u16,

}

Endpoint :: struct {
    method: string,
    path: string
}

get :: proc(s: ^Server, path: string, toRun: Handler) {
    s.endpoints[{"GET", path}] = toRun
}
post :: proc(s: ^Server, path: string, toRun: Handler) {
    s.endpoints[{"POST", path}] = toRun
}
put :: proc(s: ^Server, path: string, toRun: Handler) {
    s.endpoints[{"PUT", path}] = toRun
}
patch :: proc(s: ^Server, path: string, toRun: Handler) {
    s.endpoints[{"PATCH", path}] = toRun
}
delete :: proc(s: ^Server, path: string, toRun: Handler) {
    s.endpoints[{"DELETE", path}] = toRun
}

run :: proc() {

}
