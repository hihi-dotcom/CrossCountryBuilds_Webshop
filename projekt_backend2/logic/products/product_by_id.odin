package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "../../pool/pool_mw"

product_by_id :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    if params["id"] == "" {
        util.stop(conn, 400, "Missing parameter")
        return
    }

    pool_mw.query(conn, product_by_id_result, "products_by_id", {params["id"]})
}

@(private = "file")
product_by_id_result :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.stop(conn, 500, "Unable to get product.")
        return
    }

    tables := pool.unmarshal(result)

    product: []Product
    product = make([]Product, len(tables))
    for table, i in tables {
       product[i].category = table["category"]
       product[i].description = table["description"]
       product[i].maker = table["manufacturer"]
       product[i].name = table["name"]
       product[i].picUrl = table["pic_url"]
       product[i].price = table["price"]
       product[i].stock_number = table["stock"]
       product[i].id = table["id"]
    }

    response_body, marshalErr := json.marshal(product)
    if marshalErr != nil {
        util.stop(conn, 500, "Result marshalation was unsuccesful.")
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


