const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const User = require("../models/User");

async function getUser(req, res, next) {
    const username = req.query.user;
    if (!username) return res.status(400).json({ error: "Missing user parameter" });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    req.user = user;
    next();
}

router.get("/", getUser, async (req, res) => {
    const filter = { user: req.user._id };
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
});

router.get("/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
});

router.post("/", getUser, async (req, res) => {
    const { title, description, priority, tags, assignedUsers } = req.body;
    const todo = new Todo({
        title,
        description,
        priority,
        tags,
        assignedUsers,
        user: req.user._id
    });
    await todo.save();
    res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Todo not found" });
    res.json(updated);
});

router.delete("/:id", async (req, res) => {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Deleted successfully" });
});

router.post("/:id/notes", async (req, res) => {
    const { content } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    todo.notes.push({ content });
    await todo.save();
    res.json(todo);
});

router.get("/export", getUser, async (req, res) => {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
});

module.exports = router;
