# Technical Learning Report: Day 3

**Date:** 3rd September 2026
**Intern Name:** Kamal Raj Giri
**Subject:** JavaScript Functions, Objects & Arrays

---

## 1. Objective

The primary objective of Day 3 was to develop proficiency in JavaScript function definitions and usage — covering function declarations, function expressions, arrow functions, anonymous functions, and Immediately Invoked Function Expressions (IIFEs) — and to become comfortable working with objects and arrays, including their common methods and properties. Additional topics included scope, hoisting, closures, callbacks, and higher-order functions. These concepts were then applied through a practical Mini Book Collection exercise, with all key learnings, findings, and code examples captured in a dedicated learning log.

## 2. Technical Breakdown

### A. Function Declaration

A function declaration defines a named function that is hoisted to the top of its scope. This means it can be called before its position in the source code, which distinguishes it from function expressions.

```javascript
function greet() {
    console.log("Namaste");
}
greet();

function add(a, b) {
    let sum = a + b;
    return sum;
}
console.log(add(3, 5)); // 8
```

Function declarations are ideal for defining reusable utilities that need to be available throughout a scope regardless of where they appear in the code.

### B. Function Expression

A function expression stores a function in a variable. The function can be named or anonymous, but the variable must be initialized before it is called — the function is not hoisted like a declaration.

```javascript
const greeting = function (name) {
    console.log("Hello " + name);
};
greeting("Kamal");
```

Function expressions are useful when you want to assign a function to a variable, pass it as an argument, or define it conditionally at runtime.

### C. Arrow Function

Arrow functions provide shorter syntax and do not create their own `this`; they inherit `this` from the surrounding lexical scope. This makes them different from regular functions when used as object methods.

```javascript
const sum = (a, b) => {
    return a + b;
};
console.log(sum(3, 6)); // 9

const getUser = () => ({
    name: "Kamal",
    program: "BCE"
});
console.log(getUser());
```

When an arrow function returns an object literal directly, the object needs parentheses so JavaScript does not interpret the braces as a function body. Arrow functions are concise and ideal for callbacks, but their lexical `this` makes them unsuitable for object methods that need their own `this` context.

### D. Anonymous Function and Callback

An anonymous function has no name. It is commonly passed as a callback to another function such as `forEach`, `map`, `filter`, or `setTimeout`.

```javascript
function processUser(callback) {
    callback("Kamal");
}

processUser(function (name) {
    console.log("Hello " + name);
});

setTimeout(function () {
    console.log("Hello after 2 seconds");
}, 2000);
```

Calling `greet` executes the function; logging `greet` alone logs the function itself. This distinction is important when passing functions as callbacks versus invoking them.

### E. IIFE (Immediately Invoked Function Expression)

An IIFE is a function expression that is created and executed immediately. It can create a private scope and can also receive arguments or return a value.

```javascript
const result = (function () {
    return 10 + 20;
})();
console.log(result); // 30

(function (name) {
    console.log("Hello " + name);
})("Kamal");
```

IIFEs were commonly used to create a private scope to avoid polluting the global namespace.

### F. Hoisting, Lexical Scope, and Closures

**Hoisting:** Function declarations can be called before their declaration. Variables declared with `var` are hoisted with an initial value of `undefined`, while `let` and `const` are not usable before initialization.

```javascript
console.log(name); // undefined
console.log(greet); // function reference
console.log(add(2, 3)); // 5

var name = "Ram";
function greet() {
    console.log("Hello " + name);
}
function add(a, b) {
    return a + b;
}
```

**Lexical Scope:** An inner function can access variables from its outer function, but the outer function cannot access variables declared only inside the inner function.

```javascript
function outer() {
    const outerVar = "I am outer";
    function inner() {
        const innerVar = "I am inner";
        console.log(outerVar); // Accessible
        console.log(innerVar);
    }
    inner();
    // console.log(innerVar); // ReferenceError
}
outer();
```

**Closure:** A returned inner function remembers variables from the scope where it was created. The `count` variable is private to the closure and cannot be accessed directly from outside `makeCounter`.

```javascript
function makeCounter() {
    let count = 0;
    return function () {
        count++;
        return count;
    };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### G. `this` in Regular Functions vs Arrow Functions

Regular functions have their own `this` depending on how they are called. Arrow functions do not have their own `this`; they inherit `this` from the surrounding lexical scope.

```javascript
const user = {
    name: "Kamal",
    greet: function () {
        console.log(this.name); // "Kamal"
    }
};
user.greet();

