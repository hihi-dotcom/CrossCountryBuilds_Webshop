package orders

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("order_begin",
        "begin"
    )
    pool.prepare("order_insert_address", `
        INSERT INTO Addresses (user_id, type, zip_code, street, city_name) VALUES
        ($1, $2, $3, $4, $5)
        RETURNING id `, 
    {.Int4, .Varchar, .Text, .Varchar, .Varchar})
    pool.prepare("order_insert",`
        INSERT INTO Orders (user_id, delivery_addr_id, billing_addr_id, payment_method, delivery_method) VALUES
        ($1, $2, $3, $4, $5)
        RETURNING id`,
    {.Int4, .Int4, .Int4, .Varchar, .Varchar})
    pool.prepare("order_products", `
        WITH reserved AS (
            UPDATE Products
            SET stock = stock - $3
            WHERE id = $2
            AND stock >= $3
            RETURNING id
        )
        INSERT INTO Order_Products (order_id, product_id, quantity, sell_price)
        SELECT $1, $2, $3, $4
        FROM reserved`, 
    {.Int4, .Int4, .Int4, .Int4})
    pool.prepare("order_end",
        "END"
    )
    pool.prepare("order_rollback",
        "ROLLBACK"
    )

    pool.prepare("order_status_update",`
        UPDATE Orders  
        SET status = $1
        WHERE id = $2
    `, {.Varchar, .Int4})

    pool.prepare("order_delete",`
        DELETE FROM Orders
        WHERE id = $1
    `, {.Int4})

    pool.prepare("order_all", `
        SELECT COALESCE(json_agg(order_obj), '[]'::json) AS orders
        FROM (
        SELECT
            json_build_object(
            'id', o.id,
            'u_id', o.user_id,
            'customer_name', u.username,

            'Daddress', concat_ws(', ',
                concat_ws(' ', ad.street, ad.zip_code),
                ad.city_name
            ),

            'Baddress', concat_ws(', ',
                concat_ws(' ', ab.street, ab.zip_code),
                ab.city_name
            ),

            'dMethod', o.delivery_method,
            'pMethod', o.payment_method,

            'total_amount', COALESCE(SUM(op.quantity * op.sell_price), 0),
            'status', o.status,

            'items', COALESCE(
                json_agg(
                DISTINCT jsonb_build_object(
                    'id', p.id,
                    'p_name', p.name,
                    'p_price', op.sell_price
                )
                ) FILTER (WHERE op.id IS NOT NULL),
                '[]'::json
            )
            ) AS order_obj
        FROM Orders o
        JOIN Users u ON u.id = o.user_id
        LEFT JOIN Addresses ad ON ad.id = o.delivery_addr_id
        LEFT JOIN Addresses ab ON ab.id = o.billing_addr_id
        LEFT JOIN Order_Products op ON op.order_id = o.id
        LEFT JOIN Products p ON p.id = op.product_id
        GROUP BY o.id, u.id, ad.id, ab.id
        ORDER BY o.id DESC
        ) t;
    `)
}