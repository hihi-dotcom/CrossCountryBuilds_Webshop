package orders

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("order_begin",
        "begin"
    )
    pool.prepare("insert_order",`
        INSERT INTO Orders (user_id, )
    `)
}