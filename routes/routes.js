const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const { Task, User } = require('../schema');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Create task
router.post('/tasks', authMiddleware, async (req, res) => {
    const { title, description, status } = req.body;
    const task = new Task({
        title,
        description,
        status: status || 'Pending',
        userId: req.user.id
    });
    await task.save();
    res.status(201).json(task);
});

// Get all tasks for logged-in user
router.get('/tasks', authMiddleware, async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

// Get a single task
router.get('/tasks/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

// Update task
router.put('/tasks/:id', authMiddleware, async (req, res) => {
    const { title, description, status } = req.body;
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { title, description, status },
        { new: true }
    );
    if (!task) {
        return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json(task);
});

// Delete task
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
        return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task deleted successfully' });
});

module.exports = router;