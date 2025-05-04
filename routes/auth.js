const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUsers, saveUsers } = require("../data/users");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async function (req, res) {
  let users = [];
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Username and password are required..." });
  }
  users = await getUsers();
  const userExist = users.find((user) => user.username == username);
  if (userExist) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashPsw = await bcrypt.hash(password, 10);
  users.push({
    username: username,
    password: hashPsw,
  });
  await saveUsers(users);

  res.status(201).json({
    message: "User registered successfully",
  });
});

// login route :

router.post("/login", async function (req, res) {
  let users = [];
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: "Username and password are required..." });
  }

  users = await getUsers();
  const existUser = users.find((user) => user.username == username);

  if (!existUser) {
    return res.status(401).json({ message: "Credentials incorrect" });
  }
  const match = await bcrypt.compare(password, existUser.password);
  if (!match) {
    return res.status(401).json({ message: "Credentials incorrect" });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
