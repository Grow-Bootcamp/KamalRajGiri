# Learning Log: Day 4 - Error Handling, Advanced JavaScript Concepts & Weekly Review
*September 4, 2026*

Today was focused on understanding how JavaScript behaves when things go wrong and how advanced language features are used in real applications. I practiced error handling, debugging, closures, memory concepts, collections, spread/rest operators, the `this` keyword, and browser storage. I also reviewed the most important topics from Days 1-4 in preparation for the weekly presentation.

---

## What I Set Out to Learn

- Identify and handle different JavaScript error types.
- Use `try/catch/finally` and custom errors correctly.
- Understand closures and how they preserve data.
- Learn the difference between heap memory, cookies, and sessions.
- Work with collections such as `Set`, `Map`, and array methods.
- Use spread/rest operators and understand `this` in different contexts.
- Prepare a short summary of the week’s learning for a mentor presentation.

---

## 1. JavaScript Errors and Debugging

JavaScript errors happen when code is invalid, a variable is missing, a value is unexpected, or a number is outside a valid range. The basic idea is to detect the issue early, understand the error, and handle it safely.

### Common Error Types

#### ReferenceError
A `ReferenceError` happens when we try to use a variable that is not defined.

```javascript
try {
  console.log(unknownVariable);
} catch (error) {
  console.error("ReferenceError:", error.message);
}
```

#### TypeError
A `TypeError` happens when an operation is used on a value of the wrong type.

```javascript
try {
  const value = 100;
  value();
} catch (error) {
  console.error("TypeError:", error.message);
}
```

#### RangeError
A `RangeError` happens when a value is not within the allowed range.

```javascript
try {
  const number = 1;
  number.toFixed(200);
} catch (error) {
  console.error("RangeError:", error.message);
}
```

### `try/catch/finally`

```javascript
function checkAge(age) {
  if (age < 18) {
    throw new Error("You must be at least 18 years old.");
  }
  return "Allowed";
}

try {
  checkAge(13);
} catch (error) {
  console.log(error.name);
  console.log(error.message);
} finally {
  console.log("This will always run.");
}
```

This is a very useful pattern because the code in the `try` block can fail without stopping the whole program, and the `finally` block can be used for cleanup or final actions.

### Error Object

The JavaScript `Error` object includes:

- `name`
- `message`
- `stack`

```javascript
const err = new Error("This is an error message");
console.log(err.name); // Error
console.log(err.message); // This is an error message
console.log(err.stack);
```

### Custom Validation Example

```javascript
function addExpenses(title, amount, category, date) {
  const newExpense = {
    title,
    amount,
    category,
    date,
  };

  try {
    if (!title || title.trim() === "") throw new Error("Missing title");
    if (amount === undefined || amount === null) throw new Error("Missing amount");
    if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
    if (!category || category.trim() === "") throw new Error("Missing category");
    if (!date || date.trim() === "") throw new Error("Missing date");

    expenses.push(newExpense);
    console.log("Expense added successfully.");
  } catch (error) {
    console.error(`Error adding expense: ${error.message}`);
  }
}
```

This practice helped me understand that validation should happen before adding invalid data to an array or database.

### Debugging Tools and Console Methods

The browser console is important for debugging. I practiced methods like:

- `console.log()`
- `console.error()`
- `console.warn()`
- `console.info()`
- `console.assert()`
- `console.table()`
- `console.group()` and `console.groupEnd()`
- `console.time()` and `console.timeEnd()`

```javascript
console.table([{ name: "John", age: 30 }, { name: "Jane", age: 25 }]);
console.group("Group 1");
console.log("Inside group");
console.groupEnd();
```

These tools help track variable values, errors, grouped output, and performance timing.

---

## 2. Heap Memory and Closures

### Heap Memory
The heap is the memory region used for dynamically allocated objects and data structures. In JavaScript, objects, arrays, functions, and references are stored in heap memory.

```javascript
const user = {
  name: "Kamal",
  age: 23,
};

const numbers = [1, 2, 3, 4, 5];
console.table(user);
console.log(numbers);
```

Objects and arrays are reference values, not primitive values. This means they are stored in memory and the variable points to the location of that memory.

### Primitive vs Reference Values

```javascript
const primitiveValue = "Hello";
const referenceValue = { name: "Alice" };

const anotherPrimitiveValue = primitiveValue;
console.log(anotherPrimitiveValue);
```

With primitive values, a copy is created. With objects, the variable stores a reference to the original object, so changes affect the same object.

### Closure
A closure is a function that remembers variables from the outer scope even after the outer function has finished running.

```javascript
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

This is useful because it allows private state to persist without exposing variables globally.

---

## 3. Cookies, Sessions, and Browser Storage

### Cookies
Cookies are small pieces of data stored in the browser. They are sent with HTTP requests and can be used to remember user preferences or session information.

```javascript
document.cookie = "currency=Rs; max-age=86400";
console.log(document.cookie);
```

Important cookie attributes:

- `expires` or `max-age`
- `path`
- `secure`
- `samesite`
- `httponly`

### Sessions
Sessions are temporary data stored on the server and used to track user-specific activity, such as login status or shopping cart data.

In JavaScript on the browser side, we often also use:

- `sessionStorage` for temporary data during a browser session
- `localStorage` for persistent browser storage

```javascript
localStorage.setItem("expenses", JSON.stringify(expenses));
const storedExpenses = localStorage.getItem("expenses");
const loadedExpenses = JSON.parse(storedExpenses);
console.table(loadedExpenses);

