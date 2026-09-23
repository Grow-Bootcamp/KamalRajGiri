const express = require('express');

const app = express();

// Built-in Middleware
app.use(express.json());

// Application-level Middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

app.use(logger);

// Routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Route-level Middleware
const checkAccess = (req, res, next) => {
    console.log('Checking access...');
    next();
};

app.get('/dashboard', checkAccess, (req, res) => {
    res.send('Dashboard');
});

app.get('/profile', (req, res) => {
    res.send('Profile Page');
});

// JSON Body Example
app.post('/users', (req, res) => {
    console.log('Received data:', req.body);

    res.json({
        message: 'User data received',
        data: req.body
    });
});

// Route that generates an error
app.get('/error', (req, res, next) => {
    const error = new Error('Something went wrong!');
    next(error);
});

// Error-handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};

app.use(errorHandler);

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});