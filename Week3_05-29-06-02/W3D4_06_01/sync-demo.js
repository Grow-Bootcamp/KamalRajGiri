const fs = require("fs");

console.log("1. Program started");

const data = fs.readFileSync("./data/message.txt", "utf8"); // Synchronous read : blocks the execution until the file is read
console.log("2. File content:", data);

console.log("3. Program finished");