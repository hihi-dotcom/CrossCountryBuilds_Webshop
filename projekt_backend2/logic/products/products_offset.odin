package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "../../pool/pool_mw"
import "core:strconv"
import "core:log"
import "core:fmt"

@(private = "file")
Offset :: int

@(private = "file")
Filters :: struct {
    name: string,
    category: string,
    maker: string,
    priceFrom: int,
    priceTo: int,
}

@(private)
Product :: struct {
    id: string,
    name: string,
    category: string,
    maker: string,
    price: string,
    stock_number: string,
    picUrl: string,
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
        util.reset(conn, 400, "Missing parameter.")
        return
    }

    limit, limitParseOk := strconv.parse_int(limit_string, 10)
    offset, offsetParseOk := strconv.parse_int(offset_string, 10)
    if !limitParseOk || !offsetParseOk {
        util.reset(conn, 400, "Parameter is not number.")
        return
    }

    filters := new(Filters)
    filters.name = params["name"]
    filters.category = params["category"]
    filters.maker = params["maker"]

    priceFromString := params["priceFrom"]
    priceToString := params["priceTo"]
    if priceFromString != "" {
        filters.priceFrom, _ = strconv.parse_int(priceFromString, 10)
    }
    if priceToString != "" {
        filters.priceTo, _ = strconv.parse_int(priceToString, 10)
    }

    heap_offset := new(int)
    heap_offset^ = offset
    conn.user_data[^Offset] = heap_offset
    conn.user_data[^Filters] = filters

    pool_mw.query(conn, products_more_query, "products_range",
        {filters.name, filters.category, filters.maker, fmt.aprint(filters.priceFrom), fmt.aprint(filters.priceTo), limit_string, offset_string})
}

@(private = "file")
products_more_query :: proc (conn: ^http.Conn) {
    resutl := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(resutl)
    if status != .TuplesOK {
        util.reset(conn, 500, "Internal server error.")
        return
    }

    tables := pool.unmarshal(resutl)

    products := new([]Product)
    products^ = make([]Product, len(tables))
    for table, i in tables {
       products[i].category = table["category"]
       products[i].description = table["description"]
       products[i].maker = table["manufacturer"]
       products[i].name = table["name"]
       products[i].picUrl = table["pic_url"]
       products[i].price = table["price"]
       products[i].stock_number = table["stock"]
       products[i].id = table["id"]
    }
    conn.user_data[^[]Product] = products

    filters := cast(^Filters)conn.user_data[^Filters]
    pool_mw.query(conn, products_no_more_query, "products_count",
        {filters.name, filters.category, filters.maker, fmt.aprint(filters.priceFrom), fmt.aprint(filters.priceTo)})
}

@(private = "file")
products_no_more_query :: proc (conn: ^http.Conn) {
    products := cast(^[]Product)conn.user_data[^[]Product]
    resutl := cast(pool.Result)conn.user_data[pool.Result]
    offset := cast(^Offset)conn.user_data[^Offset]

    status, _ := pool.status(resutl)
    if status != .TuplesOK {
        util.reset(conn, 500, "Internal server error.")
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

