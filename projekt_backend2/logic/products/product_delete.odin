package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import mw "../../http/middleware"
import "../../pool/pool_mw"
import "../auth"

product_delete :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    if qp["id"] == "" {
        util.reset(conn, 400, "Missing parameter.")
        return
    }

    auth.check_admin_mw(conn, product_delete_query)
}

product_delete_query :: proc (conn: ^http.Conn) {
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]

    pool_mw.query(conn, product_delete_confirm, "product_delete", {qp["id"]})
}

product_delete_confirm :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Could not delete product.")
        return
    }

    tables := pool.unmarshal(result)
    if len(tables) == 0 {
        util.reset(conn, 404, "Product not found.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = `{"message": "Product deleted successfully"}`
    })
    http.reset_conn(conn)
}