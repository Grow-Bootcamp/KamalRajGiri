const fsPromises = require('fs').promises;

async function writefile() {
    try {
        await fsPromises.writeFile('./data/promise-output.txt', 'Hello From Promise style.');
        console.log('File written successfully');
        const data = await fsPromises.readFile("./data/promise-output.txt", "utf-8");
        console.log('File content : ', data);
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

console.log("Start");
writefile();
console.log("End"); 