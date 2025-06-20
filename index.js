const express = require("express");
require("dotenv").config();
const cors = require("cors");

const { connectDB, getDB } = require("./db");
const urlRoute = require("./routes/url.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));

// Connect to MySQL
connectDB()
    .then(() => console.log("MySQL DB connected successfully"))
    .catch(err => {
        console.error("MySQL connection error:", err);
        process.exit(1);
    });

app.use(express.json());
app.use("/url", urlRoute);
app.get("/", async (req, res) => {
    return res.status(200).send("running short url backend server")
})
// Handle redirection and record visit
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    if (!shortId) {
        return res.status(400).send("Short ID is required");
    }

    let connection;
    try {
        const pool = await getDB();
        connection = await pool.getConnection();
        console.log(`Acquired connection for redirecting shortId: ${shortId}`);

        // Begin transaction
        await connection.beginTransaction();

        // Find the URL
        const findUrlQuery = "SELECT id, redirectURL FROM urls WHERE shortId = ?";
        const [urlRows] = await connection.execute(findUrlQuery, [shortId]);

        if (urlRows.length === 0) {
            await connection.rollback(); // Rollback transaction
            console.log(`Short ID not found: ${shortId}`);
            return res.status(404).send("Short URL not found");
        }

        const urlData = urlRows[0];

        // Record the visit
        const insertVisitQuery = "INSERT INTO visit_history (url_id, visit_timestamp) VALUES (?, NOW())";
        await connection.execute(insertVisitQuery, [urlData.id]);
        console.log(`Recorded visit for url_id: ${urlData.id}`);

        // Commit transaction
        await connection.commit();

        // Perform the redirect
        console.log(`Redirecting ${shortId} to ${urlData.redirectURL}`);
        return res.redirect(urlData.redirectURL);

    } catch (error) {
        console.error(`Error handling redirect for ${shortId}:`, error);
        if (connection) {
            await connection.rollback(); // Rollback transaction on error
        }
        return res.status(500).send("Internal server error");
    } finally {
        if (connection) {
            console.log(`Releasing connection for shortId: ${shortId}`);
            connection.release();
        }
    }
});

app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));

