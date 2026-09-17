# Learning Log – Node.js Under the Hood & Express Basics

## Date

Week 3 Day 4 – 17 September 2026

## Topic

Understanding how Node.js works internally, especially the event loop, non-blocking I/O, asynchronous file operations, and basic Express.js server development.

---

## 1. What is Node.js?

Node.js is a cross-platform, open-source JavaScript runtime environment built on Google's V8 JavaScript engine. It allows JavaScript to run outside the browser and provides access to system features such as:

* File system operations
* Network communication
* Timers and events
* Database interaction
* Server-side application logic

Unlike browser JavaScript, Node.js can interact with the operating system and is commonly used to build backend applications and APIs.

### Key Idea

Node.js executes JavaScript on a single main thread, but it can handle many concurrent I/O operations efficiently using asynchronous APIs, the event loop, the operating system, and libuv.

---

## 2. How Node.js Works Under the Hood

Node.js is built around several important components.

### V8 Engine

V8 is Google's JavaScript engine. Node.js uses V8 to execute JavaScript code outside the browser.

### libuv

libuv is a C library used by Node.js to provide asynchronous I/O capabilities and the event loop.

It coordinates operations such as:

* File system operations
* Networking
* Timers
* Some DNS operations
* Thread-pool based tasks

### Node.js Bindings

Node.js provides C/C++ bindings that connect JavaScript APIs such as `fs`, `http`, and `net` with lower-level system functionality.

### Simplified Architecture

```text
JavaScript Code
       ↓
      V8
       ↓
Node.js APIs
       ↓
     libuv
       ↓
OS / Thread Pool
       ↓
I/O Operation
       ↓
Callback / Promise Continuation
       ↓
Event Loop
       ↓
JavaScript Execution
```

---

## 3. Single-threaded JavaScript vs. Concurrency

JavaScript execution in Node.js happens on a main thread with a single call stack.

However, this does not mean that Node.js can perform only one operation at a time.

Node.js delegates suitable I/O work to the operating system or libuv's mechanisms while the main JavaScript thread continues executing other code.

Once the asynchronous operation completes, its callback or Promise continuation becomes eligible to run, and the event loop allows it to execute when the JavaScript call stack is available.

### In simple terms

* JavaScript code executes on the main thread.
* Asynchronous I/O does not make the JavaScript thread wait.
* The OS or libuv handles the underlying operation.
* The event loop coordinates completed asynchronous work.
* Callbacks or Promise continuations execute on the JavaScript thread.

### Concurrency vs. Parallelism

Node.js can achieve high concurrency without executing multiple JavaScript operations simultaneously on multiple JavaScript threads.

Concurrency means multiple operations can make progress during overlapping periods.

Parallelism means multiple computations actually execute simultaneously.

---

## 4. Event Loop

The event loop is a fundamental part of Node.js's asynchronous programming model.

It allows Node.js to continue executing JavaScript while asynchronous operations are being processed.

### Example Flow

1. The main JavaScript program starts.
2. An asynchronous operation is initiated.
3. Node.js does not wait synchronously for the operation.
4. JavaScript continues executing other statements.
5. The asynchronous operation eventually completes.
6. Its callback or Promise continuation becomes eligible for execution.
7. The event loop allows it to execute when the call stack is available.

### Event Loop Experiment

We created an experiment using `fs.readFile()` and `setTimeout()`:

```js
const fs = require("fs");

console.log("1. Program started");

fs.readFile("./data/message.txt", "utf8", (err, data) => {
    console.log("2. File callback");
});

setTimeout(() => {
    console.log("3. Timeout callback");
}, 0);

console.log("4. Program ended");
```

Observed output:

```text
1. Program started
4. Program ended
3. Timeout callback
2. File callback
```

### Finding

Synchronous statements execute first.

Also, `setTimeout(..., 0)` does not mean that the callback executes immediately. It becomes eligible after the timer conditions are satisfied.

The exact order of independent asynchronous callbacks can depend on when the underlying operations become ready and how the event loop schedules them.

---

## 5. Blocking vs. Non-blocking Operations

| Blocking                                               | Non-blocking                                         |
| ------------------------------------------------------ | ---------------------------------------------------- |
| Execution waits for the operation to complete          | Execution continues while the operation is processed |
| Usually associated with synchronous APIs               | Usually associated with asynchronous APIs            |
| Can block the main JavaScript thread during I/O        | Allows the main JavaScript thread to continue        |
| Example: `readFileSync()`                              | Example: `readFile()`                                |
| Suitable for some startup scripts and simple CLI tools | Particularly useful for server-side I/O              |

### Blocking Example

```js
const fs = require("fs");

console.log("Start");

const data = fs.readFileSync("./data/message.txt", "utf8");

console.log("File content:", data);

console.log("End");
```

