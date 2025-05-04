const fs = require("fs");
const path = require("path");

const users = path.join(__dirname, "users.json");

async function getUser() {
  try {
    const data = await fs.readFile(users, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading user file:", err);
    return [];
  }
}

async function saveUser(user) {
  try {
    await fs.writeFile(users, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving users file:", err);
  }
}

module.exports = { getUser, saveUser };
