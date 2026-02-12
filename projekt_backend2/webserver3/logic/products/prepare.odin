package product

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("products_range", `
        SELECT id, name, category, manufacturer, price, stock, pic_url, description
        FROM products
        ORDER BY id
        LIMIT $1 OFFSET $2`,
    {.Int4, .Int4})
    pool.prepare("products_count", "SELECT COUNT(*) AS num FROM products", {})
    pool.prepare("all_products", `
        SELECT id, name, category, manufacturer, price, stock, pic_url
        FROM products`
    )
    pool.prepare("product_add",`
        INSERT INTO products (name, category, manufacturer, price, stock, pic_url, description) VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
    {.Varchar, .Varchar, .Varchar, .Int4, .Int4, .Varchar, .Text})

    pool.prepare("products_by_id", `
        SELECT id, name, category, manufacturer, price, stock, pic_url, description
        FROM products
        WHERE id = $1`,
    {.Int4})

    pool.prepare("product_delete", `
        DELETE FROM products WHERE id = $1`,
    {.Int4})
}
