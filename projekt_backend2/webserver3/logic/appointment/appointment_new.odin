package appointment

import "../../http"
import "../../http/util"
import mw "../../http/middleware"
import "../../pool"
import "../../pool/pool_mw"
import "../../logic/auth"
import "core:encoding/json"
import "core:fmt"

appointment_new :: proc (conn: ^http.Conn) {
    
}