const fs = require('fs').promises;


async function readfile(){
    try {
   const data =  await fs.readFile("./data/message.txt", "utf8");
       
            console.log("File content : ", data);
        } catch (error) {
            console.error('Error reading file:', error);
        }
}

console.log("1. Program started");
readfile();
console.log("2. Program ended");