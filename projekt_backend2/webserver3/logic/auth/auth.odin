package auth

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("get_user_id_role_and_password_by_username", 
        "SELECT id, username, password, role FROM Users where username = $1", 
    {.Varchar})
}

// SELECT id, role, password FROM Users WHERE username = $1 {.Varchar}