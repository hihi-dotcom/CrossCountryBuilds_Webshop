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
    host := os.get_env_alloc("DB_HOST")
    if len(host) == 0 { host = "localhost" }
    
    port := os.get_env_alloc("DB_PORT")
    if len(port) == 0 { port = "5432" }
    
    dbname := os.get_env_alloc("DB_NAME")
    if len(dbname) == 0 { dbname = "webshop" }
    
    db_user := os.get_env_alloc("DB_USER")
    if len(db_user) == 0 { db_user = "webshop-root" }
    
    password := os.get_env_alloc("DB_PASSWORD")
    if len(password) == 0 { password = "1234" }
    
    conn_str := fmt.aprintf(
        "host=%s port=%s dbname=%s user=%s password=%s",
        host, port, dbname, db_user, password
    )
    pool.ConnectionString = strings.clone_to_cstring(conn_str)
    defer pool.init(5)

    auth.prepare()
    order.prepare()
    products.prepare()
    user.prepare()
    appointment.prepare()
}