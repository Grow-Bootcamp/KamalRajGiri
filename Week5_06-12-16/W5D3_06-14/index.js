// console.log("Starting the application...");

// console.log("Operation A");

// try{
//     throw new Error("An error occurred in Operation A");
//     console.log("Operation B");
// } catch(error ){
//     console.log("Error handled: " + error.message);
//     console.log("Operation C");
// }finally {
//     console.log("Application finished executing.");
// }

// console.log("Operation D");


console.log("Starting the application...");

console.log("Operation A");

try{
    throw new Error("An error occurred in Operation A");
    console.log("Operation B");
} 
catch(error ){
    console.log("Error handled: " + error.message);
    console.log("Operation C");
}finally {
    console.log("Cleanup operations completed.");
}

console.log("Operation D");