# Middleware
Middleware is a function that executes between receiving an HTTP request and sending the final response.
Middleware can : execute code, inspect the request, modify the request, modify the response, terminate the request-response cycle, pass control to another middleware using next().

* Basic Middleware Syntax
 app.use((req, res, next) => {
    console.log("Middleware executed");
    next();
}); 


req  → Incoming HTTP request
res  → HTTP response
next → Function that passes control forward


next() tells express "This middleware has finished its work. Continue to the next middleware or route." Without next() and without sending a response, the request can remain pending.

* Middleware order matters . Example:
app.use(middlewareA);
app.use(middlewareB);
app.get('/', routeHandler);

the flow is :
Request
   ↓
middlewareA
   ↓
middlewareB
   ↓
routeHandler
   ↓
Response



# Types of Middleware
1. Application-level middleware 
This is middleware attached to the Express application using app.use() or an HTTP method.
`app.use(logger);`
It can apply to many or all routes.

2. Route-level middleware
Instead of applying middleware globally, we can apply it only to a particular route.

const checkAccess = (req, res, next) => {
    console.log('Checking access...');
    next();
};
app.get('/dashboard', checkAccess, (req, res) => {
    res.send('Dashboard');
});

3. Built-in middleware
Express provides middleware that solves common tasks.
`app.use(express.json());`
This allows Express to parse incoming JSON request bodies.
If a client sends :
{
    "name": "Kamal",
    "course": "Computer Engineering"
}
then you can access it through: `req.body` 
`app.use(express.urlencoded({ extended: true }));`
which parses URL-encoded form data.

4. Third-party middleware
These are middleware packages installed through npm.

Common examples include: cors, helmet, morgan 

5. Error-handling middleware
Express has a special middleware signature for handling errors:
const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: 'Something went wrong'
    });
};

Notice the four parameters. That's how Express recognizes error-handling middleware.