Observed output:

```text
Start
File content: Hello from Node.js asynchronous I/O
End
```

The program waits for `readFileSync()` to finish before executing the next statement.

---

## 6. Non-blocking File Reading with Callbacks

We practiced asynchronous file reading using `fs.readFile()`.

```js
const fs = require("fs");

console.log("1. Program started");

fs.readFile("./data/message.txt", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    console.log("2. File content:", data);
});

console.log("3. Program finished");
```

Observed output:

```text
1. Program started
3. Program finished
2. File content: Hello from Node.js asynchronous I/O
```

### Finding

The output demonstrates that `fs.readFile()` does not synchronously block the JavaScript execution while the file is being read.

---

## 7. Multiple Asynchronous Operations

We also tested multiple asynchronous file reads:

```js
const fs = require("fs");

console.log("Start");

fs.readFile("./data/message.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("File 1 Finished");
});

fs.readFile("./data/message.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("File 2 Finished");
});

console.log("End");
```

Observed output:

```text
Start
End
File 1 Finished
File 2 Finished
```

### Finding

Both asynchronous operations were started before either callback executed.

This demonstrates how Node.js can allow multiple I/O operations to be in progress without blocking the main JavaScript execution.

The completion order of independent asynchronous operations should not generally be assumed.

---

## 8. Asynchronous File Operations Using Promises

Node.js also provides a Promise-based file system API through `fs.promises`.

### Promise-based Reading

```js
const fs = require("fs").promises;

fs.readFile("./data/message.txt", "utf8")
    .then((data) => {
        console.log("File content:", data);
    })
    .catch((err) => {
        console.error("Error reading file:", err);
    });

console.log("Program Finished");
```

The Promise-based API allows asynchronous operations to be handled with `.then()` and `.catch()`.

---

## 9. Asynchronous File Operations with async/await

We practiced the modern `async/await` approach.

```js
const fs = require("fs").promises;

async function readfile() {
    try {
        const data = await fs.readFile("./data/message.txt", "utf8");

        console.log("File content:", data);
    } catch (error) {
        console.error("Error reading file:", error);
    }
}

console.log("1. Program started");

readfile();

console.log("2. Program ended");
```

Observed output:

```text
1. Program started
2. Program ended
File content: Hello from Node.js asynchronous I/O
```

### Important Finding

`await` does not block the entire Node.js process.

It pauses the execution of the particular asynchronous function until its Promise settles, while Node.js remains able to continue other work.

---

## 10. Asynchronous File Writing with async/await

We practiced writing and then reading a file asynchronously.

```js
const fs = require("fs").promises;

async function writefile() {
    try {
        await fs.writeFile(
            "./data/output.txt",
            "This file was created using asynchronous Node.js file writing."
        );

        console.log("File written successfully");

        const data = await fs.readFile("./data/output.txt", "utf-8");

        console.log("File content:", data);
    } catch (error) {
        console.error("File operation failed:", error);
    }
}

console.log("Start");

writefile();

console.log("End");
```

Observed output:

```text
Start
End
File written successfully
File content: This file was created using asynchronous Node.js file writing.
```

### Finding

The `writeFile()` and `readFile()` operations are asynchronous, while `await` makes the dependent sequence easier to understand.

---

## 11. Asynchronous File Writing with Callbacks

We also practiced the traditional callback-based approach.

```js
const fs = require("fs");

function writeFile() {
    fs.writeFile(
        "./data/callback-output.txt",
        "Hello From callback style.",
        (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }

            console.log("File written successfully");

            fs.readFile(
                "./data/callback-output.txt",
                "utf-8",
                (err, data) => {
                    if (err) {
                        console.error("Error reading file:", err);
                        return;
                    }

                    console.log("File content:", data);
                }
            );
        }
    );
}

console.log("Start");

writeFile();

console.log("End");
```

Observed behavior:

```text
Start
End
File written successfully
File content: Hello From callback style.
```

### Finding

The read operation was placed inside the write callback because the file must first be created/written before reading its new contents.

This also demonstrated nested callbacks.

---

## 12. Promise Chaining

We practiced the same write → read operation using Promises.

The basic flow was:

```text
writeFile()
    ↓
.then()
    ↓
readFile()
    ↓
.then()
    ↓
.catch()
```

Example:

```js
const fsPromises = require("fs").promises;

fsPromises
    .writeFile(
        "./data/promise-output.txt",
        "Hello From Promise style."
    )
    .then(() => {
        console.log("File written successfully");

        return fsPromises.readFile(
            "./data/promise-output.txt",
            "utf-8"
        );
    })
    .then((data) => {
        console.log("File content:", data);
    })
    .catch((err) => {
        console.error("Error:", err);
    });

console.log("Start");
console.log("End");
```

