package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "../../pool/pool_mw"

product_by_id :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.reset(conn, 400, "Missing parameter")
        return
    }

    pool_mw.query(conn, product_by_id_result, "products_by_id", {params["id"]})
}

@(private = "file")
product_by_id_result :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Unable to get product.")
        return
    }

    tables := pool.unmarshal(result)

    if len(tables) == 0 {
        util.reset(conn, 404, "Product not found")
        return
    }

    table := tables[0]
    
    product := Product{
        description = table["description"],
        category = table["category"],
        maker = table["manufacturer"],
        name = table["name"],
        picUrl = table["pic_url"],
        price = table["price"],
        stock_number = table["stock"],
        id = table["id"],
    }

    response_body, marshalErr := json.marshal(product)
    if marshalErr != nil {
        util.reset(conn, 500, "Result marshalation was unsuccesful.")
        return
    }

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(response_body)
    })
    http.reset_conn(conn)
}


