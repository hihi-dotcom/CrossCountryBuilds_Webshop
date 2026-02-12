package orders

import "../../pool"
import "../../pool/pool_mw"
import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../passwd"
import "../../token"
import "../auth"
import "core:encoding/json"
import "core:strconv"
import "core:time"
import "core:fmt"
import "core:log"
import "core:text/regex"

//accepting the sent price is stupid
//address doesn't seems compatible with the database
//WHAT?? THE USER IS NOT CONNECTED TO ANY ADDRESS?
//WHY IS THE ADDRESS A STRING??????????????
//You just have to follow the spec, thay said...

BodyAs :: struct {
    u_id: int,
    Daddress: string,
    Baddress: string,
    pMethod: string,
    dMethod: string,
    total_amount: int,
    products: []Product
}

Product :: struct {
    id: int,
    price: int,
    amount: int
}

Address :: struct {
    zip_code: string,
    city_name: string,
    street_name: string,
    house_number: string
}

order_create :: proc (conn: ^http.Conn) {
    auth.check_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, order_create_start)
    })
}

order_create_start :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    as := new(BodyAs)
    if json.unmarshal(body^, as) != nil {
        util.stop(conn, 400, "Json cannot be parsed!")
        return
    }

    conn.user_data[BodyAs] = as

    pool_mw.pin(conn, order_create_order, "order_begin")
}

order_create_order :: proc (conn: ^http.Conn) {

}



but_why :: proc (full: string) -> (Address, bool) {
    re, regexErr := regex.create(`^(\d{4})\s+([^,]+),\s+(.+)\s+(\d+.*)$`)
    if regexErr != nil {
        log.fatal("Failed to create regex.")
    }

    cap, ok := regex.match_and_allocate_capture(re, full)
    if !ok do return {}, false

    if len(cap.groups) != 5 {
        return Address{}, false
    }

    return Address{
        zip_code     = cap.groups[1],
        city_name    = cap.groups[2],
        street_name  = cap.groups[3],
        house_number = cap.groups[4],
    }, true
}