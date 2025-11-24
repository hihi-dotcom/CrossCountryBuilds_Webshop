package server

import "core:fmt"

import "core:os"
import "core:net"
import "../header"
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

Work :: struct($Permission: typeid) {
    socket: os.TCP_Socket,
    handler: Handler(Permission)
}

Worker_Thread_Data :: struct($Permission: typeid) {
    channel: chan.Chan(Work(Permission), .Recv),
}

Worker_Porc :: proc(t: ^thread.Thread, $Permissions: typeid) {
    data := cast(^Worker_Thread_Data(Permissions))t.data
    work: Work(Permissions)

    for {
        if w, recvErr := chan.recv(data.channel) ; recvErr {
            work = w
        } else { break }

        net.recv_tcp()





    }
    
}

run :: proc(port: u16) {



}