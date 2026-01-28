const exp = require("express")
const sql = require("mysql2/promise")
const jwt = require("jsonwebtoken")
const cors = require('cors');

const SECRET = "hebelebobelepup"
const PORT = 3000
const DBConnP = {
    host: "127.0.0.1", 
    database: "main", 
    user: "root", 
    password: "1234"
}

const app = exp()
app.use(exp.json())
app.use(cors())

app.get("/products", products)
app.get("/product/:id", get_product_by_id)
app.post("/api/login", login)
app.post("/api/signup", registration)
app.get("/users", auth, get_users)
app.delete("/user/:id", auth, delete_user)
app.delete("/user", auth, delete_user_by_email)
app.get("/orders/:userId", auth, get_orders_by_user)
app.delete("/orders/:userId", auth, delete_orders_by_user)
app.patch("/order/:id/status", auth, update_order_status)
app.delete("/order/:id", auth, delete_order)
app.post("/product", auth, create_product)
app.delete("/product/:id", auth, delete_product)
app.put("/product/:id", auth, update_product)
app.get("/appointments", auth, get_appointments)
app.post("/appointment", auth, book_appointment)
app.delete("/appointments/:userId", auth, delete_appointment)
app.post("/date", auth, add_available_date)
app.get("/admin/appointments", auth, get_pending_appointments)
app.patch("/appointments/:userId", auth, admin_update_appointment)
app.get("/user/:id", auth, get_user_by_id)
app.put("/user/:id", auth, update_user_by_id)
app.patch("/user/password/:id", auth, change_password)
app.get("/api/user", auth, get_user)
app.patch("/api/user", auth, update_user)
app.post("/order", auth, order)
app.get("/orders", auth, get_orders_for_admin)
 
app.listen(PORT, () => { console.log(`Webserver started! Listening on port ${PORT}`) })

/**
 * @type {import("express").Handler}
 */
async function products(req, res) {
    const {from, to, name, category, manufacturer, from_price, to_price} = req.query

    if (!from || !to) {
        return res.status(400).send("Missing parameter")
    }

    const conn = await sql.createConnection(DBConnP)
    const [rows] = await conn.query("call termekek(?,?,?,?,?,?,?)", 
        [from, to, name, category, manufacturer, from_price, to_price]
    )
    conn.end()

    res.json(rows[0])
}

/** to be continnued
 * @type {import("express").Handler}
 */
async function order(req, res) {
    const {products, delivery, payment, name, email, shipping_address, billing_address, total} = req.body
    if (!products) {
        return res.status(400).send("Products required")
    }
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("START TRANSACTION")
        const [orderResult] = await conn.query("INSERT INTO Orders (Visitor_id, shipping_method, payment_method) VALUES (?, ?, ?)",
            [req.uid, delivery, payment]
        )
        const orderId = orderResult.insertId
        for (const p of products) {
            const productId = p["id"]
            const quantity = p["num_of_products"] || 1
            
            await conn.query("INSERT INTO Products_Orders (Product_id, Order_id, quantity) VALUES (?, ?, ?)",
                [productId, orderId, quantity]
            )
        }
        await conn.query("COMMIT")
        
        res.status(201).send("Created")
        
    } catch (err) {
        await conn.query("ROLLBACK")
        console.error("Order error:", err)
        res.status(500).send("Order creation failed")
    } finally {
        conn.end()
    }
}

/** 
 * @type {import("express").Handler}
 */
async function login(req, res) {
    const {email, password} = req.body

    const conn = await sql.createConnection(DBConnP)
    const [row] = await conn.query("select login(?,?) as id",
        [email, password]
    )
    conn.end()

    if (row[0].id == 0) {
        return res.status(401).send("Bad email or password")
    }

    const token = jwt.sign({id: row[0].id}, SECRET)
    res.json({token})
}

/**
 * @type {import("express").Handler}
 */
async function auth(req, res, next) {
    const token = req.headers["x-access-token"]

    try {
        const payload = jwt.verify(token, SECRET)
        req.uid = payload.id
    } catch {
        return res.status(401).send("Unauthorized")
    }
    next()
}

