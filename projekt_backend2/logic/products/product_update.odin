package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "core:fmt"
import "../../pool/pool_mw"
import mw "../../http/middleware"
import "../auth"

@(private = "file")
ProductUpdate :: struct {
    name: string,
    category: string,
    maker: string,
    description: string,
    price: int,
    stock_number: int,
}

product_update :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    qp := new(util.QueryParameter)
    qp^ = params
    conn.user_data[util.QueryParameter] = qp

    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, product_update_start)
    })
}

@(private = "file")
product_update_start :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]
    qp := cast(^util.QueryParameter)conn.user_data[util.QueryParameter]

    if qp["id"] == "" {
        util.reset(conn, 400, "Missing id parameter.")
        return
    }

    input := new(ProductUpdate)
    if json.unmarshal(body^, input) != nil {
        util.reset(conn, 400, "Invalid JSON format.")
        return
    }

    pool_mw.query(conn, product_update_finish, "product_update", 
        {input.name, input.category, input.maker, fmt.aprintf("%d", input.price), fmt.aprintf("%d", input.stock_number), input.description, qp["id"]})
}

@(private = "file")
product_update_finish :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Failed to update product.")
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
        body = `{"message": "Product updated successfully"}`
    })
    http.reset_conn(conn)
}