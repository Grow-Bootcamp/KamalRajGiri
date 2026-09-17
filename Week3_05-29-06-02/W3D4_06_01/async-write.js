const fs = require('fs').promises;

async function writefile (){
    try{
        await fs.writeFile('./data/output.txt', 'This file was created using asynchronous Node.js file writing.');
         console.log('File written successfully');
       const data = await fs.readFile("./data/output.txt", "utf-8");
       console.log('File content : ', data);
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

console.log("Start");
writefile();
console.log("End");

