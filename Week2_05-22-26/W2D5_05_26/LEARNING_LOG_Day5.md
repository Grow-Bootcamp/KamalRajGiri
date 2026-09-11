# Learning Log: Day 5 - JavaScript Testing with Jest and Supertest
*September 11, 2026*

Today I studied the purpose of automated testing in backend applications, different testing levels, assertions, and the JavaScript testing ecosystem. I practiced these concepts by creating Jest unit tests, asynchronous Promise tests, and Supertest API tests for a small Express application.

## What I Aimed to Learn

- Explain why testing is important for backend applications.
- Distinguish unit, integration, and end-to-end testing.
- Use Jest to write and run JavaScript tests.
- Use Supertest to test Express endpoints without starting a real server.
- Test synchronous functions, thrown errors, resolved Promises, and rejected Promises.
- Understand when to choose Jest, Supertest, Mocha/Chai, or an end-to-end tool such as Playwright.

## Why Backend Testing Matters

Backend code often controls authentication, authorization, validation, database access, business rules, REST APIs, payments, sessions, and error handling. A small regression in any of these areas can cause incorrect behavior or security and reliability problems.

Automated tests help to:

- Find defects early, before deployment.
- Prevent regressions when existing code is changed.
- Make refactoring safer by protecting observable behavior.
- Encourage small functions with clear responsibilities.
- Increase confidence that a change has not broken existing functionality.

Manual testing is useful for exploration, but it requires a person to repeat the same procedure. Automated testing lets the test runner repeat that procedure consistently. The two approaches complement each other rather than one completely replacing the other.

## Testing Levels

### Unit Testing

Unit testing checks one small unit of logic, such as a function, method, or module, in isolation. It normally avoids real databases, browsers, and external services. Unit tests are fast, focused, and easy to debug.

Examples from the practice project include testing `add`, `subtract`, and `divide` in `src/utils/calculator.js`:

```javascript
test("adds two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
});

test("Divide by zero throws an error", () => {
    expect(() => divide(10, 0))
        .toThrow("Cannot divide by zero");
});
```

### Integration Testing

Integration testing checks whether multiple components work correctly together. An API test that sends a request through Express and verifies the response is an integration-style test because it exercises routing, middleware, the handler, and response serialization together.

### End-to-End Testing

End-to-end testing checks a complete user workflow from the user’s perspective. It can include the frontend, backend, database, browser, and external services. E2E tests provide broad confidence but are usually slower and more expensive to maintain than unit tests.

## Arrange, Act, Assert

Most tests can be organized into three steps:

1. **Arrange:** prepare the input data and test conditions.
2. **Act:** call the function or make the request.
3. **Assert:** compare the actual result with the expected result.

For example, the API tests arrange a request payload, act by calling `request(app).post(...)`, and assert the status code and returned user fields.

## Jest Practice

Jest is a JavaScript test runner and testing framework. It provides test discovery, assertions, lifecycle hooks, asynchronous test support, and other testing utilities. Jest is more than an assertion library: `expect` provides assertions, while Jest runs and reports the tests.

Matchers practiced in the demo include:

- `toBe` for primitive values.
- `toEqual` for object value equality.
- `toBeDefined` and `toBeUndefined` for definedness checks.
- `toBeGreaterThan` for numeric comparisons.
- `toHaveLength` for arrays and other length-bearing values.
- `toThrow` for expected synchronous errors.
- `.rejects.toThrow` for rejected Promises.

The demo also uses lifecycle hooks. `beforeAll` runs once before the test suite and `afterAll` runs once after it. `beforeEach` and `afterEach` are useful when every test needs setup or cleanup.

## Testing Asynchronous Code

The `asyncUtils.js` module returns delayed Promises. Jest can test them with `async`/`await`:

```javascript
test("getUserById returns user for valid ID", async () => {
    const user = await getUserById(1);

    expect(user).toEqual({
        id: 1,
        name: "Kamal",
        role: "student"
    });
});

test("getUserById rejects for invalid ID", async () => {
    await expect(getUserById(999))
        .rejects
        .toThrow("User not found");
});
```

An alternative is to return the Promise directly and place assertions in a `.then()` callback. Returning or awaiting the Promise is important so Jest waits for the asynchronous operation before deciding whether the test passed.

## Supertest API Practice

The Express app exposes these endpoints:

- `GET /api/health` returns status `200` and `{ status: "ok" }`.
- `GET /api/users` returns status `200` and a user array.
- `POST /api/users` accepts a name and returns status `201` with a new user object.

Supertest can receive the exported Express app directly:

```javascript
const response = await request(app)
    .post("/api/users")
    .send({ name: "Aagyat" });

expect(response.statusCode).toBe(201);
expect(response.body.name).toBe("Aagyat");
expect(response.body.id).toBeDefined();
```

Keeping `app` exported from `src/app.js` and calling `listen` only from `src/server.js` makes the API easier to test. The test suite does not need to start a server or manage a port.

## Tools and When to Use Them

- **Jest:** a complete JavaScript test runner with assertions, lifecycle hooks, and async testing support. A good default for unit and many integration tests.
- **Supertest:** sends HTTP requests to Node/Express applications and checks status codes, headers, and response bodies. It works alongside Jest or another test runner.
- **Mocha:** a flexible JavaScript test runner. It is useful when a project wants more control over its test structure and supporting tools.
- **Chai:** an assertion library often paired with Mocha. It provides styles such as `expect`, `should`, and `assert`.
- **Playwright or Cypress:** browser-focused tools for end-to-end workflows and frontend integration testing.

## Setup and Useful Commands

```bash
cd testing-demo
npm init -y
npm install express
npm install --save-dev jest supertest
npm test
npx jest --coverage
```

The project uses this test script in `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## Findings and Follow-up

- Testing behavior is more valuable than testing implementation details. Tests should continue to pass when internal code is refactored without changing the public behavior.
- API tests should eventually cover invalid request bodies, missing fields, unsupported routes, and error responses, not only successful responses.
- The current user endpoint returns hard-coded data. A production application would need persistence, validation, unique IDs, and database integration tests.
- The calculator suite contains repeated examples for practicing Jest organization with `describe` and `it`; a production suite should remove redundant tests while keeping meaningful edge cases.
- Slow artificial delays in async examples demonstrate Promise testing, but production tests should avoid unnecessary waiting where mocks or fake timers can provide a faster, deterministic check.

## Verification Checklist

- [x] Explained the value of automated backend testing.
- [x] Distinguished unit, integration, and end-to-end testing.
- [x] Wrote Jest unit tests for arithmetic and divide-by-zero behavior.
- [x] Tested resolved and rejected asynchronous Promises.
- [x] Wrote Supertest tests for GET and POST Express endpoints.
- [x] Practiced Jest matchers and lifecycle hooks.
- [x] Ran the test suite successfully with `npm test`.
- [ ] Commit the learning log and raise the required pull request for mentor review.

## Next Steps

Add validation and error-handling tests for the user API, replace hard-coded users with a test-friendly data layer, and add a browser-level end-to-end test for the complete user workflow.