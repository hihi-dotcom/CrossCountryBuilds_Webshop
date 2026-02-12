package appointment

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("delete_user",
        "DELETE Users WHERE id = $1",
    {.Int4})
    pool.prepare("user_all",
        "SELECT id, username, email, role FROM Users"
    )
}