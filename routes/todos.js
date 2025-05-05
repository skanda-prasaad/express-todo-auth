const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const authenticate = require("../middleware/authentication");

const todosPath = path.join(__dirname, "../data/todos.json");

// Helper to get all todos
async function getTodos() {
  try {
    const data = await fs.readFile(todosPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading todos:", err);
    return [];
  }
}

// Helper to save todos
async function saveTodos(todos) {
  try {
    await fs.writeFile(todosPath, JSON.stringify(todos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving todos:", err);
  }
}

// 🟢 GET all todos for logged-in user
router.get("/", authenticate, async (req, res) => {
  const todos = await getTodos();
  const userTodos = todos.filter((todo) => todo.username === req.user.username);
  res.json(userTodos);
});

// 🔵 POST: Add a new todo
router.post("/", authenticate, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const todos = await getTodos();
  const newTodo = {
    id: Date.now(),
    username: req.user.username,
    title,
    completed: false,
  };

  todos.push(newTodo);
  await saveTodos(todos);
  res.status(201).json({ message: "Todo added", todo: newTodo });
});

// 🟠 PUT: Update a todo
router.put("/todos/:id", authenticate, async function (req, res) {
  const todoID = parseInt(req.params.id);
  const username = req.user.username;
  const { title, completed } = req.body;
  const todos = await getTodos();

  const todoIndex = todos.findIndex(
    (todo) => todo.id === todoID && todo.username === username
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) {
    todos[todoIndex].title = title;
  }
  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }

  await saveTodos(todos);
  res.json({ message: "Todo updated", todo: todos[todoIndex] });
});

// 🟥 DELETE: Delete a todo
router.delete("/todos/:id", authenticate, async function (req, res) {
  const username = req.user.username;
  const todoID = parseInt(req.params.id);
  const todos = await getTodos();

  const todoIndex = todos.findIndex(
    (todo) => todo.id === todoID && todo.username === username
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Remove the todo from the array
  todos.splice(todoIndex, 1);

  await saveTodos(todos);
  res.json({ message: "Todo deleted" });
});

module.exports = router;
