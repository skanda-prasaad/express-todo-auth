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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