/**
 * @type {import("express").Handler}
 */
async function registration(req, res) {
    const {email, username, password} = req.body
    if (!email || !username || !password) { 
        return res.status(400).send("bad request") 
    }
    const conn = await sql.createConnection(DBConnP)
    let userId
    try {
        await conn.query("call registration(?,?,?)",
            [username, email, password]
        )
        const [rows] = await conn.query("SELECT id FROM Visitors WHERE email=?", [email])
        userId = rows[0].id
    } catch (err) {
        return res.status(400).send("Email is already in use")
    }
    conn.end()
    const token = jwt.sign({id: userId}, SECRET)
    res.status(201).json({token}) 
}

/**
 * @type {import("express").Handler}
 */
async function get_user(req, res) {

    const conn = await sql.createConnection(DBConnP)
    const [row] = await conn.query("call get_user(?)", 
        [req.uid]
    )
    res.json(row[0])
}

/**
 * @type {import("express").Handler}
 */
async function update_user(req, res) {
    const {username, email, delivery_address, billing_address, password} = req.body

    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call update_user(?,?,?,?,?,?)",
            [req.uid, username, delivery_address, billing_address, email, password]
        )
    } catch {
        return res.status(409).send("Email is already in use.")
    }
    res.status(202).send("Resource changed")
}

/**
 * @type {import("express").Handler}
 */