sessionStorage.setItem("lastViewedCategory", "Food");
const lastCategory = sessionStorage.getItem("lastViewedCategory");
console.log(lastCategory);
```

### Difference Between Cookies and Sessions

| Feature | Cookies | Sessions |
|---|---|---|
| Stored on | Browser | Server |
| Use case | Small preferences, tracking, tokens | Login state, shopping cart, user activity |
| Lifetime | Can be short or long-lived | Usually temporary |
| Security | Less secure unless configured | Usually more secure |

A cookie is good for storing lightweight browser-side information, while a session is better for sensitive or temporary server-side state.

---

## 4. Collections, Spread, Rest, and `this`

### Set
A `Set` stores unique values only.

```javascript
const uniqueNumber = new Set([1, 2, 3, 4, 5, 5]);
uniqueNumber.add(6);
console.log([...uniqueNumber]);
```

### Map
A `Map` stores key-value pairs and allows any type of key.

```javascript
const userMap = new Map();
userMap.set("name", "Alice");
userMap.set("age", 23);
console.log(userMap.get("name"));
```

### Spread Operator
The spread operator expands values from arrays or objects.

```javascript
const numbers = [1, 2, 3, 4, 5];
const newNumbers = [...numbers, 6, 7, 8];
console.log(newNumbers);
```

```javascript
const uniqueCategories = [...new Set(expenses.map((expense) => expense.category))];
```

### Rest Operator
The rest operator gathers multiple arguments into an array.

```javascript
function calculateTotal(...amounts) {
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  return total;
}

console.log(calculateTotal(100, 200, 300, 400, 500));
```

### `this` Keyword
The value of `this` depends on how the function is called.

```javascript
const user = {
  name: "Kamal",
  greet() {
    console.log(this.name);
  },
};

user.greet();
```

Arrow functions do not have their own `this`; they inherit it from the surrounding scope.

```javascript
const userArrow = {
  name: "Kamal",
  greet: () => {
    console.log(this.name);
  },
};

userArrow.greet();
```

### `call`, `apply`, and `bind`

```javascript
function greet() {
  console.log(this.name);
}

const user1 = { name: "Kamal" };
greet.call(user1);

console.log(add.apply(null, [2, 3]));

const user2 = greet.bind(user1);
user2();
```

These methods are used to explicitly set the context of `this`.

---

## 5. Array Methods and Collection Practice

We practiced several array methods that are very important for data processing.

```javascript
const titles = expenses.map((expense) => expense.title);
console.log("Titles of Expenses:", titles);

const foodExpenses = expenses.filter((expense) => expense.category === "Food");
console.log("Food Expenses:", foodExpenses);

const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
console.log("Total Amount of Expenses:", totalAmount);
```

Important differences:

- `map()` transforms each item and returns a new array.
- `filter()` keeps only the items that pass a condition.
- `reduce()` combines values into one result.

### Category Summary with `Map`

```javascript
const categorySummary = new Map();

expenses.forEach((expense) => {
  const category = expense.category;
  const amount = expense.amount;

  if (categorySummary.has(category)) {
    categorySummary.set(category, categorySummary.get(category) + amount);
  } else {
    categorySummary.set(category, amount);
  }
});

console.log("Category Summary:", categorySummary);
```

This helped me understand how `Map` can be used to group aggregated totals by category.

---

## 6. Practice Exercise: Personal Expense Tracker

I implemented a small expense tracker application in JavaScript to combine all of the topics into one example.

```javascript
const expenses = [
  { id: 1, title: "Groceries", amount: 150, category: "Food", date: "2023-05-01" },
  { id: 2, title: "Laptop", amount: 50000, category: "Electronics", date: "2023-05-01" },
  { id: 3, title: "Movie", amount: 500, category: "Entertainment", date: "2023-05-01" },
  { id: 4, title: "Book", amount: 200, category: "Education", date: "2023-05-01" },
  { id: 5, title: "Coffee", amount: 50, category: "Food", date: "2023-05-01" },
];
```

The code demonstrated:

- creating and validating new expenses
- using `map`, `filter`, and `reduce`
- computing category totals
- saving data to `localStorage`
- adding custom methods to objects using `this`

This made the day practical because it connected theory to real developer workflows.

---

## 7. Weekly Presentation Summary

For the presentation, I summarized the main topics from Days 1-4:

1. Day 1: HTML, CSS, Flexbox, Grid, JavaScript basics, operators.
2. Day 2: Conditionals, loops, strings, and decision-based logic.
3. Day 3: Functions, objects, arrays, callbacks, and higher-order functions.
4. Day 4: Errors, debugging, closures, heap memory, cookies/sessions, collections, spread/rest, and `this`.

I also learned that a strong technical presentation should explain:

- the concept
- why it matters
- a practical example
- one or two common mistakes

This helped me connect daily learning with real-world programming habits.

---

## Key Takeaways

1. JavaScript errors are useful clues; understanding them helps fix bugs faster.
2. `try/catch/finally` is the safest way to handle recoverable exceptions.
3. Closures let functions retain access to private data, which is an important pattern in JavaScript.
4. Objects and arrays are stored in heap memory, which means reference behavior matters.
5. Cookies and sessions serve different purposes and should be used appropriately.
6. `Set`, `Map`, `map()`, `filter()`, and `reduce()` are essential tools for working with collections.
7. `this` depends on the execution context, so it must be used carefully.
8. Browser storage (`localStorage`, `sessionStorage`) is useful for temporary or persistent client-side data.

---

## Reflection

This day gave me confidence in writing cleaner and more reliable JavaScript. I now understand that debugging is not only about catching errors; it is about reading the problem, tracing the code, and validating the logic. The closure and storage examples were especially useful because they connect to real application behavior, not just syntax exercises.

The Day 4 practice also reinforced that JavaScript is not only about writing code—it is about understanding how the code behaves at runtime and how data is preserved across the application lifecycle.
