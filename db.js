const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

async function connectDB() {
    if (pool) return pool;
    try {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST || "127.0.0.1", // Default to 127.0.0.1
            port: parseInt(process.env.MYSQL_PORT || "3306", 10), // Read port from env, default 3306
            user: process.env.MYSQL_USER || "root",
            password: process.env.MYSQL_PASSWORD || "",
            database: process.env.MYSQL_DATABASE || "short_url_db",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log(`Attempting to connect to MySQL at ${process.env.MYSQL_HOST || '127.0.0.1'}:${parseInt(process.env.MYSQL_PORT || '3306', 10)}`);
        // Test connection
        const connection = await pool.getConnection();
        console.log("MySQL connected successfully");
        console.log("Acquired connection from pool");
        connection.release();
        return pool;
    } catch (error) {
        console.error("MySQL connection error:", error);
        process.exit(1); // Exit if DB connection fails
    }
}

async function getDB() {
    if (!pool) {
        console.log("Pool not initialized, connecting...");
        await connectDB();
    }
    return pool;
}

module.exports = { connectDB, getDB };

