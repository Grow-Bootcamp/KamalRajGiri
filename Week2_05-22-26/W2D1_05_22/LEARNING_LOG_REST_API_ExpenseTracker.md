# Learning Log: REST APIs and Expense Tracker
*September 9, 2026*

This learning log covers only `REST_API_Fundamentals.html` and the `expense-tracker` project. Together, these resources demonstrate how a browser application communicates with a REST API, converts JSON data, validates user input, and updates the DOM with API results.

## Learning Goals

- Understand REST resources and common HTTP methods.
- Convert between JavaScript objects and JSON.
- Send API requests with `fetch()` using promises and `async`/`await`.
- Interpret common HTTP status codes.
- Organize a small frontend application with ES modules.
- Validate and model expense data before sending it to an API.
- Render returned expense data in the browser.

## REST API Fundamentals

REST, or Representational State Transfer, is an architectural style for designing networked applications. A REST API exposes resources through URLs and uses standard HTTP methods to retrieve or change those resources.

| Method | Purpose | Example |
| --- | --- | --- |
| `GET` | Retrieve data | `GET /users` |
| `POST` | Create data | `POST /users` |
| `PUT` | Replace or update data | `PUT /users/11` |
| `DELETE` | Remove data | `DELETE /users/11` |

The REST example uses `fetch()` to request users from `http://localhost:4000/users`. It also demonstrates sending a `POST` request with a JSON request body:

```javascript
const response = await fetch("http://localhost:4000/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: 2,
    name: "Aagyat",
  }),
});

const data = await response.json();
```

The `Content-Type` header tells the server that the request body contains JSON. `JSON.stringify()` converts a JavaScript object into JSON text, while `response.json()` parses a JSON response into a JavaScript value.

## HTTP Status Codes

HTTP status codes describe the result of a request:

- `200 OK`: the request succeeded and data was returned.
- `201 Created`: a new resource was created successfully.
- `204 No Content`: the request succeeded without a response body.
- `400 Bad Request`: the client sent invalid input.
- `401 Unauthorized`: authentication is required or invalid.
- `403 Forbidden`: the client lacks permission.
- `404 Not Found`: the requested resource does not exist.
- `409 Conflict`: the request conflicts with the current resource state.
- `422 Unprocessable Content`: the request is understood but fails validation or a business rule.
- `500 Internal Server Error`: the server encountered an unexpected problem.
- `502 Bad Gateway`: a gateway received an invalid upstream response.
- `503 Service Unavailable`: the service is temporarily unavailable.

## Expense Tracker Structure

The expense tracker separates responsibilities across ES modules:

```text
expense-tracker/
  app.js
  index.html
  dom/expenseUI.js
  models/Expense.js
  utils/api.js
  utils/validation.js
```

### HTML Entry Point

`index.html` provides an expense form with fields for title, amount, and category. It also contains an error message element and an unordered list where expenses are rendered. The application entry file is loaded as a module:

```html
<script type="module" src="./app.js"></script>
```

### Expense Model

`Expense.js` defines an `Expense` class. Its constructor stores an ID, title, amount, and category. The `getInfo()` method formats those values as readable text.

```javascript
export class Expense {
  constructor(id, title, amount, category) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.category = category;
  }
}
```

The class provides a consistent shape for data created from the form before it is sent to the API.

### Validation

`isValidExpense()` checks three rules:

- The title must not be empty after trimming whitespace.
- The amount must be greater than zero.
- The category must not be empty after trimming whitespace.

Invalid input stops the submit handler and displays `Please enter valid expense information.` This prevents an invalid expense from being sent to the server.

### API Helper

`apiRequest()` centralizes API communication. It combines the base URL `http://localhost:4000` with an endpoint, sends the request through `fetch()`, parses JSON responses when the response declares `application/json`, and throws an error for non-2xx responses.

The helper also attaches the HTTP status and response data to the error object. This gives the application enough information to display or log a useful failure.

### Application Flow

When the page loads, `loadExpenses()` requests `GET /expenses` and renders every returned expense. When the form is submitted:

1. The submit event is prevented from reloading the page.
2. Input values are read from the form.
3. The values are converted into the correct types, including `Number(amountInput.value)`.
4. Validation runs before any network request.
5. A new `Expense` object is created with `Date.now()` as its ID.
6. The object is serialized with `JSON.stringify()` and sent using `POST /expenses`.
7. The saved response is rendered in the expense list.
8. The error message is cleared and the form is reset.

### DOM Rendering

`renderExpense()` creates a new `<li>`, formats the expense using its title, amount, and category, and appends it to `#expenseList`:

```javascript
const li = document.createElement("li");
li.textContent = `${expense.title} - Rs. ${expense.amount} - ${expense.category}`;
expenseList.appendChild(li);
```

Using `textContent` inserts the displayed value as text rather than interpreting it as HTML.

## Key Learnings

- REST APIs use predictable resource URLs and HTTP methods.
- JSON is the exchange format between the frontend and API in these examples.
- `fetch()` returns a promise, so requests can be handled with `.then()` or `async`/`await`.
- A `fetch()` call does not reject automatically for HTTP errors; checking `response.ok` is necessary.
- ES modules make the application easier to organize by separating models, validation, API communication, DOM logic, and application orchestration.
- Client-side validation improves user feedback, but the server should validate the same data independently.
- The API helper provides one place for response parsing and HTTP error handling.

## Findings and Follow-up

- The REST examples request `http://localhost:4000/users`, while the expense tracker requests `/expenses`; a compatible local API must provide both resources if both examples are run together.
- The examples require a server such as JSON Server or another API server on port 4000.
- The expense tracker should be opened through a local development server because browser module loading is restricted when files are opened directly with `file://`.
- The REST page starts requests immediately, so the API must be running before the page is opened to avoid network errors.
- The expense tracker performs client-side validation, but server-side validation and persistence behavior should also be tested.

## Verification Checklist

- [x] Explained REST and the `GET`, `POST`, `PUT`, and `DELETE` methods.
- [x] Practiced JSON serialization and parsing.
- [x] Reviewed common HTTP success and error status codes.
- [x] Traced the expense tracker form submission flow.
- [x] Reviewed the `Expense` class and module structure.
- [x] Reviewed validation, API error handling, and DOM rendering.
- [ ] Run the API on port 4000 and test `GET /users`.
- [ ] Run the API on port 4000 and test `GET /expenses` and `POST /expenses`.
- [ ] Open the expense tracker through a local development server.

## Summary

The REST fundamentals resource explains the communication contract between a client and a server. The expense tracker applies that contract in a modular browser application: it validates form data, creates an expense model, sends JSON to an API, handles errors, and renders the saved resource in the DOM.