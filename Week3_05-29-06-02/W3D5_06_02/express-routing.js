const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const PORT = 3000;

app.get('/users', (req, res) => {
    res.json({
        message: 'List of users'
    });
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    res.json({
        message: 'User details',
        id: userId
    });
});

app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    const page = req.query.page;

    res.json({
        keyword,
        page
    });
});
app.post('/users', (req, res) => {
    const user = req.body;

    res.status(201).json({
        message: 'User created',
        user
    });
});
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});