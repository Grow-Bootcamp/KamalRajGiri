# Week 3 Day 5: Event Loop, Events, and Routing

## 1. Overview

Today I studied how Node.js performs non-blocking I/O, how event-driven applications communicate through `EventEmitter`, and how backend routes can be implemented with both Node's built-in `http` module and Express.

The practical examples covered event-loop scheduling, file I/O, order-related events, URL and request-body handling, Express middleware, and modular routers.

## 2. Node.js Event Loop

Node.js runs JavaScript on a main thread and uses asynchronous mechanisms to start I/O operations without waiting for them to finish. This allows the application to continue handling other work while file, network, or database operations are in progress.

The general flow is:

```text
Request
   ↓
Start asynchronous I/O
   ↓
Continue other JavaScript work
   ↓
I/O completes
   ↓
Callback becomes ready
   ↓
Event loop executes the callback
```

### Synchronous and Asynchronous Work

* **Synchronous:** The next operation waits until the current operation finishes.
* **Asynchronous:** An operation starts, and Node.js can continue with other work before its callback runs.

### Event Loop Phases

The main event-loop phases studied were:

| Phase | Purpose |
| --- | --- |
| Timers | Executes eligible `setTimeout()` and `setInterval()` callbacks. |
| Pending callbacks | Executes certain callbacks deferred from earlier operations. |
| Idle/prepare | Performs internal Node.js work. |
| Poll | Retrieves and processes I/O-related events such as completed file or network operations. |
| Check | Executes `setImmediate()` callbacks. |
| Close callbacks | Handles close events such as `socket.on('close', ...)`. |

After these phases, the event loop continues repeating while work remains.

### Microtasks

Promises and `process.nextTick()` are microtasks rather than event-loop phases. In the examples, `process.nextTick()` runs before Promise callbacks. Microtasks are processed before Node.js continues to the next event-loop phase.

The `event-loop.js` example demonstrates that synchronous statements run first, followed by microtasks, and then timer or immediate callbacks. The relative order of `setTimeout(..., 0)` and `setImmediate()` at the top level can vary, so application code should not depend on one always running first.

### Event Loop and File I/O

The `event-loop-io.js` example schedules both a zero-delay timer and `setImmediate()` from inside an `fs.readFile()` callback. Because the callback runs after I/O and `setImmediate()` belongs to the check phase, the immediate callback commonly runs before the timer in this context.

The important distinction is that the callback scheduling context affects the observed order.

## 3. Event-Driven Architecture

An event-driven application emits an event when something happens and allows separate listeners to respond to it. This reduces coupling between the code that produces an event and the code that handles it.

Node.js provides `EventEmitter` through the built-in `events` module.

```javascript
const EventEmitter = require('events');
const orderEvents = new EventEmitter();
```

### EventEmitter Methods

| Method | Use |
| --- | --- |
| `on(event, handler)` | Registers a listener that runs every time the event is emitted. |
| `once(event, handler)` | Registers a listener that runs only once. |
| `emit(event, data)` | Fires an event and passes data to its listeners. |
| `off(event, handler)` | Removes a previously registered listener. |

### Order Event Example

The order example emits `orderPlaced` after an order is created. Multiple independent listeners respond to the same event:

```javascript
orderEvents.on('orderPlaced', logOrder);
orderEvents.on('orderPlaced', updateInventory);
orderEvents.on('orderPlaced', sendNotification);
orderEvents.on('orderPlaced', recordAnalytics);

orderEvents.emit('orderPlaced', {
    id: 103,
    amount: 120
});
```

This models a workflow where logging, inventory updates, notifications, and analytics can be added or changed independently.

The `events-demo.js` example also shows why a named handler is useful: the same function reference can be passed to `off()` to stop receiving future events.

## 4. Routing with Node's HTTP Module

The `routing.js` example creates a server with `http.createServer()` and manually checks the request method and URL.

The implemented routes are:

| Method | Route | Behavior |
| --- | --- | --- |
| `GET` | `/users` | Returns a user-list response. |
| `GET` | `/users/:id` | Extracts the user ID from the URL. |
| `GET` | `/search?keyword=...&page=...` | Reads query parameters with `URL` and `searchParams`. |
| `POST` | `/users` | Collects chunks from the request body and creates a user response. |
| Any unmatched request | Any path | Returns a JSON 404 response. |

For a POST request, the body arrives in chunks. The example listens for `data`, combines the chunks, and waits for `end` before parsing the JSON.

```javascript
let body = '';

req.on('data', chunk => {
    body += chunk;
});

req.on('end', () => {
    const user = JSON.parse(body);
});
```

Manual routing provides a clear view of how HTTP requests work, but it also requires more repetitive handling for methods, paths, parameters, bodies, status codes, and errors.

## 5. Routing with Express

The Express example simplifies routing and request parsing:

* `express.json()` parses JSON request bodies.
* `req.params.id` reads a route parameter.
* `req.query.keyword` and `req.query.page` read query parameters.
* `res.json()` sends JSON responses.
* `res.status(201).json()` sends a response with a specific status code.
* A final middleware function handles unmatched routes with a 404 response.

### Express Router

The `routes/users.js` file creates a modular router:

```javascript
const router = express.Router();

router.get('/', ...);
router.get('/:id', ...);
router.post('/', ...);

module.exports = router;
```

It is mounted in the application with:

```javascript
app.use('/users', usersRouter);
```

The router's `/` route therefore becomes `/users`, and its `/:id` route becomes `/users/:id`.

Route order matters in Express. Middleware and routes are evaluated in the order they are registered, so a route or router that sends a response can prevent later handlers from running. The users router should be the single owner of the `/users` endpoints instead of duplicating those handlers in `express-routing.js`.

## 6. What I Learned

1. Node.js can handle many I/O-heavy operations without blocking the JavaScript thread while those operations are pending.
2. The event loop has distinct phases, and `setImmediate()` runs in the check phase.
3. `process.nextTick()` has higher priority than Promise microtasks in Node.js.
4. The order of timers and immediates depends on where they are scheduled.
5. `EventEmitter` supports a publish-subscribe style of communication between application components.
6. Named event handlers can be removed with `off()`.
7. Raw Node routing exposes the underlying HTTP and stream behavior but requires manual parsing and response handling.
8. Express provides middleware, route parameters, query parsing, JSON body parsing, and modular routers that reduce boilerplate.
9. Middleware and route registration order controls which Express handler receives a request.
10. A final 404 handler should be registered after the application's valid routes.

## 7. Verification Checklist

- [x] Read and compare the six event-loop phases.
- [x] Demonstrate synchronous logs, timers, immediates, Promise microtasks, and `process.nextTick()`.
- [x] Compare `setTimeout()` and `setImmediate()` inside a file I/O callback.
- [x] Create and emit an `orderPlaced` event with multiple listeners.
- [x] Register and remove an event listener with `off()`.
- [x] Implement GET and POST routes with Node's `http` module.
- [x] Read route parameters and query parameters.
- [x] Create an Express router and mount it under `/users`.
- [x] Add JSON responses and a fallback 404 handler.
- [x] Check the JavaScript files with `node --check`.
- [ ] Add malformed JSON error handling to the raw Node POST route.
- [ ] Test the raw Node and Express endpoints with an HTTP client.
- [ ] Submit the learning log and practice code through the required pull-request workflow.