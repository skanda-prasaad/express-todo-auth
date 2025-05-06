const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Handle all routes for SPA
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
