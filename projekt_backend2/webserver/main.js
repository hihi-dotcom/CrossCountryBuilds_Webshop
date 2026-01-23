const exp = require("express")
const sql = require("mysql2/promise")
const jwt = require("jsonwebtoken")
const e = require("express")

const SECRET = "hebelebobelepup"
const PORT = 30000
const DBConnP = {
    host: "127.0.0.1", 
    database: "main", 
    user: "root", 
    password: "1234"
}

const app = exp()
app.use(exp.json())

app.get("/api/products", products)
app.put("/api/order", auth, order)
app.post("/api/login", login)
app.put("/api/registration", registration)
app.get("/api/user", auth, get_user)
app.patch("/api/user", auth, update_user)
 
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
    const products = req.body["products"]
    const delivery = req.body["szállítási mód"]
    const payment = req.body["fizetési mód"]

    const conn = await sql.createConnection(DBConnP)

    for (const p in products) {
        const name = p["product name"]
        const number = p["product number"]

        await conn.query("start transaction")

        const result = await conn.query("call create_order(?)",
            [req.uid]
        )
        
        console.log(result)


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
    const {email, name, password} = req.body
    if (!email || !name || !password) { return res.status(400).send("bad request") }

    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call registration(?,?,?)",
            [name, email, password]
        )
    } catch (err) {
        return res.status(400).send("Email is already in use")
    }
    conn.end()

    res.status(201).send("User created")
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

/** It tryes to update email so it wont work
 * @type {import("express").Handler}
 */
async function update_user(req, res) {
    const {username, email, delivery_address, billing_address, password} = req.body

    const conn = await sql.createConnection(DBConnP)
    try {
        await conn.query("call update_user(?,?,?,?,?,?)"
            [req.uid, username, delivery_address, billing_address, email, password]
        )
    } catch {
        return res.status(409).send("Email is already in use.")
    }
    res.status(202).send("Resource changed")
}