# Learning Log - Week 3, Day 5

**Date:** 22/23 September 2026  
**Topics:** Express middleware, template engines, and npm package versioning

## Objectives

- Understand how middleware participates in the Express request-response cycle.
- Implement application-level, route-level, router-level, built-in, and error-handling middleware.
- Render dynamic HTML using the EJS template engine.
- Understand semantic versioning and how dependency ranges are declared and resolved.

## 1. Express Middleware

Middleware is a function that runs during the request-response cycle. It can inspect or change the request and response objects, end the response, or pass control to the next middleware with `next()`.

The general form is:

```js
const middleware = (req, res, next) => {
    // Perform work for the request.
    next();
};
```

Calling `next()` is important when the middleware does not send a response. Without it, the request remains pending and later middleware or the route handler will not run.

### Middleware examples studied

- **Application-level middleware:** registered with `app.use()` and applied to matching requests. The logger in `middleware-demo.js` records the HTTP method and URL.
- **Route-level middleware:** attached to a particular route. `checkAccess` runs before the `/dashboard` handler.
- **Router-level middleware:** registered on an `express.Router()` instance and applied to routes mounted under a path such as `/users`.
- **Built-in middleware:** `express.json()` parses JSON request bodies and makes the result available through `req.body`.
- **Third-party middleware:** `morgan('dev')` logs HTTP requests in a readable development format.
- **Error-handling middleware:** uses the four-parameter signature `(err, req, res, next)`. A route passes an error with `next(error)`, and the error handler returns a consistent response.

Example of middleware ordering:

```js
app.use(express.json());
app.use(logger);

app.get('/dashboard', checkAccess, (req, res) => {
    res.send('Dashboard');
});

app.use(errorHandler);
```

Express evaluates middleware in registration order. A middleware function must be registered before the route or middleware it is intended to affect. Error-handling middleware should be registered after the routes that may forward errors to it.

## 2. Template Engines with EJS

A template engine combines an HTML template with server-side data to produce an HTML response. EJS uses JavaScript-style tags inside an HTML file.

The template-engine example configures EJS with:

```js
app.set('view engine', 'ejs');
```

A route then sends data to a view with `res.render()`:

```js
app.get('/', (req, res) => {
    res.render('home', {
        name: 'Kamal',
        course: 'Computer Engineering'
    });
});
```

Important EJS syntax used in the example:

- `<%= value %>` outputs and escapes a value.
- `<% code %>` runs JavaScript without directly outputting it.
- A `forEach` loop can generate repeated HTML elements.

The `/students` route passes an array to `students.ejs`, where a loop creates one list item for each student. This keeps presentation in the view while the route prepares the data.

## 3. npm Package Versioning

The template-engine project uses `package.json` to describe the application and its dependencies. The `package-lock.json` file records the resolved dependency tree so installations can be reproduced more consistently.

The project declares dependencies using semantic versioning in the form `MAJOR.MINOR.PATCH`:

- **Major:** incompatible API changes.
- **Minor:** backward-compatible features.
- **Patch:** backward-compatible fixes.

Common version declarations:

- `"1.2.3"` installs only that exact version.
- `"^1.2.3"` allows compatible minor and patch updates below version `2.0.0`.
- `"~1.2.3"` allows patch updates below version `1.3.0`.

The example `package.json` uses caret ranges for Express and EJS. `npm install` resolves versions and updates the lock file when dependency resolution changes. `npm outdated` can be used to compare installed, wanted, and latest versions.

## Key Takeaways

1. Middleware composes request processing into small, reusable functions.
2. `next()` passes control forward; `next(error)` passes control to error-handling middleware.
3. Middleware order affects application behavior.
4. `res.render()` combines route data with an EJS view to create dynamic HTML.
5. `package.json` declares dependency intent, while `package-lock.json` records resolved versions.
6. Caret, tilde, and exact version ranges provide different levels of update flexibility.

## Practice Verification

The following behavior is represented in the practice files:

- `GET /` returns a home page.
- `GET /about` and `GET /profile` return separate responses.
- `GET /dashboard` runs access-check middleware before the route handler.
- `POST /users` parses and returns JSON data through `express.json()`.
- `GET /error` forwards an error to the error handler.
- The template-engine server renders `/` with name and course data.
- The template-engine server renders `/students` from an array using an EJS loop.

## Reflection

I learned that Express middleware is a pipeline rather than a single feature. Each function has one responsibility, and the order in which functions are registered determines how a request is processed. I also connected server-side data preparation with template rendering: routes provide data, while EJS controls how that data appears in HTML.

The package-versioning exercise showed why dependency ranges and lock files matter. A range communicates which updates are acceptable, while the lock file helps the project use a repeatable dependency tree.

## Follow-up Actions

- Prepare and present a short summary of the week's middleware, template-engine, and npm topics to the mentor.
- Raise the practice-code pull request and share its link with the mentor.
- Add this log and the PR link to the required Zoho and Microsoft Teams comments.
- Consolidate the completed daily logs into the weekly learning summary at the end of the week.
