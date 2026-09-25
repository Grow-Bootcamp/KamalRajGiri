const fs = require("fs");

console.log("1. Program started");


fs.readFile("./data/message.txt", "utf8", (err, data) => { // Asynchronous read : does not block the execution, instead it takes a callback function that will be called when the file is read
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("2. File content:", data);
});


console.log("3. Program finished");