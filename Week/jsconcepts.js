console.log(0 === false); // false
console.log(0 == false); // true
console.log(null === undefined); // false
console.log(null == undefined); // true

const button = document.querySelector('#login');
const userInput = "5";
if (userInput === 5){
    console.log("Matched");
}
if ("") {
  console.log("A");
}

if ("hello") {
  console.log("B");
}

if ([]) {
  console.log("C");
}

if (0) {
  console.log("D");
}

const button1 = document.querySelector(".button");

if (button1.disabled) {
  console.log("Button is disabled");
}

// array.slice(start, end);
const fruits = ["apple", "banana", "mango", "orange"];
const result = fruits.slice(1, 3);
console.log(result);
// ["banana", "mango"]
console.log(fruits);
// ["apple", "banana", "mango", "orange"]

// Negative indexes count from the end


// array.splice(start, deleteCount, item1, item2, ...);