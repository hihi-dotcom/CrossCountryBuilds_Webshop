package logic

import "../pool"
import "core:os"
import "core:fmt"
import "core:strings"

import "auth"
import "order"
import "products"
import "user"
import "appointment"

prepare :: proc () {
    pool.ConnectionString = strings.clone_to_cstring(
        "host=postgres port=5432 dbname=webshop user=webshop-root password=1234")
    defer pool.init(20)

    auth.prepare()
    order.prepare()
    products.prepare()
    user.prepare()
    appointment.prepare()
}