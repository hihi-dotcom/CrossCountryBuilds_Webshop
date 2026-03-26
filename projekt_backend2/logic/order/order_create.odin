package orders

import "core:encoding/json"
import "core:fmt"
import "core:log"
import "core:strconv"
import "core:strings"
import "core:text/regex"
import "core:time"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../passwd"
import "../../pool"
import "../../pool/pq"
import "../../pool/pool_mw"
import "../../token"
import "../auth"


@(private = "file")
OrderJson :: struct {
    u_id: int,
    deliveryAddr: AddressJson,
    billingAddr: AddressJson,
    pMethod: string,
    dMethod: string,
    total_amount: int,
    products: []ProductJson
}

@(private = "file")
AddressJson :: struct {
    zipCode: string,
    cityName: string,
    streetName: string,
    houseNumber: string,
}

@(private = "file")
ProductJson :: struct {
    id: string,
    price: string,
    amount: int
}

@(private = "file")
Address :: struct {
    zip_code: string,
    city_name: string,
    street_name: string,
    house_number: string
}

@(private = "file")
Addresses :: struct {
    baddress: Address,
    baddress_id: string,
    daddress: Address,
    daddress_id: string
}

@(private = "file")
OrderId :: string
@(private = "file")
ProductsProcessed :: int

order_create :: proc (conn: ^http.Conn) {
    auth.check_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, order_create_start)
    })
}

@(private = "file")
order_create_start :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    as := new(OrderJson)
    if json.unmarshal(body^, as) != nil {
        util.reset(conn, 400, "Json cannot be parsed!")
        return
    }
    if len(as.products) == 0 {
        util.reset(conn, 400, "No products in order.")
        return
    }
    conn.user_data[OrderJson] = as

    addresses := new(Addresses)
    addresses.daddress = Address{
        zip_code = as.deliveryAddr.zipCode,
        city_name = as.deliveryAddr.cityName,
        street_name = as.deliveryAddr.streetName,
        house_number = as.deliveryAddr.houseNumber,
    }
    addresses.baddress = Address{
        zip_code = as.billingAddr.zipCode,
        city_name = as.billingAddr.cityName,
        street_name = as.billingAddr.streetName,
        house_number = as.billingAddr.houseNumber,
    }
    conn.user_data[Addresses] = addresses

    pool_mw.pin(conn, order_create_badderss, "order_begin")
}

@(private = "file")
order_create_badderss :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    addresses := cast(^Addresses)conn.user_data[Addresses]
    payload := cast(^auth.Payload)conn.user_data[auth.Payload]

    status, _ := pool.status(result)
    if status != .CommandOK {
        pool_mw.pin(conn, proc (conn: ^http.Conn) {
            pool_mw.release(conn^)
            util.reset(conn, 500, "Failed to start creating order.")
        }, "order_rollback")
        return
    }

    pool_mw.pin(conn, order_create_address2, "order_insert_address", 
        {fmt.aprint(payload.id), "billing", addresses.baddress.zip_code, fmt.aprint(addresses.baddress.street_name, addresses.baddress.house_number), addresses.baddress.city_name})
}

@(private = "file")
order_create_address2 :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    addresses := cast(^Addresses)conn.user_data[Addresses]
    payload := cast(^auth.Payload)conn.user_data[auth.Payload]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        pool_mw.pin(conn, proc (conn: ^http.Conn) {
            pool_mw.release(conn^)
            util.reset(conn, 500, "Failed to create address.")
        }, "order_rollback")
        return
    }

    table := pool.unmarshal(result)
    addresses.baddress_id = table[0]["id"]

    pool_mw.pin(conn, order_create_order, "order_insert_address", 
        {fmt.aprint(payload.id), "delivery", addresses.daddress.zip_code, fmt.aprint(addresses.daddress.street_name, addresses.daddress.house_number), addresses.daddress.city_name})
}

@(private = "file")
order_create_order :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    addresses := cast(^Addresses)conn.user_data[Addresses]
    payload := cast(^auth.Payload)conn.user_data[auth.Payload]
    as := cast(^OrderJson)conn.user_data[OrderJson]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        pool_mw.pin(conn, proc (conn: ^http.Conn) {
            pool_mw.release(conn^)
            util.reset(conn, 500, "Failed to create address.")
        }, "order_rollback")
        return
    }

    table := pool.unmarshal(result)
    addresses.daddress_id = table[0]["id"]

    pool_mw.pin(conn, order_create_connection, "order_insert", 
        {fmt.aprint(payload.id), addresses.baddress_id, addresses.daddress_id, as.pMethod, as.dMethod})
}

@(private = "file")
order_create_connection :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    addresses := cast(^Addresses)conn.user_data[Addresses]
    as := cast(^OrderJson)conn.user_data[OrderJson]

    status, _ := pool.status(result)
    if status != .TuplesOK {
        pool_mw.pin(conn, proc (conn: ^http.Conn) {
            pool_mw.release(conn^)
            util.reset(conn, 500, "Failed to create order.")
        }, "order_rollback")
        return
    }

    order_id := new(OrderId)
    table := pool.unmarshal(result)
    order_id^ = table[0]["id"]
    conn.user_data[OrderId] = order_id

    conn.user_data[ProductsProcessed] = new(ProductsProcessed)

    pool_mw.pin(conn, order_create_connections, "order_products", 
        {order_id^, fmt.aprint(as.products[0].id), fmt.aprint(as.products[0].amount), fmt.aprint(as.products[0].price)})
}

@(private = "file")
order_create_connections :: proc (conn: ^http.Conn) {
    result := cast(pool.Result)conn.user_data[pool.Result]
    addresses := cast(^Addresses)conn.user_data[Addresses]
    pp := cast(^ProductsProcessed)conn.user_data[ProductsProcessed]
    as := cast(^OrderJson)conn.user_data[OrderJson]
    order_id := cast(^OrderId)conn.user_data[OrderId]

    pp^ += 1

    status, _ := pool.status(result)
    if status != .CommandOK {
        pool_mw.pin(conn, proc (conn: ^http.Conn) {
            pool_mw.release(conn^)
            util.reset(conn, 500, "Failed to create connection.")
        }, "order_rollback")
        return
    }

    affected, ok := strconv.parse_int(string(pq.cmdTuples(result)), 10)
    if !ok || affected == 0 {
        pool_mw.pin(conn, proc (conn: ^http.Conn) {
            pool_mw.release(conn^)
            util.reset(conn, 404, "There is not enough stock.")
        }, "order_rollback")
        return
    }

    if pp^ == len(as.products) {
        conn.to_run = order_end
        return
    }

    pool_mw.pin(conn, order_create_connections, "order_products", 
        {order_id^, fmt.aprint(as.products[pp^].id), fmt.aprint(as.products[pp^].amount), fmt.aprint(as.products[pp^].price)})
}

order_end :: proc (conn: ^http.Conn) {
    pool_mw.pin(conn, order_finally_over, "order_end")
}

order_finally_over :: proc (conn: ^http.Conn) {
    order_id := cast(^OrderId)conn.user_data[OrderId]
    pool_mw.release(conn^)

    response := struct {
        message: string `json:"message"`,
        orderId: string `json:"orderId"`,
    }{
        message = "Order created successfully",
        orderId = order_id^
    }
    body_bytes, _ := json.marshal(response)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(body_bytes)
    })
    http.reset_conn(conn)
}