const user1 = {
    name: "Kamal",
    greet: () => {
        console.log(this.name); // undefined (inherits global this)
    }
};
user1.greet();
```

This is a critical distinction: when `greet` is a regular function called as `user.greet()`, `this` refers to `user`. When `greet` is an arrow function, it inherits `this` from the enclosing scope (typically the global or module scope), not from the calling object.

### H. Object Properties and Methods

Objects store data as key-value pairs. Both dot notation and bracket notation can be used for access, with bracket notation required for keys containing hyphens or special characters.

```javascript
const user = {
    name: "Kamal",
    Program: "BCT",
    id: 12,
    isStudent: true,
    Marks: [90, 99, 98, 96, 94],
    address: {
        city: "Mnr",
        Provence: 7
    },
    greet: function () {
        console.log("Namastee");
    }
};

console.log(user.name);          // dot notation
console.log(user["name"]);       // bracket notation
user["Tmp-city"] = "DHN";       // bracket notation for hyphenated keys
console.log(user.address.city);  // nested object access
```

Objects are mutable — properties can be added, updated, or deleted. However, objects cannot be reassigned with `const`.

### I. Object Methods and Properties

The following methods were practiced for inspecting, copying, combining, and protecting objects:

| Method or Property | Description |
|---|---|
| `Object.keys(object)` | Returns an array of an object's property names |
| `Object.values(object)` | Returns an array of an object's values |
| `Object.entries(object)` | Converts an object into an array of key-value pairs |
| `Object.fromEntries(entries)` | Builds an object from key-value pairs |
| `Object.assign(target, source)` | Copies properties from source(s) into a target object |
| `Object.hasOwn(object, key)` | Checks whether a property belongs directly to an object |
| `Object.freeze(object)` | Prevents changes, additions, and removals (immutable) |
| `Object.seal(object)` | Prevents additions and removals while allowing value changes |

```javascript
const user = {
    name: "Kamal",
    age: 20,
    city: "Kanchanpur"
};

console.log(Object.keys(user));     // ["name", "age", "city"]
console.log(Object.values(user));   // ["Kamal", 20, "Kanchanpur"]
console.log(Object.entries(user));  // [["name","Kamal"],["age",20],["city","Kanchanpur"]]
console.log(Object.hasOwn(user, "name")); // true

const combined = Object.assign({}, user, { role: "student" });
console.log(combined); // { name: "Kamal", age: 20, city: "Kanchanpur", role: "student" }
```

**Spread Operator as Alternative to `Object.assign`:**

```javascript
const usera = { name: "Aagyat", age: 23 };
const userb = { city: "MNR" };
const copy1 = { ...usera, ...userb };
console.log(copy1); // { name: "Aagyat", age: 23, city: "MNR" }
```

**Object Destructuring:**

```javascript
const userx = { name: "Kamal", age: 20, city: "Kanchanpur" };
const { name, age, city } = userx;
console.log(name, age, city);

// Renaming during destructuring
const { name: userName, age: userAge } = userx;
console.log(userName, userAge);

// Default values
const usery = { name: "Kamal", age: 20 };
const { name: n1, city: c1 = "Unknown" } = usery;
console.log(n1, c1); // "Kamal" "Unknown"
```

**Object Reference Behaviour:**

```javascript
const user1 = { name: "Kamal", age: 20 };
const user2 = user1;         // user2 references the same object
user2.name = "Alice";
console.log(user1.name);     // "Alice" — shared reference
console.log(user2.name);     // "Alice"
```

Assigning one object to another copies the reference, not the data. Two separately created objects with identical contents are not equal with `===` because they occupy different memory references:

```javascript
const a = { x: 10 };
const b = { x: 10 };
console.log(a === b);  // false — different references
const c = a;
console.log(a === c);  // true — same reference
```

**Object.freeze vs Object.seal:**

```javascript
const user3 = { name: "Kamal", age: 20 };
Object.freeze(user3);
user3.name = "Alice";   // No effect — object is frozen
console.log(user3.name); // "Kamal"

const user4 = { name: "Kamal", age: 20 };
Object.seal(user4);
user4.name = "Alice";   // Value changes — allowed
user4.city = "MNR";     // New property — not allowed
console.log(user4.city); // undefined
```

### J. Array Basics and Mutating Methods

Arrays are ordered, zero-indexed collections that can hold any data type. They are created using square brackets and can be manipulated with a variety of built-in methods.

```javascript
const myArray = [1, 2, 3, 4, 5];
console.log(myArray[0]);          // 1
console.log(myArray.length - 1);  // 4

myArray[0] = 10;   // Update: [10, 2, 3, 4, 5]
myArray.push(6);    // Add to end: [10, 2, 3, 4, 5, 6]
myArray.pop();      // Remove from end: [10, 2, 3, 4, 5]
myArray.unshift(0); // Add to beginning: [0, 10, 2, 3, 4, 5]
myArray.shift();    // Remove from beginning: [10, 2, 3, 4, 5]
```

**`slice` (immutable) vs `splice` (mutable):**

```javascript
const arr = [10, 20, 30, 40];

