package main

import "core:fmt"
import "core:net"
import "core:os"

import "http"
import "http/util"
import "token"
import "logic"
import "logic/products"
import "logic/order"
import "logic/appointment"
import "logic/user"
import "logic/auth"

main :: proc () {
    token.SECRET = token.create_secret()
    upload_dir := "../uploads"
    products.UPLOAD_DIR = upload_dir
    logic.prepare()

    http.listen_and_serve(3001, proc (conn: ^http.Conn) {
        fmt.println(conn.source, ":", conn.header["method"][0], conn.header["path"][0])
        path, params := util.query_parameter(conn.header["path"][0])
        method := conn.header["method"][0]

        switch method {
            case "OPTIONS":
                util.static_send(conn.soc, {
                    status = 200,
                    header = {"content-type:application/json"},
                    body = ""
                })
                http.reset_conn(conn)
            case "POST":
                switch path {
                    case "/api/signup":
                        auth.register(conn)
                    case "/api/login":
                        auth.login(conn)
                    case "/api/logout":
                        auth.logout(conn)
                    case "/api/order":
                        order.order_create(conn)
                    case "/api/product":
                        products.product_add(conn)
                    case "/api/newappointment":
                        appointment.appointment_new(conn)
                    case:
                        util.reset(conn, 404, "Not Found")
                }
            case "GET":
                switch path {
                    case "/api/user":
                        auth.user(conn)
                    case "/api/products":
                        products.products_range(conn, params)
                    case "/api/product":
                        products.product_by_id(conn, params)
                    case "/api/admin/orders":
                        order.order_all(conn)
                    case "/api/admin/products":
                        products.products_all(conn)
                    case "/api/admin/users":
                        user.user_all(conn)
                    case "/api/admin/freeappointments":
                        appointment.appointment_get_free(conn)
                    case "/api/admin/appointments":
                        appointment.appointment_all(conn)
                    case "/api/admin/appointment":
                        appointment.appointment_by_id(conn, params)
                    case:
                        util.reset(conn, 404, "Not Found")
                }
            case "PATCH":
                switch path {
                    case "/api/order":
                        order.order_status(conn, params)
                    case "/api/appointment":
                        appointment.appointment_book(conn, params)
                    case "/api/admin/finalize":
                        appointment.finalize(conn, params)
                    case "/api/admin/products":
                        products.product_update(conn, params)
                    case:
                        util.reset(conn, 404, "Not Found")
                }
            case "DELETE":
                switch path {
                    case "/api/order":
                        order.order_delete(conn, params)
                    case "/api/product":
                        products.product_delete(conn, params)
                    case "/api/user":
                        user.user_delete(conn, params)
                    case "/api/appointment":
                        appointment.appointment_delete(conn, params)
                    case:
                        util.reset(conn, 404, "Not Found")
                }
            case:
                util.reset(conn, 405, "Method Not Allowed")
        }
    })
}