# Learning Log: Day 3 - Functions, Objects & Arrays
*May 18, 2025*

Today I practiced the JavaScript building blocks used to organize behavior and work with collections of data. The exercises covered different function styles, object properties and methods, array manipulation, callbacks, higher-order functions, scope, hoisting, and closures.

## What I Set Out to Learn

- Define and use function declarations, function expressions, arrow functions, IIFEs, and anonymous functions.
- Understand how `this` behaves in regular functions and arrow functions.
- Read, update, combine, and protect objects.
- Transform and search arrays of values and objects.
- Use callbacks and higher-order functions to make data processing reusable.

## Function Styles

### Function Declaration

A function declaration has a name and can be called before its position in the source because function declarations are hoisted.

```javascript
function add(a, b) {
    return a + b;
}

console.log(add(2, 3)); // 5
```

### Function Expression

A function expression stores a function in a variable. The function can be named or anonymous, but the variable must be initialized before it is called.

```javascript
const available = function (books) {
    return books.filter(book => book.available);
};
```

### Arrow Function

Arrow functions provide shorter syntax and do not create their own `this`; they inherit `this` from the surrounding lexical scope.

```javascript
const sum = (a, b) => a + b;

const getUser = () => ({
    name: "Kamal",
    program: "BCE"
});
```

When an arrow function returns an object literal directly, the object needs parentheses so JavaScript does not interpret the braces as a function body.

### Anonymous Function and Callback

An anonymous function has no name. It is commonly passed as a callback to another function such as `forEach`, `map`, or `filter`.

```javascript
function processUser(callback) {
    callback("Kamal");
}

processUser(function (name) {
    console.log("Hello " + name);
});
```

### IIFE

An Immediately Invoked Function Expression is created and executed immediately. It can create a private scope and can also receive arguments or return a value.

```javascript
const result = (function () {
    return 10 + 20;
})();

console.log(result); // 30
```

## Scope, Hoisting, and Closures

- **Hoisting:** function declarations can be called before their declaration. Variables declared with `var` are hoisted with an initial value of `undefined`, while `let` and `const` are not usable before initialization.
- **Lexical scope:** an inner function can access variables from its outer function, but the outer function cannot access variables declared only inside the inner function.
- **Closure:** a returned inner function remembers variables from the scope where it was created.

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
```

The `count` variable is private to the closure and cannot be accessed directly from outside `makeCounter`.

## Object Methods and Properties

Objects store data as key-value pairs. I practiced both dot notation and bracket notation, including bracket notation for keys such as `"Tmp-city"` that contain a hyphen.

| Method or property | What I practiced |
|---|---|
| `Object.keys(object)` | Get an array of an object's property names |
| `Object.values(object)` | Get an array of an object's values |
| `Object.entries(object)` | Convert an object into key-value pairs |
| `Object.fromEntries(entries)` | Build an object from key-value pairs |
| `Object.assign(target, source)` | Copy properties into a target object |
| `Object.hasOwn(object, key)` | Check whether a property belongs directly to an object |
| `Object.freeze(object)` | Prevent changes, additions, and removals |
| `Object.seal(object)` | Prevent additions and removals while allowing value changes |

```javascript
const user = {
    name: "Kamal",
    age: 20,
    city: "Kanchanpur"
};

const entries = Object.entries(user);
const copy = Object.fromEntries(entries);
const combined = Object.assign({}, user, { role: "student" });

console.log(Object.keys(user));
console.log(Object.values(user));
console.log(Object.hasOwn(user, "name")); // true
console.log(copy);
console.log(combined);
```

I also learned that assigning one object to another copies the reference, not the data. Therefore, changing `user2.name` also changes `user1.name` when `const user2 = user1`. Two separately created objects with identical contents are not equal with `===` because they occupy different references.

## Array Methods and Properties

I practiced these array operations:

- `length` and index access for reading and updating values.
- `push` and `pop` for adding or removing at the end.
- `unshift` and `shift` for adding or removing at the beginning.
- `slice` for creating a section without changing the original array.
- `splice` for removing, adding, or replacing items in the original array.
- `forEach` for performing an action for every item. It returns `undefined`.
- `map` for creating a transformed array.
- `filter` for creating an array containing matching items.
- `reduce` for combining items into one result.
- `find`, `findIndex`, `some`, `every`, `indexOf`, `flat`, and `Array.isArray` for searching, testing, and checking arrays.

```javascript
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(number => number * 2);
const evenNumbers = numbers.filter(number => number % 2 === 0);
const total = numbers.reduce((sum, number) => sum + number, 0);
const firstLargeNumber = numbers.find(number => number > 3);
const hasEvenNumber = numbers.some(number => number % 2 === 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evenNumbers); // [2, 4]
console.log(total); // 15
console.log(firstLargeNumber); // 4
console.log(hasEvenNumber); // true
```

The important distinction is that `map`, `filter`, `slice`, and the search methods leave the original array unchanged, while `push`, `pop`, `shift`, `unshift`, and `splice` mutate it.

## Practical Exercise: Mini Book Collection

The book collection exercise combined the topics using an array of book objects:

```javascript
const books = [
    { id: 1, title: "Math", price: 400, available: true },
    { id: 2, title: "Science", price: 500, available: true }
];

const titles = books.map(book => book.title);
const availableBooks = books.filter(book => book.available);
const totalPrice = books.reduce((total, book) => total + book.price, 0);
const book = books.find(book => book.id === 1);
```

This showed how `map`, `filter`, `reduce`, and `find` can turn a collection of objects into useful application data. I also used `Object.keys`, `Object.values`, `Object.entries`, `Object.assign`, and `Object.hasOwn` on an individual book.

## Key Takeaways

1. Functions can be stored, passed as values, and returned from other functions.
2. Arrow functions are concise, but their lexical `this` makes them different from regular object methods.
3. Objects are reference values, so copying a reference does not create an independent object.
4. Array methods make collection transformations easier to read and compose.
5. `map` transforms, `filter` selects, and `reduce` accumulates.
6. Closures preserve access to variables after the outer function has finished running.

## Practice Notes

- Calling `getUser()` executes the arrow function; logging `getUser` alone logs the function itself.
- For an arrow-function `this` example, the method must be called on the correct object. Calling `user.greet()` twice does not test the separate `user1` object.
- The practice examples should be run in the browser console or with Node.js to confirm the expected output and catch naming or invocation mistakes.