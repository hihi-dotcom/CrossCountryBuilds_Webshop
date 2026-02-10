package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"

products_all :: proc (conn: ^http.Conn) {
    pool.query_mw(conn, product_responseformulator, "all_products", {})
}

product_responseformulator :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    
    status, _ := pool.status(result)
    if status != nil {
        util.stop(conn, 500, "Internal server error.")
        return
    }

    tables := pool.unmarshal(result)

    products := make([]Product, len(tables))
    for table, i in tables {
       products[i].category = table["category"]
       products[i].description = table["description"]
       products[i].manufacturer = table["manufacturer"]
       products[i].name = table["name"]
       products[i].pic_url = table["pic_url"]
       products[i].price = table["price"]
       products[i].stock = table["stock"]
    }

    body_bytes, _ := json.marshal(products)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(body_bytes)
    })
    http.reset_conn(conn)
}