Observed output:

```text
Start
End
File written successfully
File content: Hello From Promise style.
```

### Finding

Promises allow dependent asynchronous operations to be chained without deeply nesting callbacks.

---

## 13. Callback Hell

When many asynchronous operations depend on one another, callback-based code can become deeply nested.

Conceptually:

```text
writeFile()
    ↓ callback
    readFile()
        ↓ callback
        anotherOperation()
            ↓ callback
            anotherOperation()
```

This pattern is commonly referred to as **callback hell** when the nesting becomes difficult to read and maintain.

Promises reduce this nesting through chaining:

```text
writeFile()
    ↓
.then()
    ↓
readFile()
    ↓
.then()
    ↓
another operation
    ↓
.catch()
```

`async/await` provides another readable approach:

```text
await writeFile()
await readFile()
```

The underlying I/O remains asynchronous.

---

## 14. Three Styles of Asynchronous File Operations

Node.js applications can encounter three common styles.

### Callback Style

```js
fs.readFile("file.txt", "utf8", (err, data) => {
    // handle result
});
```

### Promise Style

```js
fsPromises
    .readFile("file.txt", "utf8")
    .then((data) => {
        // handle result
    })
    .catch((err) => {
        // handle error
    });
```

### async/await Style

```js
try {
    const data = await fsPromises.readFile("file.txt", "utf8");
} catch (err) {
    // handle error
}
```

### Comparison

| Style             | Main characteristic                                     |
| ----------------- | ------------------------------------------------------- |
| Callback          | Traditional Node.js pattern using error-first callbacks |
| Promise           | Uses `.then()` and `.catch()`                           |
| async/await       | Uses Promises with a more readable syntax               |
| Modern preference | async/await is commonly preferred for readability       |

---

# Express.js Basics

## 15. What is Express.js?

Express.js is a lightweight web framework for Node.js.

Node.js provides the runtime and networking capabilities, while Express provides convenient abstractions for building web servers and APIs.

Express is commonly used for:

* HTTP servers
* REST APIs
* Routing
* Middleware
* Request handling
* Response handling

### Simplified Relationship

```text
Node.js
   ↓
JavaScript Runtime
   ↓
Express.js
   ↓
Web Server / REST API
```

---

## 16. Express Installation and Setup

We initialized the W3D4 folder as a Node.js project using:

```bash
npm init -y
```

This created a `package.json` file.

Then Express was installed using:

```bash
npm install express
```

The installed version during this session was:

```text
express@5.2.1
```

We verified the installation using:

```bash
npm list express
```

---

## 17. First Express Server

We created a basic Express server:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Express!");
});

app.listen(3000, () => {
    console.log("Express server running on port 3000");
});
```

The server was started using:

```bash
node server.js
```

Observed terminal output:

```text
Express server running on port 3000
```

The server was then accessed through:

```text
http://localhost:3000
```

The browser returned:

```text
Hello from Express!
```

---

## 18. Express Routing

We added an `/about` route:

```js
app.get("/about", (req, res) => {
    res.send("This is the About page.");
});
```

The application therefore supported:

```text
GET /
    ↓
Hello from Express!

GET /about
    ↓
This is the About page.
```

### Request and Response

In:

```js
app.get("/", (req, res) => {
    res.send("Hello from Express!");
});
```

* `req` represents the incoming HTTP request.
* `res` represents the HTTP response.
* `res.send()` sends a response to the client.
* `app.get()` defines behavior for an HTTP GET request.

---

## 19. Express + Asynchronous File Reading

We combined Express with the asynchronous `fs.promises` API.

Example:

```js
const express = require("express");
const fs = require("fs").promises;

const app = express();

app.get("/message", async (req, res) => {
    try {
        const data = await fs.readFile(
            "./data/message.txt",
            "utf-8"
        );

        res.send(data);
    } catch (error) {
        console.error("Error reading file:", error);
        res.status(500).send("Error reading message file");
    }
});

app.listen(3000, () => {
    console.log("Express server running on port 3000");
});
```

When the browser requested:

```text
GET /message
```

Express asynchronously read:

```text
./data/message.txt
```

and returned the file contents as the HTTP response.

### Flow

```text
Browser
   ↓
GET /message
   ↓
Express Route
   ↓
fs.promises.readFile()
   ↓
File System
   ↓
File Content
   ↓
res.send()
   ↓
