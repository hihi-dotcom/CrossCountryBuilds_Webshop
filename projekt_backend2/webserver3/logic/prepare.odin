package logic

import "../pool"

import "auth"
import "order"
import "products"
import "user"
 
prepare :: proc () {
    pool.ConnectionString = "host=localhost port=5432 dbname=webshop user=webshop-root password=1234"
    defer pool.init(5)

    auth.prepare()
    order.prepare()
    products.prepare()
    user.prepare()
}