async function get_users(req, res) {
    const conn = await sql.createConnection(DBConnP)
    try {
        const [rows] = await conn.query("call get_users()")
        res.json(rows[0])
    } catch (err) {
        console.error("Get users error:", err)
        res.status(500).send("Failed to get users")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function delete_user(req, res) {
    const userId = req.params.id
    
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call delete_user(?)", [userId])
        res.status(200).send("User deleted")
    } catch (err) {
        console.error("Delete user error:", err)
        res.status(500).send("Failed to delete user")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function get_product_by_id(req, res) {
    const productId = req.params.id
    const conn = await sql.createConnection(DBConnP)
    try {
        const [rows] = await conn.query("call get_product_by_id(?)", [productId])
        if (rows[0].length === 0) {
            return res.status(404).send("Product not found")
        }
        res.json(rows[0][0])
    } catch (err) {
        console.error("Get product error:", err)
        res.status(500).send("Failed to get product")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function create_product(req, res) {
    const {name, category, maker, description, price, num_of_products} = req.body
    
    if (!name || !price) {
        return res.status(400).send("Name and price required")
    }
    
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call insert_product(?,?,?,?,?,?,?)", 
            [name, category || null, maker || null, description || null, null, price, num_of_products || 0]
        )
        res.status(201).send("Product created")
    } catch (err) {
        console.error("Create product error:", err)
        res.status(500).send("Failed to create product")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function delete_product(req, res) {
    const productId = req.params.id
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call delete_product(?)", [productId])
        res.status(200).send("Product deleted")
    } catch (err) {
        console.error("Delete product error:", err)
        res.status(500).send("Failed to delete product")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function get_appointments(req, res) {
    const conn = await sql.createConnection(DBConnP)
    try {
        const [rows] = await conn.query("call get_available_dates()")
        res.json(rows[0])
    } catch (err) {
        console.error("Get available dates error:", err)
        res.status(500).send("Failed to get available dates")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function book_appointment(req, res) {
    const visitor_id = req.uid
    const {appointmentDate, description} = req.body
    
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call book_appointment(?,?,?)", 
            [visitor_id, appointmentDate, description]
        )
        res.status(201).send("Appointment booked")
    } catch (err) {
        console.error("Book appointment error:", err)
        res.status(500).send("Failed to book appointment")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function get_pending_appointments(req, res) {
    const conn = await sql.createConnection(DBConnP)
    try {
        const [rows] = await conn.query("call get_pending_appointments()")
        res.json(rows[0])
    } catch (err) {
        console.error("Get pending appointments error:", err)
        res.status(500).send("Failed to get appointments")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function add_available_date(req, res) {
    const {visitor_id, title} = req.body
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call add_available_date(?,?)", [visitor_id, title])
        res.status(201).send("Available date added")
    } catch (err) {
        console.error("Add date error:", err)
        res.status(500).send("Failed to add date")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function admin_update_appointment(req, res) {
    const visitorId = req.params.userId
    const {pickup_date, service_type, price} = req.body
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call admin_update_appointment(?,?,?,?)", 
            [visitorId, pickup_date, service_type, price]
        )
        res.status(200).send("Appointment updated")
    } catch (err) {
        console.error("Update appointment error:", err)
        res.status(500).send("Failed to update appointment")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function get_orders_for_admin(req, res) {
    const conn = await sql.createConnection(DBConnP)
    try {
        const [rows] = await conn.query("call get_orders_for_admin()")
        res.json(rows[0])
    } catch (err) {
        console.error("Get orders error:", err)
        res.status(500).send("Failed to get orders")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function update_order_status(req, res) {
    const orderId = req.params.id
    const {status} = req.body
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call update_order_status(?,?)", [orderId, status])
        res.status(200).send("Order status updated")
    } catch (err) {
        console.error("Update order status error:", err)
        res.status(500).send("Failed to update order status")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function delete_order(req, res) {
    const orderId = req.params.id
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call delete_order(?)", [orderId])
        res.status(200).send("Order deleted")
    } catch (err) {
        console.error("Delete order error:", err)
        res.status(500).send("Failed to delete order")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function delete_appointment(req, res) {
    const appointmentId = req.params.userId
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call delete_appointment(?)", [appointmentId])
        res.status(200).send("Appointment deleted")
    } catch (err) {
        console.error("Delete appointment error:", err)
        res.status(500).send("Failed to delete appointment")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function delete_user_by_email(req, res) {
    const email = req.query.email  // Extract from query string
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call delete_user_by_email(?)", [email])
        res.status(200).send("User deleted")
    } catch (err) {
        console.error("Delete user by email error:", err)
        res.status(500).send("Failed to delete user")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function update_product(req, res) {
    const productId = req.params.id
    const {name, category, maker, description, price, num_of_products} = req.body
    
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("UPDATE Products SET name=?, category=?, manufacturer=?, description=?, price=?, quantity=? WHERE id=?", 
            [name, category, maker, description, price, num_of_products, productId]
        )
        res.status(200).send("Product updated")
    } catch (err) {
        console.error("Update product error:", err)
        res.status(500).send("Failed to update product")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function get_user_by_id(req, res) {
    const userId = req.params.id
    const conn = await sql.createConnection(DBConnP)
    try {
        const [row] = await conn.query("SELECT * FROM Visitors WHERE id=?", [userId])
        res.json(row[0])
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function update_user_by_id(req, res) {
    const userId = req.params.id
    const {name, email, shipping_address, billing_address} = req.body

    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call update_user(?,?,?,?,?,?)", 
            [userId, name, shipping_address, billing_address, email, null]
        )
        res.status(200).send("User updated")
    } catch {
        res.status(400).send("Update failed")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function get_orders_by_user(req, res) {
    const userId = req.params.userId
    const conn = await sql.createConnection(DBConnP)
    try {
        const [rows] = await conn.query("SELECT * FROM Orders WHERE Visitor_id=?", [userId])
        res.json(rows)
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function delete_orders_by_user(req, res) {
    const userId = req.params.userId
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("DELETE FROM Products_Orders WHERE Order_id IN (SELECT id FROM Orders WHERE Visitor_id=?)", [userId])
        await conn.query("DELETE FROM Orders WHERE Visitor_id=?", [userId])
        res.status(200).send("Orders deleted")
    } finally {
        conn.end()
    }
}

/**
 * @type {import("express").Handler}
 */
async function change_password(req, res) {
    const userId = req.params.id
    const {password} = req.body
    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call update_user(?,?,?,?,?,?)", 
            [userId, null, null, null, null, password]
        )
        res.status(200).send("Password changed")
    } catch {
        res.status(400).send("Password not changed")
    } finally {
        conn.end()
    }
}