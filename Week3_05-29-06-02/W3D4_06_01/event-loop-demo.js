const fs = require('fs');

console.log('1. Program started');

fs.readFile("./data/message.txt", "utf-8", (err, data) =>{
    console.log('2. File callback');
});

setTimeout(() => {
    console.log('3. Timeout callback');
}, 0);

console.log('4. Program ended');