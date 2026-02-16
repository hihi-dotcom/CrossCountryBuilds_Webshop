package orders

import "../../pool"
import "../../pool/pq"
import "../../pool/pool_mw"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../passwd"
import "../../token"
import "../auth"
import "core:encoding/json"
import "core:strconv"
import "core:time"
import "core:fmt"
import "core:log"
import "core:text/regex"
import "core:strings"


order_all :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, order_all_query)
}

order_all_query :: proc (conn: ^http.Conn) {
    pool_mw.query(conn, order_all_response, "order_all")
}

order_all_response :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Failed to get orders.")
        return
    }
    tables := pool.unmarshal(result)


    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = tables[0]["orders"]
    })
    http.reset_conn(conn)
}
