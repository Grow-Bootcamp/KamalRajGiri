const fs = require('fs');

function writeFile() {
    fs.writeFile('./data/callback-output.txt', 'Hello From callback style .', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File written successfully');
        fs.readFile("./data/callback-output.txt", "utf-8", (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            console.log('File content : ', data);
        });
    });
}

console.log("Start");
writeFile();
console.log("End");