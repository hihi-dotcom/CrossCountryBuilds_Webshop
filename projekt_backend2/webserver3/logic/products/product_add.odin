package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import mw "../../http/middleware"
import "../../pool/pool_mw"

//needed multipart form data handler

@(private = "file")
JsonResponse :: struct {
    id: string 
}

product_add :: proc (conn: ^http.Conn) {
    mw.application_json(conn, product_adder)
}

@(private = "file")
product_adder :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    as: Product
    if json.unmarshal(body^, &as) != nil {
        util.stop(conn, 400, "Json parsing failed")
        return
    }

    pool_mw.query(conn, product_adder_check, "product_add", 
        {as.name, as.category, as.maker, as.price, as.stock_number, as.picUrl, as.description})
}

@(private = "file")
product_adder_check :: proc (conn: ^http.Conn) {
    resutl := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(resutl)
    if status != .TuplesOK {
        util.stop(conn, 500, "Internal server error.")
        return
    }

    table := pool.unmarshal(resutl)

    jr := JsonResponse{
        id = table[0]["id"]
    }

    body_bytes, _ := json.marshal(jr)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(body_bytes)
    })
    http.reset_conn(conn)
}