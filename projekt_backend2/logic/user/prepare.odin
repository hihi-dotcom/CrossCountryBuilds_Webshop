package user

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("delete_user",
        "DELETE FROM Users WHERE id = $1 RETURNING id",
    {.Int4})
    pool.prepare("user_all",
        "SELECT id, username, email, role FROM Users where role <> 'admin'"
    )
}