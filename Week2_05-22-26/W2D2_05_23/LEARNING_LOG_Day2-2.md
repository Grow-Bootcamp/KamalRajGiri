# Learning Log: Week 2, Day 2.2 - OAuth and TypeScript Basics

*September 10, 2026*

This learning log is based only on the Day 2.2 task description and the supplied OAuth, CORS, and TypeScript resources.

## Scope

- Study OAuth and OAuth 2.0.
- Understand access tokens and refresh tokens.
- Understand CORS and when a CORS error occurs.
- Practice TypeScript types, interfaces, functions, and generics.
- Record key learnings and code examples for the day's work.

## OAuth and OAuth 2.0

OAuth is an open standard for access delegation. It allows a website or application to access limited information from another service without exposing the user's password to that application.

For example, an application can allow a user to continue with Google without asking the application to store or know the user's Google password. The user authenticates with the authorization provider and gives the application permission to access permitted resources.

### Important Terminology

- **Resource owner:** The user who authorizes an application to access their account.
- **Client:** The application that wants to access the user's account.
- **Resource server:** The server hosting the user's protected account data, such as Google.
- **Authorization server:** The server that authenticates the user and issues tokens.
- **Access token:** A token the client uses to make API requests on behalf of the user.
- **Refresh token:** A token used to obtain a new access token after the current access token expires.

### Access Token and Refresh Token Flow

1. The user authenticates with the authorization server.
2. The user authorizes the client application.
3. The authorization server issues an access token and, where applicable, a refresh token.
4. The client uses the access token to request protected resources.
5. When the access token expires, the client uses the refresh token to request a new access token.
6. If the refresh request fails or the refresh token is invalid, the user must authenticate again.

The supplied OAuth resource shows the refresh-token request shape:

```javascript
async function refreshAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: process.env.REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });

  if (!response.ok) {
    throw new Error("Refresh failed - User must login again");
  }

  return response.json();
}
```

The supplied example is a demonstration of the request shape. It should not be used directly as browser code because `process.env` is a Node.js-style environment API. Client secrets and refresh tokens should not be exposed in frontend code.

## CORS

Cross-Origin Resource Sharing (CORS) controls whether a browser allows a webpage from one origin to request and read resources from another origin through JavaScript.

An origin is the combination of:

- Protocol
- Domain
- Port

For example, `http://example.com:80` contains the `http` protocol, the `example.com` domain, and port `80`.

Frontend and backend applications commonly run on different origins. For example:

```javascript
fetch("http://localhost:5000/api/users");
```

The browser checks whether the backend allows the frontend's origin. If the server does not provide a suitable CORS policy, the browser blocks the frontend from using the response and reports a CORS error.

CORS is mainly a browser security mechanism. It does not necessarily mean that the backend cannot receive the request; it means that the browser will not allow the frontend JavaScript to use the response unless the server explicitly permits the origin.

## TypeScript Basics

The supplied TypeScript examples use strict type checking with an ES2022 target and NodeNext module configuration.

### Types and Type Inference

The examples demonstrate primitive types and inferred types:

```typescript
let name: string = "Kamal";
let age: number = 25;
let isStudent: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

let inferredNumber = 22;
let inferredString = "Hello";
```

They also show the difference between `any` and `unknown`. The `unknown` type is safer because a value must be checked before it is used as a specific type.

### Arrays and Tuples

```typescript
let marks: number[] = [85, 90, 78, 92];
const skills: string[] = ["JavaScript", "TypeScript", "Node.js"];
const fruits: Array<string> = ["Apple", "Banana", "Cherry"];

let person: [string, number] = ["Kamal", 25];
```

An array contains values of one type, while a tuple defines a fixed sequence of values with known positions and types.

### Functions

The TypeScript resources use parameter and return-type annotations:

```typescript
function greet(person: string): string {
  return `Hello, ${person}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function logMessage(message: string): void {
  console.log(`Log: ${message}`);
}
```

The `void` return type indicates that a function does not return a value.

### Interfaces

An interface describes the structure an object must follow:

```typescript
interface Student {
  name: string;
  age: number;
  marks: number[];
}

function printStudent(student: Student): void {
  console.log(student.name);
  console.log(student.age);
  console.log(student.marks);
}
```

The examples also demonstrate optional properties, readonly properties, methods, and interface extension:

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: "Rex",
  breed: "Labrador"
};
```

### Type Aliases, Unions, Intersections, and Generics

The resources define aliases for reusable types:

```typescript
type ID = number | string;
type Status = "pending" | "approved" | "rejected";
type Person = { name: string };
type Employee = { employeeId: number };
type Staff = Person & Employee;
type Point = [number, number];
type MathOperation = (a: number, b: number) => number;
```

They also include a generic type alias:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

The supplied TypeScript files demonstrate generic array syntax and a generic type alias. They do not include a complete generic function, so that remains a follow-up exercise for the generics requirement.

## Key Takeaways

- OAuth lets applications receive delegated access without handling a user's password.
- Access tokens are used to access protected resources.
- Refresh tokens are used to obtain replacement access tokens after expiration.
- CORS is enforced by the browser when a server does not allow a cross-origin request.
- TypeScript provides static types, object contracts, typed functions, and reusable type definitions.
- Interfaces describe object structures, while type aliases can represent unions, intersections, tuples, and function types.

## Acceptance Criteria Progress

- [x] Reviewed the OAuth 2.0 roles, access tokens, and refresh tokens in the supplied resource.
- [x] Reviewed CORS, origins, and when a browser CORS error occurs.
- [x] Practiced TypeScript types, interfaces, functions, aliases, unions, and intersections.
- [ ] Add and run a complete generic function example.
- [ ] Create a complete executable OAuth authorization flow.
- [ ] Create a complete executable CORS example.
- [ ] Commit the learning log and raise the required GitHub pull request.
- [ ] Post the learning-log and pull-request links in the Zoho task and Microsoft Teams thread.
