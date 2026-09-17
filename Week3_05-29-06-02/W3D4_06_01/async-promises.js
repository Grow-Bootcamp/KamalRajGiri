const fs = require('fs').promises;

console.log("1. Program Started");

fs.readFile("./data/message.txt", "utf8").then((data) => {
    console.log("File 1 Finished : ", data);
}).catch((err) => {
    console.error('Error reading file:', err);
});

console.log("3. Program Finished")