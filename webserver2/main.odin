package main

import "./server"
import "core:fmt"
import "core:strconv"
import "core:mem"

main :: proc () {
    when ODIN_DEBUG {
		track: mem.Tracking_Allocator
		mem.tracking_allocator_init(&track, context.allocator)
		context.allocator = mem.tracking_allocator(&track)

		defer {
			if len(track.allocation_map) > 0 {
				fmt.eprintf("=== %v allocations not freed: ===\n", len(track.allocation_map))
				for _, entry in track.allocation_map {
					fmt.eprintf("- %v bytes @ %v\n", entry.size, entry.location)
				}
			}
			mem.tracking_allocator_destroy(&track)
		}
	}

    s: server.Server

    server.use(&s, log_request)

    server.add(&s, {"GET", "/"}, send_hehe)

    server.add(&s, {"POST", "/"}, get_static_body, proc (req: ^server.Request, res: ^server.Response) -> server.Appeal {
        fmt.println(string(req.body.data[:]))
        res.status = 201
        server.insert_option(res, "content-length", 0)

        return .Stop
    })

    server.run(s, 30000)
}

log_request : server.Handler : proc (req: ^server.Request, res: ^server.Response) -> server.Appeal {
    fmt.println(req.header.pairs["method"], req.header.pairs["path"])
    return .None
}

send_hehe : server.Handler : proc (req: ^server.Request, res: ^server.Response) -> server.Appeal {
    server.insert_static_body(res, proc(res: ^server.Response) -> bool {
        file, len, _ := server.load_whole_file("./root/hehe.html")
        server.insert_option(res, "content-length", len)
        server.insert_option(res, "content-type", "text/html")
        res.body = file
        res.status = 200

        return true
    })

    return .Stop
}

get_static_body : server.Handler : proc (req: ^server.Request, res: ^server.Response) -> server.Appeal {
    if cl, ok := req.header.pairs["content-length"] ; ok {
        if length, ok := strconv.parse_int(cl) ; ok {
            if len(req.body.data) != length {
                req.body.data = make([]u8, length)
            }
            req.body.written += server.excess_header_data(&req.header, req.body.data)
            if req.body.written == len(req.body.data) {
                return .None
            } else {
                return .Recive
            }
        } else {
            res.status = 411
            return .Error
        } 
    } else {
        res.status = 411
        return .Error   
    }
}