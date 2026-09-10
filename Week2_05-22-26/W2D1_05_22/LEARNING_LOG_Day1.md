# Learning Log: Day 1 - ES6+, OOP, DOM, Modules, and REST Design
*September 8, 2026*

Today I studied modern JavaScript features, built-in objects, asynchronous programming, object-oriented programming, DOM manipulation, and JavaScript modules. The ES6, OOP, DOM, and module examples were practiced in the supplied HTML and JavaScript files. REST API design and prototype-based inheritance still need additional implementation before the full task is complete.

## What I Aimed to Learn

- Use `let`, `const`, arrow functions, template literals, destructuring, spread, rest, and default parameters.
- Work with callbacks, promises, and `async`/`await`.
- Use common built-in object and array methods.
- Understand classes, encapsulation, inheritance, polymorphism, and abstraction.
- Select, update, create, remove, and respond to events on DOM elements.
- Split JavaScript into reusable ES modules.
- Begin designing RESTful URLs and mapping common errors to HTTP status codes.

## What I Practiced

### ES6+ Fundamentals

The examples compared `var`, `let`, and `const`, then demonstrated arrow functions and template literals:

```javascript
const divide = (a, b) => a / b;
const greeting = `Hello, ${name}! You are ${age} years old.`;
```

Object destructuring extracts selected properties, while spread creates a new combined array. Rest parameters collect an arbitrary number of function arguments:

```javascript
const { firstName, lastName, age: personAge } = person;
const combined = [...arr1, ...arr2];

function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}
```

### Callbacks, Promises, and Async/Await

A callback is a function passed to another function. Promises represent a future result and can be handled with `.then()` and `.catch()`. The `async`/`await` example fetched a user, then fetched that user's orders, and finally fetched payment information in sequence:

```javascript
async function processUser() {
  try {
    const user = await getUser();
    const orders = await getOrders(user);
    const payment = await getPayment(orders);
    console.log(payment);
  } catch (error) {
    console.log(error);
  }
}
```

The `setTimeout` examples also showed that asynchronous work runs after the current synchronous code. This explains why `Start` and `End` are logged before the delayed message.

### Built-in Objects and Array Methods

The expense examples used these array methods:

- `forEach()` performs an action for every item.
- `map()` transforms items into a new array.
- `filter()` selects every matching item.
- `find()` returns the first matching item.
- `some()` checks whether at least one item matches.
- `every()` checks whether all items match.
- `reduce()` combines items into one result, such as a total amount.

I also practiced `Object.keys()`, `Object.values()`, `Object.entries()`, string methods, `JSON.stringify()`, `JSON.parse()`, and common `Date` methods. The important distinction is that `JSON.stringify()` converts a JavaScript value to JSON text, while `JSON.parse()` converts JSON text back into a JavaScript value.

### Object-Oriented Programming

The OOP example used classes as blueprints for objects:

```javascript
class Student {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    console.log(`My name is ${this.name} and I am ${this.age} years old.`);
  }
}
```

The `BankAccount` example demonstrated encapsulation with a private `#balance` field. The `Student` and `Animal` examples demonstrated inheritance and method overriding. The payment example demonstrated abstraction by exposing `processPayment()` while keeping the individual validation and transaction steps inside the class.

The current practice uses class syntax. Prototype-based inheritance is part of the task acceptance criteria, but a constructor function with `prototype` methods has not yet been added.

### DOM Manipulation and Events

The DOM examples practiced selecting elements with `querySelector()`, `querySelectorAll()`, `getElementById()`, and collection methods. They also demonstrated changing text, HTML, attributes, input values, inline styles, and classes.

Creating and removing elements follows a simple sequence:

```javascript
const item = document.createElement("li");
item.textContent = "Learn JavaScript";
document.querySelector("#todolist").appendChild(item);
item.remove();
```

Event listeners were added for clicks, input changes, and form submission. Calling `event.preventDefault()` prevents a form from reloading the page, allowing the script to validate and process the submitted values.

### JavaScript Modules

`math.js` exports named functions such as `add`, `subtract`, `multiply`, and `divide`, and exports `square` as the default function. `JsModules.js` imports these functions and aliases `divide` as `div`:

```javascript
import square, { add, subtract, multiply } from "./math.js";
import { divide as div } from "./math.js";
```

The HTML file loads the entry script with `type="module"`. Module files should be opened through a local development server rather than directly with a `file://` URL, because browsers restrict module requests from local files.

## REST API Design Notes

This topic was included in the task but was not implemented in the supplied code. A reasonable resource design for users would be:

| Method | URL | Purpose | Expected success |
| --- | --- | --- | --- |
| `GET` | `/api/users` | List users | `200 OK` |
| `GET` | `/api/users/:id` | Get one user | `200 OK` |
| `POST` | `/api/users` | Create a user | `201 Created` |
| `PATCH` | `/api/users/:id` | Update part of a user | `200 OK` |
| `DELETE` | `/api/users/:id` | Delete a user | `204 No Content` |

Common error mappings to review and implement are:

- `400 Bad Request`: malformed or invalid input.
- `401 Unauthorized`: authentication is missing or invalid.
- `403 Forbidden`: the user is authenticated but lacks permission.
- `404 Not Found`: the requested resource does not exist.
- `409 Conflict`: the request conflicts with existing data.
- `500 Internal Server Error`: an unexpected server-side failure.

## Findings and Corrections for Follow-up

- The DOM manipulation example reuses IDs such as `title`, `parent`, and `child`. IDs should be unique so selectors target the intended element.
- The DOM manipulation example contains two separate elements with the same `parent` and `child` IDs, which makes `querySelector()` select only the first matching element.
- The module imports and exports are logically correct, but they require a suitable browser context or local server.
- The class examples demonstrate OOP concepts, but prototype syntax still needs a separate example.
- The REST URL table and status-code notes above are design notes, not a completed API implementation.

## Verification Checklist

- [x] Practiced ES6 variables, functions, template literals, destructuring, spread, rest, and defaults.
- [x] Practiced callbacks, promises, and `async`/`await`.
- [x] Practiced built-in array, object, string, JSON, and date methods.
- [x] Practiced classes, private fields, inheritance, polymorphism, and abstraction.
- [x] Practiced DOM selection, updates, element creation, removal, and events.
- [x] Practiced named and default ES module imports and exports.
- [x] Drafted RESTful URL conventions and common HTTP status mappings.
- [ ] Implement prototype-based inheritance directly with `Constructor.prototype`.
- [ ] Build and test a small REST API example.
- [ ] Add validation and structured error responses to the API example.
- [ ] Run the module example through a local server and verify it in a browser.
- [ ] Commit this learning log and raise the required pull request.

## Next Steps

The next study session should add a prototype-based `User` or `Expense` example, implement a small REST API with validation and error handling, correct the duplicate DOM IDs, and verify the module example through a local server. After those tasks are complete, the learning log can be updated from partly complete to complete and linked in the required task comments.