console.log("Loops in JavaScript:");

// For loop example: 
//for loops are used to execute a block of code a specific number of times. The loop continues until the specified condition evaluates to false.

//for : Use when you generally know how many times you want to iterate.
for (let i = 0; i < 5; i++) {
    console.log("For loop iteration: " + i);
} 
// While loop example:
//while loops are used to execute a block of code as long as the specified condition evaluates to true.

//while : Use when repetition depends on a condition and the number of iterations isn't necessarily known beforehand.
let j = 0;
while (j < 5) {
    console.log("While loop iteration: " + j);
    j++;
}

// Do while loop example:
//do while loops are similar to while loops, but the block of code is executed at least once before the condition is checked.

//do...while : Use when the operation must happen at least once.
let k = 0;
do {
    console.log("Do while loop iteration: " + k);
    k++;
} while (k < 5);


// break and continue statements are used to control the flow of loops. The break statement is used to exit a loop prematurely, while the continue statement is used to skip the current iteration and move on to the next one.

console.log("Using break statement in a for loop:");
for (let i = 0; i < 5; i++) {
    
    if (i === 3) {
        break; // Exit the loop when i is 3
    }
    console.log("For loop iteration: " + i);
}

console.log("Using continue statement in a for loop:");

for (let i = 0; i < 5; i++) {
    if (i === 3) {
        continue; // Skip the iteration when i is 3
    }
    console.log("For loop iteration: " + i);
}


// Nested loops are loops inside other loops. They are often used for iterating over multi-dimensional data structures, such as arrays of arrays.
console.log("Nested loops example:");

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        console.log("Nested loop iteration: " + i + ", " + j);
    }
}