// slice — does not change the original array
console.log(arr.slice(1, 2)); // [20]
console.log(arr);              // [10, 20, 30, 40]

// splice — mutates the original array
const removed = arr.splice(1, 2);
console.log(arr);      // [10, 40]
console.log(removed);  // [20, 30]

// Adding elements with splice
const arr2 = [10, 20, 30, 40];
arr2.splice(1, 0, 15, 25);
console.log(arr2); // [10, 15, 25, 20, 30, 40]

// Replacing elements with splice
arr2.splice(1, 1, 100, 200);
console.log(arr2); // [10, 100, 200, 25, 20, 30, 40]
```

**`forEach`:**

```javascript
const fruits = ["apple", "banana", "orange"];
fruits.forEach((fruit) => {
    console.log(fruit);
});
console.log(fruits.forEach((fruit) => console.log(fruit))); // undefined
```

`forEach` executes a function for each element but always returns `undefined`.

### K. Array Higher-Order Methods: `map`, `filter`, `reduce`, `find`, `some`, `every`

**`map` — creates a new array by applying a function to each element:**

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

**`filter` — creates a new array with elements that match a condition:**

```javascript
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log(evenNumbers); // [2, 4]
```

**`reduce` — reduces an array to a single accumulated value:**

```javascript
const total = [1, 2, 3, 4].reduce((sum, number) => {
    return sum + number;
}, 0);
console.log(total); // 10
```

**`find` and `findIndex`:**

```javascript
const found = [1, 2, 3, 4].find((num) => num > 2);
console.log(found); // 3

const foundIndex = [1, 2, 3, 4].findIndex((num) => num > 2);
console.log(foundIndex); // 2
```

**`some` and `every`:**

```javascript
console.log([1, 2, 3, 4].some((num) => num % 2 === 0));  // true
console.log([1, 2, 3, 4].every((num) => num % 2 === 0)); // false
```

**`indexOf`, `flat`, and `Array.isArray`:**

```javascript
console.log(["apple", "banana", "mango"].indexOf("banana")); // 1
console.log(Array.isArray([1, 2, 3]));                        // true
console.log(Array.isArray("not an array"));                   // false

const nestedArray = [1, 2, [3, 4], [5, 6]];
console.log(nestedArray.flat()); // [1, 2, 3, 4, 5, 6]
```

**Method Chaining:**

```javascript
const result = [1, 2, 3, 4, 5, 6]
    .filter(number => number % 2 === 0)
    .map(number => number * 2);
console.log(result); // [4, 8, 12]
```

**Array of Objects:**

```javascript
const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 }
];

const names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob", "Charlie"]

const adults = users.filter((user) => user.age >= 30);
console.log(adults); // [{ id: 2, name: "Bob", age: 30 }, { id: 3, name: "Charlie", age: 35 }]
```

The important distinction is that `map`, `filter`, `slice`, `find`, `findIndex`, `some`, `every`, and `reduce` leave the original array unchanged (immutable), while `push`, `pop`, `shift`, `unshift`, and `splice` mutate it.

### L. Callbacks and Higher-Order Functions

A callback function is a function passed to another function as an argument, so that the receiving function can call it later. A higher-order function is a function that takes one or more functions as arguments, or returns a function as its result.

```javascript
function greet(name) {
    console.log("Hello " + name);
}

function processUser(callback) {
    callback("Kamal");
}
processUser(greet);
```

```javascript
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }

function calculate(operation, x, y) {
    return operation(x, y);
}

console.log(calculate(add, 2, 3));      // 5
console.log(calculate(multiply, 2, 3)); // 6
```

**Data Transformation with `Object.entries` and `Object.fromEntries`:**

```javascript
const user = { name: "Kamal", age: 20, city: "Kanchanpur" };
const entries = Object.entries(user);
console.log(entries); // [["name","Kamal"],["age",20],["city","Kanchanpur"]]

