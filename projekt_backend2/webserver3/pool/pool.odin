package pool

import "core:fmt"
import "core:thread"
import "core:sync/chan"
import "core:log"
import "core:time"

import "./pq"

@(private)
WorkerData :: struct {
    to_exec: chan.Chan(ToExec, .Recv),
    result: chan.Chan(pq.Result, .Send)
}

@(private)
WorkerConn :: struct {
    to_exec: chan.Chan(ToExec, .Send),
    result: chan.Chan(pq.Result, .Recv)
}

@(private)
Prepare :: struct {
    name: cstring,
    query: cstring,
    oids: []pq.Oid
}

@(private)
ToExec :: struct {
    name: cstring,
    params: Params
}

@(private)
Params :: ^[dynamic]cstring

@(private)
ToPrepare: [dynamic]Prepare
@(private)
Workers: [dynamic]^WorkerConn

ConnectionString: cstring

prepare :: proc (name: cstring, query: cstring, oids: []pq.Oid) {
    append(&ToPrepare, Prepare{
        name = name,
        query = query,
        oids = oids
    })
}

init :: proc (n_threads: int) {
    assert(n_threads > 0, "The number of threads must be bigger then 0!")
    assert(ConnectionString != nil, "No connection string given.")
    assert(len(ToPrepare) > 0, "No query prepared.")
    assert(len(Workers) == 0, "Init should only be run once!") 
    
    for i in 0..<n_threads {
        create_worker(i)
    }

    assert(len(Workers) == n_threads, "Worker creation failed.") 
}

exec :: proc (name: cstring, params: ..any) -> (ticket: int) {
    ticket = -1
    for worker_conn, i in Workers {
        if !chan.can_send(worker_conn.to_exec) do continue

        cstring_params := new([dynamic]cstring)
        ticket = i

        for param in params {
            append(cstring_params, fmt.caprint(param))
        }

        chan.send(worker_conn.to_exec, ToExec{
            name = name,
            params = cstring_params
        })
    }
    return
}

poll :: proc (ticket: int) -> (result: pq.Result, ready: bool) {
    if !chan.can_recv(Workers[ticket].result) do return nil, false
    tmp_result, _ := chan.recv(Workers[ticket].result)
    return tmp_result, true
}

@(private)
worker :: proc (t: ^thread.Thread) {
    context.logger = log.create_console_logger()
    data := cast(^WorkerData)t.data
    
    conn := pq.connectdb(ConnectionString)
    defer pq.finish(conn)
    if pq.status(conn) != .Ok {
        log.panic("db worker", t.user_index, ":", "Cannot connect to database.")
    }

    for prepare in ToPrepare { 
        result := pq.prepare(
            conn, 
            prepare.name, 
            prepare.query, 
            i32(len(prepare.oids)),
            len(prepare.oids) > 0 ? &prepare.oids[0] : nil
        )
        defer pq.clear(result)
        status := pq.resultStatus(result)
        if status != pq.ExecStatus.Command_OK {
            log.panic("db worker", t.user_index, ":", "Failed to prepare quary :", prepare.name, "\n",
                "\t Result status:", status, "\n",
                "\t Result error message: ", pq.resultErrorMessage(result)
            )
        }
    }

    for {
        to_exec, ok := chan.recv(data.to_exec)
        if !ok {
            log.info("\ndb worker", t.user_index, ":", "Channel closed, shuting down...")
            break
        }

        if pq.status(conn) != .Ok {
            pq.reset(conn)
            if pq.status(conn) != .Ok do time.sleep(5 * time.Second)
            continue
        }
        
        result := pq.execPrepared(
            conn, to_exec.name, 
            i32(len(to_exec.params)), 
            len(to_exec.params) > 0 ? &to_exec.params[0] : nil, 
            nil, nil, 0
        )
        ok = chan.send(data.result, result)
        if !ok {
            log.info("\ndb worker", t.user_index, ":", "Channel closed, shuting down...")
            break
        }

        delete_params(to_exec.params)
    }
}

@(private)
delete_params :: proc (params: Params) {
    for param in params {
        delete_cstring(param)
    }
    delete_dynamic_array(params^)
}

@(private)
create_chans :: proc () -> (chan.Chan(ToExec, .Both), chan.Chan(pq.Result, .Both)) {
    to_exec_chan, err1 := chan.create_unbuffered(chan.Chan(ToExec, .Both), context.allocator)
    result_chan, err2 := chan.create_unbuffered(chan.Chan(pq.Result, .Both), context.allocator)
    assert(err1 == nil && err2 == nil)
    return to_exec_chan, result_chan
}

@(private)
create_worker :: proc (user_index: int) {
    to_exec_chan, result_chan := create_chans()

    worker_data := new(WorkerData)
    worker_data.result = chan.as_send(result_chan)
    worker_data.to_exec = chan.as_recv(to_exec_chan)

    worker_thread := thread.create(worker)
    worker_thread.user_index = user_index
    worker_thread.data = worker_data
    thread.start(worker_thread)

    worker_conn := new(WorkerConn)
    worker_conn.result = chan.as_recv(result_chan)
    worker_conn.to_exec = chan.as_send(to_exec_chan)

    append(&Workers, worker_conn)
}