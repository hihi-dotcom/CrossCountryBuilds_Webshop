package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "core:strconv"
import "core:log"

@(private = "file")
Offset :: int

@(private)
Product :: struct {
    name: string,
    category: string,
    manufacturer: string,
    price: string,
    stock: string,
    pic_url: string,
    description: string
}

@(private = "file")
ResponseFromat :: struct {
    products: []Product,
    total: int,
    hasMore: bool
}

products_range :: proc (conn: ^http.Conn, params: util.QueryParameter) {
    limit_string, limitOk := params["limit"]
    offset_string, offsetOk := params["offset"]
    if !limitOk || !offsetOk {
        util.stop(conn, 400, "Missing parameter.")
    }

    _, limitParseOk := strconv.parse_int(limit_string, 10)
    offset, offsetParseOk := strconv.parse_int(offset_string, 10)
    if !limitParseOk || !offsetParseOk {
        util.stop(conn, 400, "Parameter is not number.")
    }
    heap_offset := new(int)
    heap_offset^ = offset
    conn.user_data[^Offset] = heap_offset
    pool.query_mw(conn, products_more_query, "products_range", {limit_string, offset_string})
}

@(private = "file")
products_more_query :: proc (conn: ^http.Conn) {
    resutl := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(resutl)
    if status != .TuplesOK {
        util.stop(conn, 500, "Internal server error.")
        return
    }

    tables := pool.unmarshal(resutl)

    products := new([]Product)
    products^ = make([]Product, len(tables))
    for table, i in tables {
       products[i].category = table["category"]
       products[i].description = table["description"]
       products[i].manufacturer = table["manufacturer"]
       products[i].name = table["name"]
       products[i].pic_url = table["pic_url"]
       products[i].price = table["price"]
       products[i].stock = table["stock"]
    }
    conn.user_data[^[]Product] = products

    pool.query_mw(conn, products_no_more_query, "products_count", {})
}

@(private = "file")
products_no_more_query :: proc (conn: ^http.Conn) {
    products := cast(^[]Product)conn.user_data[^[]Product]
    resutl := cast(pool.Result)conn.user_data[pool.Result]
    offset := cast(^Offset)conn.user_data[^Offset]

    status, _ := pool.status(resutl)
    if status != .TuplesOK {
        util.stop(conn, 500, "Internal server error.")
        return
    }

    tables := pool.unmarshal(resutl)
    count, _ := strconv.parse_int(tables[0]["num"])

    rp := ResponseFromat{
        products = products^,
        hasMore = len(products) + offset^ < count,
        total = count 
    }

    response_body, err := json.marshal(rp)
    if err != nil {
        log.error("Marshal error:", err)
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

