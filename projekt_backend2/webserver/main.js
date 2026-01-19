const exp = require("express")
const sql = require("mysql2/promise")
const jwt = require("jsonwebtoken")

const PORT = 30000

const app = exp()
app.use(exp.json())

/**
 * @type {import("mysql2/promise").Connection}
 */
let conn = undefined

app.get("/api/products", products)

_ = async function() {
    try {
        conn = await sql.createConnection({
            host: "127.0.0.1", 
            database: "main", 
            user: "root", 
            password: "1234"
        })
        console.log("Database connected!")
    } catch (err) {
        console.log(err)
        console.log("FATAL -- Server can't connect to database!")
    }
    app.listen(PORT, () => { console.log(`Webserver started! Listening on port ${PORT}`) })
} ()

/**
 * @type {import("express").Handler}
 */
async function products(req, res) {
    const from = req.query.from
    const to = req.query.to

    console.log(from, to)
}