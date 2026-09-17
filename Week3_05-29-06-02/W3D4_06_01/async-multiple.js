const fs = require('fs');

console.log('Start');

fs.readFile("./data/message.txt", "utf8", (err, data) => { 
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log("File 1 FInished");
});

fs.readFile("./data/message.txt", "utf8", (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log("File 2 FInished");
});

console.log("End")