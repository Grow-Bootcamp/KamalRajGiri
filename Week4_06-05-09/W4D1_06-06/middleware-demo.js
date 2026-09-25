const express = require('express'); // import express module

const app = express();  // create an express application
const morgan = require('morgan');

app.use(morgan('dev'));

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // call the next middleware function in the stack
}; //deafult middleware function

app.use(logger); // register the middleware with express. Because it is registered globally, it runs for requests that reach that point in the middleware stack.

// Define routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

const checkAccess = (req, res, next) => {
    console.log('Checking access...');
    next();
};

app.get('/dashboard', checkAccess, (req, res) => { // this route has a specific middleware function that runs before the route handler
    res.send('Dashboard');
});

app.get('/profile',(req, res) => {
    res.send('Profile Page');
});
// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});