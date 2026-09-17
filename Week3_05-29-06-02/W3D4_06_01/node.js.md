# Node.js 
Node.js runs JavaScript code on a single main thread.That means it has one main call stack where JavaScript instructions execute.But this does not mean Node.js can handle only one task at a time.

Node.js is not simply "JS running in a browser".
it provides a runtime environment that allows JS to intract with things such as files, network, OS, timer, processes, DB, dervers.

# Event Loop
The event loop continuously checks whether asynchronous operations have completed and whether their callbacks are ready to execute.The file operation is asynchronous, so JavaScript doesn't sit idle waiting for the disk.

# Where does libuv fit?
Node.js uses libuv to provide its asynchronous, event-driven behavior.
For operations such as file-system work, libuv can use the thread pool to perform work without blocking the main JavaScript thread.

# Blocking VS Non-blocking
| Blocking                                       | Non-blocking                               |
| ---------------------------------------------- | ------------------------------------------ |
| Waits for operation to finish                  | Starts operation and continues             |
| Can stop JavaScript execution from progressing | Allows other work to continue              |
| Synchronous APIs commonly behave this way      | Asynchronous APIs commonly behave this way |
| Can reduce responsiveness under heavy I/O      | Well suited to I/O-heavy applications      |


Node's filesystem API demonstrates this directly.
* Blocking :
const fs = require("fs");
const data = fs.readFileSync("input.txt", "utf8");
console.log(data);
console.log("Finished");

readFileSync() makes the JavaScript execution wait until the file has been read.

* Non-blocking : 
const fs = require("fs");
fs.readFile("input.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
console.log("Finished");

Here Node.js starts the operation and continues executing other JavaScript.The operation is asynchronous.

### Node.js is single-threaded for JavaScript execution, but it achieves concurrency by delegating asynchronous I/O work and using the event loop to process completed operations without blocking the main JavaScript thread.