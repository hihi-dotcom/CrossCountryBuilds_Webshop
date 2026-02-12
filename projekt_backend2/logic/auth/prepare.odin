package auth

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("get_user_id_role_and_password_by_username", 
        "SELECT id, username, password, role FROM Users where username = $1", 
    {.Varchar})
    pool.prepare("get_user_by_id", 
        "SELECT id, username, password, email, role FROM Users where id = $1", 
    {.Int4})
    pool.prepare("insert_user",`
        INSERT INTO Users (username, email, password) VALUES ($1,$2,$3)
        RETURNING id, role`,
    {.Varchar, .Varchar, .Text})
}