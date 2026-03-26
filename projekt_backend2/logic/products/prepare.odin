package product

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("products_range", `
        SELECT id, name, category, manufacturer, price, stock, pic_url, description
        FROM products
        WHERE
            ($1 = '' OR name ILIKE '%' || $1 || '%')
            AND ($2 = '' OR category = $2)
            AND ($3 = '' OR manufacturer = $3)
            AND ($4 = 0 OR price >= $4)
            AND ($5 = 0 OR price <= $5)
        ORDER BY id
        LIMIT $6 OFFSET $7`,
    {.Varchar, .Varchar, .Varchar, .Int4, .Int4, .Int4, .Int4})
    pool.prepare("products_count", `
        SELECT COUNT(*) AS num FROM products
        WHERE
            ($1 = '' OR name ILIKE '%' || $1 || '%')
            AND ($2 = '' OR category = $2)
            AND ($3 = '' OR manufacturer = $3)
            AND ($4 = 0 OR price >= $4)
            AND ($5 = 0 OR price <= $5)`,
    {.Varchar, .Varchar, .Varchar, .Int4, .Int4})
    pool.prepare("all_products", `
        SELECT id, name, category, manufacturer, price, stock, pic_url, description
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
        DELETE FROM products WHERE id = $1
        RETURNING id`,
    {.Int4})

    pool.prepare("product_update", `
        UPDATE products
        SET name = COALESCE(NULLIF($1, ''), name),
            category = COALESCE(NULLIF($2, ''), category),
            manufacturer = COALESCE(NULLIF($3, ''), manufacturer),
            price = CASE WHEN $4 = 0 THEN price ELSE $4 END,
            stock = CASE WHEN $5 = 0 THEN stock ELSE $5 END,
            description = COALESCE(NULLIF($6, ''), description)
        WHERE id = $7
        RETURNING id`,
    {.Varchar, .Varchar, .Varchar, .Int4, .Int4, .Text, .Int4})
}
