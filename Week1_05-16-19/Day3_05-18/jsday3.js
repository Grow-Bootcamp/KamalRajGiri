
//Js Hoisting
console.log(name); // undefined
console.log(greet); // function
console.log(add(2, 3)); // 5

console.log(greet());
var name = "Ram";
var age = 25;
console.log(greet());

function greet() {
    console.log("Hello " + name);
}

function add(a, b) {
  return a + b;
}


//Lexical Scope
function outer() {
  const outerVar = "I am outer";
  
  function inner() {
    const innerVar = "I am inner";
    console.log(outerVar); // Accessible (lexical scope)
    console.log(innerVar);
  }
  inner();
  // console.log(innerVar); // ReferenceError
}
outer();


// Closure 
function makeCounter() {
  let count = 0; // Private variable

  return function () {
    count++;

    return count;
  };
}

const counter = makeCounter();
//since makeCounter returns a function, we have to call it as a function like below counter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
// count is not accessible from outside
// console.log(count); // ReferenceError

