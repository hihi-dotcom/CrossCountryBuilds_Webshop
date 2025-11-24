package server

import "core:fmt"
import "core:os"
import "core:net"
import "./header"
import "core:thread"
import "core:sync/chan"


Server :: struct($Permissions: typeid) {
    root: string,
    endpoints: map[Endpoint]Handler(Permissions),
    workers: u8,
    permissions: Permissions,
    permissions_handler: proc(Request) -> Permissions
}

Body :: string
Params :: map[string]string

Request :: struct {
    Params,
    header.Header,
    Body
}

Settings :: struct($Permission: typeid) {
    acceptable_permissions: []Permission,
    acceptable_MIMEtypes: []string,
}


Handler :: struct($Permission: typeid) {
    toRun: Handler_proc,
    settings: Settings(Permission)
}

Handler_proc :: proc(Request, Response)

Response :: struct {
    status: u16,

}

Endpoint :: struct {
    method: string,
    path: string
}

Setter :: proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc)

get : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"POST", path}] = {
        toRun = toRun,
        settings = settings
    }
}
post : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"POST", path}] = {
        toRun = toRun,
        settings = settings
    }
}
put : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"PUT", path}] = {
        toRun = toRun,
        settings = settings
    }
}
patch : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"PATCH", path}] = {
        toRun = toRun,
        settings = settings
    }
}
delete : Setter : proc(s: ^Server, path: string, settings: Settings(typeid), toRun: Handler_proc) {
    s.endpoints[{"DELETE", path}] = {
        toRun = toRun,
        settings = settings
    }
}

run :: proc(port: u16) {



}