Browser
```

This demonstrated how Node.js asynchronous I/O can be directly used inside an Express server.

---

## 20. Express + Callback-based File Reading

We also demonstrated file reading using the callback API inside Express.

```js
app.get("/message-callback", (req, res) => {
    fs.readFile("./data/message.txt", "utf-8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading message file");
        }

        res.send(data);
    });
});
```

This route demonstrated the traditional Node.js callback style in an HTTP request handler.

---

## 21. When Node.js is a Good Fit

Node.js is particularly suitable for applications with many I/O operations and concurrent connections.

Examples include:

* REST APIs
* Real-time applications
* Chat applications
* Streaming services
* Web servers
* Applications making many network requests
* Backend services communicating with databases

The key characteristic is that much of the work involves waiting for external resources such as networks, databases, or files.

---

## 22. When Node.js Requires Extra Consideration

CPU-heavy operations can block the main JavaScript thread if they are performed directly.

Examples include:

* Complex mathematical computation
* Heavy image processing
* Large video-processing workloads
* CPU-intensive data processing

For such workloads, applications may use approaches such as:

* Worker threads
* Separate services
* Background processing systems
* Specialized runtimes or services

The important principle is to avoid long-running CPU-bound work blocking the main JavaScript execution thread.

---

## 23. Practical Files Created

During the session, the following practical files were created:

```text
W3D4_06_01/
│
├── data/
│   ├── message.txt
│   ├── output.txt
│   ├── callback-output.txt
│   └── promise-output.txt
│
├── sync-demo.js
├── async-demo.js
├── async-multiple.js
├── async-promises.js
├── async-await.js
├── async-write.js
├── async-write-callback.js
├── async-promise-chain.js
├── event-loop-demo.js
├── server.js
├── node.js.md
├── task
├── package.json
├── package-lock.json
└── learning-log.md
```

---

## 24. Commands Practiced

### Node.js

```bash
node --version
npm --version
node filename.js
```

### npm

```bash
npm init -y
npm install express
npm list express
```

### File and folder operations

```bash
mkdir -p data
ls
pwd
cat data/message.txt
```

### Server

```bash
node server.js
```

The Express server was tested on:

```text
http://localhost:3000
```

---

## 25. Common Mistakes Identified

### Mixing callbacks with Promises

A Promise-based API should not be given a callback in the same way as `fs.readFile()`.

Use either:

```js
fs.readFile(..., callback);
```

or:

```js
await fsPromises.readFile(...);
```

### Incorrect `fs.promises` usage

The correct pattern is:

```js
const fs = require("fs").promises;
```

or:

```js
const fsPromises = require("fs").promises;
```

### Incorrect assumption about `await`

`await` does not stop the entire Node.js application. It pauses the current async function while the Promise is pending.

### Incorrect file paths

The file path used for writing and reading must point to the same intended location.

### Assuming `setTimeout(..., 0)` is immediate

A zero-millisecond timer does not execute immediately. Its callback becomes eligible after the relevant event-loop conditions are met.

### Assuming asynchronous operations always finish in start order

Independent asynchronous operations may complete in different orders depending on when they become ready.

---

## 26. Key Takeaways

* Node.js is a JavaScript runtime built around the V8 engine.
* JavaScript execution occurs on a main thread.
* Node.js achieves high concurrency through asynchronous I/O and the event loop.
* libuv provides important asynchronous infrastructure.
* Blocking operations prevent the main JavaScript execution from continuing.
* Non-blocking operations allow JavaScript to continue while I/O is being handled.
* `fs.readFileSync()` is synchronous and blocking.
* `fs.readFile()` provides callback-based asynchronous file operations.
* `fs.promises` provides Promise-based asynchronous file operations.
* `async/await` provides a readable way to work with Promises.
* Callback nesting can become difficult to maintain as operations increase.
* Promise chaining reduces callback nesting.
* Express.js simplifies building Node.js web servers and APIs.
* Express routes map HTTP requests to application logic.
* Node.js and Express can perform asynchronous file operations inside request handlers.
* Node.js is particularly useful for I/O-heavy and highly concurrent applications.
* CPU-heavy work needs special consideration because it can block the main JavaScript thread.

---

## 27. Final Reflection

This session helped me understand Node.js beyond simply writing JavaScript programs.

The most important concept I learned is that Node.js is not "multi-threaded JavaScript." JavaScript execution happens on a main thread, while asynchronous I/O is coordinated through Node.js APIs, libuv, and the operating system or worker mechanisms. The event loop then coordinates callbacks and Promise continuations so that JavaScript can continue processing work without synchronously waiting for every I/O operation.

I also practiced the three major asynchronous programming styles:

```text
Callbacks
    ↓
Promises
    ↓
async/await
```

I then connected these concepts to Express.js by creating an actual web server, defining routes, and reading a file asynchronously in response to an HTTP request.

This gave me a practical understanding of how Node.js asynchronous I/O concepts are used in real backend applications and APIs.
