package server

import "core:fmt"
import "core:thread"
import "core:net"
import "core:sync/chan"
import "core:time"

NUMBER_OF_THREADS :: 20
PORT :: 30000

Request :: struct {
    headers: map[string][dynamic]string,
    storage: map[typeid]any
}

Response :: struct {
    headers: map[string][dynamic]string,
    body: string,
    status: int
}

Control :: enum {
    Continue,
    Stop
}

Handler :: proc(req: ^Request, res: ^Response) -> Control

main :: proc () {
    soc_chan, _ := chan.create_buffered(chan.Chan(net.TCP_Socket), 1024, context.allocator)

    listener_data := new(Listener_Data)
    listener_data.socs = chan.as_send(soc_chan)
    listener := thread.create(Listener)
    listener.data = listener_data
    thread.start(listener)

    for i in 0..=NUMBER_OF_THREADS {
        worker_data := new(Worker_Data)
        worker_data.socs = chan.as_recv(soc_chan)
        worker := thread.create(Worker)
        worker.data = worker_data
        worker.user_index = i
        thread.start(worker)
    }

    time.sleep(999 * time.Hour)
}


Listener_Data :: struct {
    socs: chan.Chan(net.TCP_Socket, .Send)
}
Listener :: proc (t: ^thread.Thread) {
    data := cast(^Listener_Data)t.data
    address : net.IP4_Address = {0,0,0,0}

    soc, listenERR := net.listen_tcp({address = address, port = PORT})
    assert(listenERR == nil)

    for {
        client, _, acceptERR := net.accept_tcp(soc)
        if acceptERR != nil do continue

        chan.send(data.socs, client)
    }
}

Worker_Data :: struct {
    socs: chan.Chan(net.TCP_Socket, .Recv)
} 
Worker :: proc (t: ^thread.Thread) {
    data := cast(^Worker_Data)t.data

    

}