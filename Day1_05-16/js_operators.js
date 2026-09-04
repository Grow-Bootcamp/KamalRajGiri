console.log("\n\nJS Operators\n\n");

console.log("JS Arithmetic Operators\n\n");
let a = 10; //js assignment operator
let b=5;
console.log("sum of a and b is: " + (a+b)); // js addition operator
console.log("subtraction of a and b is: " + (a-b)); // js subtraction operator
console.log("multiplication of a and b is: " + (a*b)); // js multiplication operator
console.log("division of a and b is: " + (a/b)); // js division operator
console.log("modulus of a and b is: " + (a%b)); // js modulus operator
console.log("increment of a is: " + (++a)); // js increment operator
console.log("decrement of a is: " + (--a)); // js decrement operator    
console.log("exponentiation of a and b is: " + (ab)); // js exponentiation operator
let text1 = "Hello";
let text2 = "World";
console.log("concatenation of text1 and text2 is: " + (text1 + " " + text2)); // js concatenation operator
let x;
console.log("\n\nJS Assignment Operators\n\n");
x += 5; // x = x + 5
x -= 5; // x = x - 5
x *= 5; // x = x * 5
x /= 5; // x = x / 5


console.log("\n\nJS Comparison Operators\n\n");
console.log("a == b is: " + (a == b)); // js equality operator
console.log("a != b is: " + (a != b)); // js inequality operator
console.log("a === b is: " + (a === b)); // js strict equality operator
console.log("a !== b is: " + (a !== b)); // js strict inequality operator   
console.log("a > b is: " + (a > b)); // js greater than operator
console.log("a < b is: " + (a < b)); // js less than operator
console.log("a >= b is: " + (a >= b));  // js greater than or equal to operator
console.log("a <= b is: " + (a <= b));  // js less than or equal to operator
console.log(a < "Hari" ); 

console.log(" \n These comparision operators are used to compare two values and return a boolean value (true or false) based on the comparison. \n\n");

console.log("\n\nJS Logical Operators\n\n");
let x1 = true;
let y1 = false;
console.log("x1 && y1 is: " + (x1 && y1)); // js logical AND operator
console.log("x1 || y1 is: " + (x1 || y1)); // js logical OR operator
console.log("!x1 is: " + (!x1)); // js logical NOT operator


console.log("\n\nJS Conditional (Ternary) Operator\n\n");
let age = 18;
let canVote = (age >= 18) ? "Yes" : "No";
console.log("Can the person vote? " + canVote); // js conditional (ternary) operator

let age1 =23;
if (age1 <18) {
  console.log("The person with age " + age1 + " is a minor.");
} else if (age1 >= 18 && age1 < 65) {
  console.log("The person with age " + age1 + " is an adult.");
} else {
  console.log("The person with age " + age1 + " is a senior citizen.");
}

