package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "../../pool/pool_mw"
import "../auth"
import "core:strconv"

products_all :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        pool_mw.query(conn, product_responseformulator, "all_products", {})
    })
}

product_responseformulator :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    
    status, _ := pool.status(result)
    if status != .TuplesOK {
        util.reset(conn, 500, "Internal server error.")
        return
    }

    tables := pool.unmarshal(result)

    products := make([]Product, len(tables))
    for table, i in tables {
        price, _ := strconv.parse_int(table["price"]) 
        stock_number, _ := strconv.parse_int(table["stock"]) 
        products[i].category = table["category"]
        products[i].description = table["description"]
        products[i].maker = table["manufacturer"]
        products[i].name = table["name"]
        products[i].picUrl = table["pic_url"]
        products[i].price = price
        products[i].stock_number = stock_number
        products[i].id = table["id"]
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