const backuser = Object.fromEntries(entries);
console.log(backuser); // { name: "Kamal", age: 20, city: "Kanchanpur" }
```

## 3. Practical Implementation

During the session, these concepts were applied directly by building and testing seven standalone practice files, each isolating a specific topic so the underlying behaviour could be verified independently before being combined in the final exercise:

- **`jsFunctions.js`:** Practiced function declarations, function expressions, arrow functions (including returning objects), the difference between `greet` and `greet()`, anonymous functions with `setTimeout`, and IIFEs with arguments and return values.
- **`jsday3.js`:** Demonstrated hoisting with `var` and function declarations, lexical scope with nested functions, and closures with the `makeCounter` pattern.
- **`jsObject.html`:** Created objects with primitive, array, nested-object, and method properties; practiced dot and bracket notation including hyphenated keys; demonstrated mutation, deletion, and nested access.
- **`jsObjectKey.html`:** Practiced `Object.keys`, `Object.values`, `Object.entries`, `Object.fromEntries`, `Object.assign`, `Object.hasOwn`, `Object.freeze`, and `Object.seal`; demonstrated spread operator for copying, destructuring with renaming and default values, reference behaviour, and equality comparison.
- **`jsArrays.html`:** Practiced array creation, index access, `push`, `pop`, `unshift`, `shift`, `slice`, `splice` (removing, adding, replacing), and `forEach` including its `undefined` return value.
- **`jsArrayMFR.html`:** Practiced `map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `indexOf`, `Array.isArray`, `flat`, method chaining, and working with arrays of objects.
- **`jsCallbackDataTransformation&HigherOrderFunction.html`:** Practiced passing functions as callbacks, higher-order functions that accept functions as arguments, and data transformation with `Object.entries` and `Object.fromEntries`.
- **`practice.html`:** Combined all topics into a Mini Book Collection exercise that used an array of book objects to practice every function style (declaration, expression, arrow, anonymous, IIFE), object methods (`Object.keys`, `Object.values`, `Object.entries`, `Object.assign`, `Object.hasOwn`, `Object.fromEntries`), array methods (`map`, `filter`, `find`, `reduce`, `some`, `forEach`), spread operator, and higher-order functions.

**Output obtained:** Function declarations were correctly hoisted; closures preserved the private `count` variable across calls; arrow-function `this` inherited from the enclosing scope rather than the calling object; `Object.freeze` blocked all modifications while `Object.seal` allowed value changes but not additions; `slice` left the original array intact while `splice` mutated it; `map`, `filter`, and `reduce` produced the expected transformed arrays without altering the source; and the Mini Book Collection exercise demonstrated correct usage of all practiced methods without runtime errors.

## 4. Key Findings & Best Practices

- **Function Choice:** use function declarations for named, hoisted utilities; function expressions for conditional or assignment-based definitions; arrow functions for concise callbacks; and IIFEs when a one-time private scope is needed.
- **Arrow Function `this`:** arrow functions are concise, but their lexical `this` makes them unsuitable for object methods that depend on `this` referring to the calling object. Regular functions should be used for such methods.
- **Object Reference Semantics:** assigning one object to another (`const user2 = user1`) copies the reference, not the data — this is the source of many "mysterious" bugs where one variable appears to change another. Use the spread operator or `Object.assign({}, source)` to create an independent copy.
- **`freeze` vs `seal`:** `Object.freeze` makes an object fully immutable (no changes, additions, or removals), while `Object.seal` allows value updates but prevents adding or removing properties. Choose the appropriate one based on the desired level of protection.
- **Mutating vs Non-Mutating Array Methods:** `map`, `filter`, `slice`, `find`, `findIndex`, `some`, `every`, and `reduce` return new values and leave the original array unchanged; `push`, `pop`, `shift`, `unshift`, and `splice` mutate the original array. Prefer non-mutating methods to avoid unintended side effects.
- **Method Chaining:** `filter().map()` and similar chains make data transformations readable and composable, but should be used judiciously to avoid readability issues with very long chains.
- **Destructuring with Defaults:** object destructuring supports renaming and default values, which makes function parameters and data extraction more concise.
- **Closure Privacy:** closures allow private variables that cannot be accessed from outside the creating function, which is useful for encapsulation without classes.

## 5. Conclusion

Day 3 established the behavioral and data-manipulation foundation of the internship: the five function styles (declaration, expression, arrow, anonymous, IIFE) cover how reusable logic is defined and invoked, scope/hoisting/closures explain variable visibility and lifetime, objects and their methods (keys, values, entries, assign, hasOwn, freeze, seal, spread, destructuring) cover how structured data is stored and protected, and array methods (push/pop/shift/unshift/slice/splice/forEach/map/filter/reduce/find/findIndex/some/every/flat/indexOf/isArray) cover how collections are queried and transformed. Callbacks and higher-order functions demonstrated how functions can be passed as values to make data processing reusable and composable. All acceptance criteria for Day 3 — explaining the difference between function expressions, arrow functions, IIFEs, and anonymous functions; manipulating and transforming data using at least 5 Object and 5 Array methods; demonstrating correct usage without runtime errors; creating a daily learning-log file; raising a GitHub PR; and posting the learning-log and PR links in Zoho and Microsoft Teams — were met, with eight practice files serving as working demonstrations, the learning log documenting each concept, and the practice code committed and shared with the mentor via Pull Request. This functional and data-manipulation foundation directly enables Day 4's move into asynchronous JavaScript and DOM manipulation.
