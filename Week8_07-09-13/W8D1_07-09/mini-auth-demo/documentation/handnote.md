# Week 6 Day 5 — Mini Auth Module with React UI
## Complete Handnote: Concepts, Implementation, Debugging, and Professional Practices

---

# 1. Assignment Overview

## Objective

Build a small full-stack authentication module that connects a React frontend to an Express backend using TypeScript.

The assignment brings together backend authentication, JWT verification, role-based authorization, React components, props, state, effects, asynchronous API requests, and protected pages.

After completing the original assignment, the project was enhanced with automatic access-token refresh using a refresh token stored in an HttpOnly cookie.

## What the project demonstrates

1. Login with email and password.
2. Password verification using bcrypt.
3. JWT generation and verification.
4. Protected backend routes.
5. Role-based authorization.
6. A React login form and protected dashboard.
7. Typed frontend API services.
8. Loading and error states.
9. Automatic access-token refresh.
10. Refresh-token rotation and logout revocation.
11. Testing, debugging, and verification of authentication flows.

## Progress record

- Original Week 6 Day 5 assignment: 100% implemented.
- Refresh-token enhancement: core flow implemented and verified.
- Final documentation: prepared in `README.md` and this `handnote.md`.
- Remaining delivery work: final review, commit, push, and mentor PR if not already completed.

---

# 2. Big-Picture Architecture

The application has two separate applications:

- **Client:** React + TypeScript + Vite.
- **Server:** Express + TypeScript + Node.js.

The client handles user interaction and displays the result. The server validates credentials, creates tokens, verifies requests, and enforces authorization.

```text
User
 |
 v
React Login Form
 |
 | POST /api/auth/login
 v
Express Auth Controller
 |
 v
Auth Service
 |
 +--> User Repository
 |       |
 |       +--> Find user by email
 |
 +--> bcrypt password verification
 |
 +--> Generate access JWT
 |
 +--> Generate refresh token
 |
 v
HTTP Response
 |
 +--> JSON: access token
 |
 +--> HttpOnly cookie: refresh token
 |
 v
React Protected Dashboard
 |
 | GET /api/auth/profile
 | Authorization: Bearer <access-token>
 v
Authentication Middleware
 |
 v
Authorization Middleware
 |
 v
Protected Controller
 |
 v
Profile Response
```

If the access token expires, an additional recovery flow is used:

```text
Profile request
     |
     v
  401 response
     |
     v
POST /api/auth/refresh
     |
     v
Validate refresh session
     |
     v
Revoke old refresh session
     |
     v
Issue new access token
and rotated refresh token
     |
     v
Retry profile request
     |
     v
Dashboard continues working
```

## Why separate the client and server?

The browser should not be trusted to make final security decisions. It can hide or show UI, but the backend must independently verify every protected request.

A user could manually call an API without using the React interface. Therefore, route protection and role checks must exist on the server, not only in the frontend.

---

# 3. Authentication vs Authorization

These concepts are related but not interchangeable.

## Authentication

Authentication answers:

**Who are you?**

In this project, the backend checks the submitted email and password. If they are valid, it issues an access token.

Example:

```text
Email + password
       |
       v
Verify credentials
       |
       v
Authenticated user
```

## Authorization

Authorization answers:

**What are you allowed to do?**

After authentication, the backend checks whether the user's role permits access to a route.

For example:

- `user` can access the permitted profile route.
- `admin` can access the admin-only route.
- A validly authenticated user without the required role must still be denied access.

## Important distinction

A valid token does not automatically grant access to every endpoint.

The token proves an identity and carries claims. Authorization middleware evaluates whether those claims satisfy the route's requirements.

**Professional explanation:** Authentication establishes identity; authorization enforces access policy.

---

# 4. Password Security and bcrypt

## Why not store plain-text passwords?

If a database or repository containing plain-text passwords is exposed, the passwords become immediately readable.

Instead, registration stores a password hash:

```text
Original password
       |
       v
bcrypt hashing
       |
       v
Stored passwordHash
```

The application should store `passwordHash`, not the original password.

## How `bcrypt.compare()` works

A login check may use:

```ts
const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
);
```

The two arguments have different purposes:

- `credentials.password`: the password submitted by the user.
- `user.passwordHash`: the previously stored bcrypt hash.

bcrypt uses the stored hash's parameters and salt to check whether the submitted password matches. The application does not need to decrypt the stored hash.

Conceptually:

```text
Submitted password
       |
       v
bcrypt comparison <--- Stored password hash
       |
       v
true or false
```

If the result is `false`, authentication fails.

## Why use `await`?

bcrypt's asynchronous comparison returns a Promise. `await` pauses the current asynchronous function until the comparison resolves, allowing the code to use the resulting Boolean.

It does not block the entire Node.js process in the same way a synchronous operation would.

## Common mistake to avoid

Do not compare the submitted password directly with `passwordHash`:

```ts
// Incorrect approach
credentials.password === user.passwordHash
```

The plain password and hash are different representations. Use bcrypt's comparison function.

## Why exclude `passwordHash` from responses?

A profile response should contain only the information the client needs. Even though a password hash is not the original password, it is still sensitive and should not be exposed unnecessarily.

---

# 5. Repository, Service, Controller, and Middleware

The backend separates responsibilities to make the system easier to understand, test, and maintain.

## Repository

The repository handles data access.

The user repository provides operations such as:

```ts
findByEmail(email)
findById(id)
```

The refresh-session repository provides operations such as:

```ts
save(session)
findById(id)
findByTokenHash(tokenHash)
revokeById(id)
```

In this learning project, the repositories are in-memory implementations. They demonstrate the repository contract without requiring a database.

**Important:** In-memory data is lost when the server process restarts. It is not persistent storage.

## Service

The service contains application logic.

The authentication service is responsible for operations such as:

- Finding the user.
- Verifying the password.
- Generating tokens.
- Validating refresh sessions.
- Rotating refresh tokens.
- Revoking sessions during logout.

This logic should not depend on how the HTTP request was received.

## Controller

The controller handles HTTP details:

- Reading request bodies, cookies, and headers.
- Calling the service.
- Setting cookies.
- Returning response bodies and status codes.

## Middleware

Middleware runs before the final route handler.

The authentication middleware verifies the access token. Authorization middleware checks whether the authenticated user has an allowed role.

```text
Incoming request
       |
       v
Authentication middleware
       |
       v
Authorization middleware
       |
       v
Controller
```

If authentication or authorization fails, the request should not proceed to the protected controller.

## Why this separation is professional

If token-generation logic is mixed into every controller, changes become repetitive and difficult to test. Separating data access, application logic, HTTP handling, and request protection makes responsibilities clearer.

---

# 6. TypeScript Interfaces, Types, and `implements`

## What is an interface?

An interface describes the shape an object must have.

For example:

```ts
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
```

This contract says that an implementation must provide both methods with the specified parameter and return types.

## Why does the name begin with `I`?

The `I` prefix is a naming convention sometimes used for interfaces, such as `IUserRepository`.

It is not required by TypeScript. Other projects use names like `UserRepository` for interfaces and `InMemoryUserRepository` for their concrete implementation.

Consistency within a project matters more than the prefix itself.

## What does `implements` mean?

Example:

```ts
class InMemoryUserRepository implements IUserRepository {
    // Required methods are implemented here.
}
```

`implements` asks TypeScript to check that the class conforms to the interface.

It does not automatically generate the methods or make the class inherit their implementation.

## Why use an interface for a repository?

The authentication service can depend on the repository contract rather than on a specific storage mechanism.

Conceptually:

```text
AuthService
    |
    v
IUserRepository
    ^
    |
    +-- InMemoryUserRepository
    |
    +-- Future DatabaseUserRepository
```

A future database-backed implementation could satisfy the same interface, allowing the service logic to remain mostly unchanged.

## What does `User | null` mean?

It means the operation may return a user or may return `null` when no matching user exists.

The calling code must handle the missing-user case rather than assuming a user was found.

## Why use `import type`?

Example:

```ts
import type { LoginCredentials } from '../types/auth';
```

`LoginCredentials` is used only as a TypeScript type. `import type` makes that intention explicit and ensures it is treated as a type-only import.

A regular import is appropriate when a runtime value is needed. The exact import rules also depend on the project's TypeScript module configuration.

---

# 7. JWT Access Tokens

## What is a JWT?

JWT stands for JSON Web Token. In this project, it is a signed token used to authenticate protected API requests.

A typical signed JWT contains three encoded sections:

```text
header.payload.signature
```

### Header

Describes metadata such as the signing algorithm.

### Payload

Contains claims, such as the subject identifier and role.

### Signature

Allows the server to verify that the token has not been altered and was signed using the expected secret or key.

## Is a JWT encrypted?

A normal signed JWT is not encrypted by default. Its header and payload are encoded, not hidden.

Anyone who possesses the token can generally decode and read its payload. Therefore, do not put passwords, password hashes, or other secrets in JWT claims.

The signature protects integrity; it does not make the payload confidential.

## Access-token claims

The project signs claims such as:

```ts
{
    sub: user.id,
    role: user.role
}
```

- `sub` identifies the token's subject.
- `role` identifies the user's role as represented in the token.

The server signs the token with the configured secret and verifies it on protected requests.

## What happens during a protected request?

The frontend sends:

```http
Authorization: Bearer <access-token>
```

The authentication middleware extracts the token and verifies its signature and expiry.

If verification succeeds, the middleware makes the verified claims available to subsequent middleware and the controller.

If the token is missing, malformed, tampered with, or expired, authentication fails.

## Why keep the access token short-lived?

A short lifetime limits how long a stolen access token remains valid without requiring server-side revocation of every access token.

In this demo, the access token expires after **one minute** to make the refresh behavior easy to test.

This is an intentionally short demonstration setting, not a universal production configuration.

---

# 8. Role-Based Access Control (RBAC)

RBAC means Role-Based Access Control.

Instead of writing a separate permission decision into every controller, the application associates roles with permitted routes or operations.

Example:

```text
user
 |
 +--> permitted profile access

admin
 |
 +--> permitted profile access
 +--> admin-only access
```

The backend uses authorization middleware to restrict routes based on the verified role.

## Why not hide the admin button only in React?

Frontend visibility is a user-interface decision, not a security boundary. A user can bypass the interface and send a direct HTTP request.

The backend must enforce the role restriction even if the frontend hides the button.

## What is the difference between `401` and `403`?

- **401 Unauthorized:** The request lacks valid authentication credentials, such as a missing or expired access token.
- **403 Forbidden:** The request is authenticated, but the identity does not have permission to perform the operation.

In practice, APIs must apply these statuses consistently with their authentication and authorization design.

---

# 9. React Components, Props, and State

## Component composition

The frontend divides responsibilities into components such as:

- `App`
- `LoginForm`
- `ProtectedDashboard`

`App` coordinates the overall authentication state and chooses which main view to display.

`LoginForm` collects credentials and invokes a callback supplied through props.

`ProtectedDashboard` fetches and displays the authenticated user's profile.

## What are props?

Props are inputs passed from a parent component to a child.

For example, a dashboard can receive:

```ts
interface ProtectedDashboardProps {
    token: string;
    onTokenRefresh: (newToken: string) => void;
    onLogout: () => void;
}
```

- `token` provides the current access token.
- `onTokenRefresh` allows the dashboard to report a newly issued token to the parent.
- `onLogout` lets the dashboard request the parent's logout behavior.

This creates a clear communication path between components.

## Why keep authentication state in `App`?

The parent controls whether the login form or dashboard is displayed. Keeping the shared token state in the parent gives both views a consistent source of truth.

The child does not need to modify the parent's state directly. It calls the callback the parent provided.

## Why use `useState`?

`useState` stores values that change over time and affect rendering.

Examples include:

- Current access token.
- Login loading status.
- Current profile.
- Profile loading status.
- Error messages.

When state changes, React can re-render the affected UI.

## Why use `useEffect`?

Fetching a profile is a side effect: it interacts with an external system rather than merely calculating JSX.

`useEffect` runs the profile-fetching logic after the component renders and when its dependencies change.

The dashboard effect depends on the token and the stable `onTokenRefresh` callback.

## Why use `useCallback`?

A function created during a render normally has a new identity on the next render.

If a function is included in an effect's dependency array, an unstable function reference can cause the effect to run again unnecessarily.

Wrapping the parent callback in `useCallback` can keep its identity stable while its dependencies remain unchanged.

Use it when stable identity is useful; do not wrap every function automatically.

## Why include dependencies in `useEffect`?

The dependency array tells React which reactive values the effect uses.

Leaving out a required dependency can make an effect use an outdated value. Including an unstable dependency can cause repeated executions.

The correct solution is to include the dependencies and make their identities stable where appropriate, rather than suppressing dependency warnings without understanding them.

---

# 10. Asynchronous API Requests and UI States

A network request takes time and can succeed or fail.

The dashboard therefore uses three general UI states:

```text
Request starts
     |
     v
  Loading
     |
     +------> Success: show profile
     |
     +------> Failure: show error or recovery state
```

## Why reset an old error before retrying?

If an error from a previous request remains in state, the UI may continue to display it after a new request begins.

Setting the error to `null` when starting a fresh attempt ensures that the previous error does not automatically remain visible throughout the new attempt.

## Why use `try`, `catch`, and `finally`?

- `try` contains the operation expected to succeed.
- `catch` handles rejected requests or other thrown errors.
- `finally` performs cleanup that should happen whether the operation succeeds or fails.

For the dashboard, `finally` is used to stop the loading indicator.

## Why does the API service throw an `ApiError`?

The service can wrap HTTP failures in an error object containing the HTTP status code.

This lets the caller distinguish a `401` from other failures instead of treating every error identically.

For example, a `401` from a protected profile request can trigger refresh recovery, while a network failure or a server error should follow a different path.

---

# 11. The Automatic Access-Token Refresh Enhancement

The original assignment handled login and protected API access. The enhancement adds a recovery mechanism for an expired access token.

## Why was refresh needed?

An access token expires. Without refresh logic, the user may need to log in again even when a valid refresh session still exists.

The refresh flow allows the frontend to obtain a new access token without asking the user to re-enter credentials.

## Two different tokens

### Access token

- Used to authenticate API requests.
- Sent in the Bearer authorization header.
- Short-lived.
- Verified by the backend on protected routes.

### Refresh token

- Used to request a replacement access token.
- Sent through the refresh cookie.
- Longer-lived than the access token.
- Validated against server-side session state.
- Rotated when successfully used.

They have different purposes and should not be treated as interchangeable.

## Complete refresh sequence

```text
1. Browser requests protected profile
              |
              v
2. Access token has expired
              |
              v
3. Backend responds 401
              |
              v
4. Frontend detects ApiError with status 401
              |
              v
5. Frontend sends POST /api/auth/refresh
   with credentials: 'include'
              |
              v
6. Browser sends HttpOnly refresh cookie
              |
              v
7. Backend finds and validates refresh session
              |
              v
8. Backend revokes old refresh session
              |
              v
9. Backend creates a new access token
   and new refresh token
              |
              v
10. Backend returns new access token in JSON
    and new refresh cookie in Set-Cookie
              |
              v
11. Frontend retries GET /api/auth/profile
    with the new Bearer token
              |
              v
12. Profile succeeds; dashboard remains visible
```

## Why use `credentials: 'include'`?

The refresh token is stored in a cookie, not in the JSON request body.

For a cross-origin fetch, `credentials: 'include'` allows the browser to send eligible cookies and accept credentialed responses, subject to the cookie, CORS, and browser security rules.

The backend must allow the expected frontend origin and credentials. Using `Access-Control-Allow-Origin: *` is not appropriate for a credentialed CORS configuration.

## Why is the refresh token HttpOnly?

An HttpOnly cookie cannot be read directly by ordinary browser JavaScript through `document.cookie`.

This reduces the risk of JavaScript stealing the refresh token through a successful cross-site scripting attack.

It does not eliminate all security risks. XSS may still perform actions through the application, and cookie-based authentication requires appropriate CSRF and origin protections.

## Why hash refresh tokens in the backend?

The refresh token is a credential. The backend stores a hash of the token rather than the raw token.

When a refresh request arrives, the server hashes the presented token and looks up the corresponding session.

If the session repository is exposed, hashes provide better protection than storing usable raw refresh tokens. This does not make every possible database attack harmless, but it reduces direct credential exposure.

## Why use cryptographically secure random bytes?

Refresh tokens should be unpredictable.

Cryptographically secure random generation is designed for security-sensitive values. Ordinary random-number generation should not be used as a substitute for secure token generation.

The current implementation generates a random token, stores its hash, and returns the raw token only through the intended cookie mechanism.

## Why rotate refresh tokens?

After a valid refresh, the backend revokes the old refresh session and issues a replacement.

The browser receives the new refresh token cookie. The old token should no longer work.

Rotation reduces the useful lifetime of an old token after successful use. A production system may also implement token-family tracking and reuse detection to identify suspicious replay.

## Why is the refresh-session repository needed?

JWT access tokens can be verified using their signature and claims. Refresh sessions need additional server-side state so that the backend can track expiry and revocation.

The session record includes fields such as:

- Session identifier.
- User identifier.
- Token hash.
- Expiration timestamp.
- Revocation status.

The in-memory implementation is suitable for demonstrating the concept. A production implementation should use durable storage and appropriate transaction or concurrency controls.

---

# 12. Shared Refresh Promise and Concurrent Requests

## The problem

Imagine two profile requests fail with `401` at almost the same time.

If both independently start a refresh request, they may attempt to rotate the same refresh session.

The first refresh can revoke the old session and issue a new token. The second request may still be carrying the old cookie, causing its refresh attempt to fail.

This is a concurrency problem: two operations are trying to use and rotate the same session concurrently.

## The implemented approach

The API service maintains a shared in-flight refresh promise.

Conceptually:

```text
Caller A ----\
              \
               >---- Shared refresh request
              /              |
Caller B ----/               v
                       One result shared
                       with both callers
```

While the refresh request is pending, callers reuse the same Promise instead of starting a new refresh.

After the Promise settles, the shared reference is reset so a future independent refresh can be attempted if necessary.

## Why this helps

It reduces duplicate refresh requests during the same pending operation and reduces the chance of concurrent rotation conflicts within that frontend instance.

## What it does not guarantee

A shared Promise is not a complete concurrency-control system.

It does not automatically coordinate separate browser tabs, separate application instances, or every possible stale-request scenario. Production implementations may require additional session-family handling and stronger concurrency guarantees.

---

# 13. Mistakes Encountered and How They Were Solved

## Issue 1: An expired-token error appeared briefly in the UI

### What happened?

When the access token expired, the profile request returned `401`. The dashboard's error handling displayed the failure even though a refresh was expected to recover the session.

### Why it happened

The initial protected request was failing correctly, but the UI needed to treat an eligible `401` as the start of a recovery flow rather than immediately treating it as a final failure.

### How it was solved

The API service was updated to:

1. Detect `401` through the typed `ApiError`.
2. Attempt `refreshAccessToken()`.
3. Obtain the replacement access token.
4. Retry the profile request.
5. Return the profile and replacement token to the dashboard.

The dashboard updates its profile and token state after successful recovery.

### Lesson

An HTTP error on an intermediate request is not always the final outcome of the overall operation. The frontend must distinguish recoverable failures from failures that should be displayed to the user.

Do not simply hide every `401`: if refresh fails, the application must handle the invalid session appropriately.

---

## Issue 2: Duplicate `401` requests and repeated console messages

### What happened?

The browser Console showed two initial profile requests returning `401`, followed by repeated refresh and retry log messages.

The stack trace also included React development Strict Mode behavior.

### Why it happened

React Strict Mode intentionally runs effects an additional time in development to help reveal unsafe side effects and missing cleanup. This can expose duplicate development requests when an effect performs a network operation.

The first request's `401` was expected because the access token had expired. Duplicate requests did not automatically mean the token-refresh logic was broken.

### How it was solved

The refresh service was updated to share the in-flight refresh Promise. The dashboard effect also uses a cleanup guard to prevent stale effect executions from updating state after cleanup.

The flow was re-tested, and the dashboard remained visible while refresh and profile recovery completed.

### Lesson

Do not disable Strict Mode merely to make duplicate development logs disappear. Understand why effects run, make effects safe, and inspect actual network outcomes.

---

## Issue 3: Managing effect cleanup and stale results

### What can go wrong?

An asynchronous request may finish after a component's effect has been cleaned up. If the result updates state without checking whether the effect is still current, stale data or errors can overwrite newer state.

### How the implementation handles it

The dashboard effect uses a local guard:

```ts
let isMounted = true;
```

The effect's cleanup sets it to `false`. Before updating state after an asynchronous operation, the code checks the guard.

### Important limitation

This guard prevents state updates from that cleaned-up effect. It does not cancel the underlying network request by itself. An `AbortController` can be used when actual request cancellation is needed.

The guard is also not a replacement for a complete strategy to coordinate multiple requests or multiple browser tabs.

---

## Issue 4: Keeping the parent token state synchronized

### What can go wrong?

After refresh, the API service may have a new access token while the React parent still holds the old token.

The dashboard must report the new token to the parent so subsequent renders and requests use the current value.

### How it was solved

The dashboard calls the `onTokenRefresh` callback when the returned token differs from its current token. The parent updates React state and the demo's persisted token.

The parent callback uses `useCallback` to keep its identity stable when its dependencies do not change.

### Lesson

A child should communicate changes to parent-owned state through a callback rather than trying to modify the parent's state directly.

---

## Issue 5: Logout must clear both server and frontend state

### What can go wrong?

Removing the access token from React state alone does not revoke the refresh session on the backend.

If the refresh cookie and server-side session remain valid, a later refresh request could potentially establish another access token.

### How it was solved

The logout handler calls the backend logout endpoint. The backend revokes the refresh session when it can identify it and clears the refresh cookie.

The frontend clears its token state and removes the persisted access token in its local cleanup.

### Important limitation

If the logout request fails, local UI cleanup can still happen, but server-side revocation may not have succeeded. The application should distinguish local logout from confirmed server-side session revocation when stronger guarantees are required.

---

# 14. Understanding the Final Console and Network Results

After the fix, the Console showed the following general sequence:

```text
GET /api/auth/profile -> 401
Refresh attempted
Refresh succeeded
GET /api/auth/profile -> success
```

Duplicate initial requests and log messages were also visible during development.

## How to interpret this correctly

| Observation | Meaning |
|---|---|
| Initial profile request returns `401` | The current access token is no longer valid |
| Refresh request succeeds | The refresh session was accepted |
| Retry succeeds | The new access token can access the protected profile |
| Dashboard remains visible | The UI recovered without presenting the intermediate failure |
| Duplicate requests in development | May be caused by Strict Mode or concurrent callers; inspect the actual outcomes |

The successful retry is the important recovery signal. A `401` visible in the Network panel is not itself a bug when the client is intentionally handling it and the recovery succeeds.

If refresh returns `401`, however, the application should not pretend that authentication succeeded. It should clear or invalidate the local session as appropriate and offer the user a way to log in again.

---

# 15. HTTP Cookies, CORS, and Local Development

The backend uses a cookie configuration with properties such as:

```ts
{
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/api/auth'
}
```

The exact configuration must match the deployment environment.

## `httpOnly`

Prevents ordinary JavaScript from reading the cookie directly.

## `secure`

When enabled, the browser sends the cookie only over secure connections. The demo uses `false` for local HTTP development. Production should use HTTPS and `Secure`.

## `sameSite`

Controls when the browser sends a cookie in cross-site contexts. Its behavior affects both CSRF exposure and whether a request carries the cookie.

## `path`

Restricts the cookie to matching URL paths. Here it is scoped to `/api/auth`, which includes login, refresh, and logout.

## `maxAge`

Controls the cookie's browser-side lifetime. The current refresh cookie uses seven days.

Cookie expiry is not the only expiry check: the backend must also validate the refresh session's expiration timestamp.

## CORS

The client and server use different development origins:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

The server allows the expected frontend origin and credentials. The frontend includes credentials on refresh and logout requests.

CORS is a browser-enforced cross-origin policy; it is not a replacement for authentication or authorization.

---

# 16. Testing Strategy

The refresh-flow backend verification covered four scenarios.

## Test 1: Valid login

Expected behavior:

- Credentials are accepted.
- Response is successful.
- JSON contains an access token.
- An HttpOnly refresh cookie is set.

## Test 2: Valid refresh

Expected behavior:

- The refresh cookie identifies a valid session.
- The old session is revoked.
- A new access token is returned.
- A new refresh cookie is issued.

## Test 3: Invalid or expired refresh session

Expected behavior:

- The backend rejects the session.
- The endpoint responds with `401 Unauthorized`.
- No valid replacement session is issued.

## Test 4: Logout followed by old-token reuse

Expected behavior:

- Logout revokes the refresh session.
- The cookie is cleared.
- Reusing the old refresh token is rejected.

## Frontend manual verification

The browser was used to verify:

- Successful login and dashboard display.
- Expired access-token recovery.
- Successful profile retry.
- No transient expired-token error displayed during successful recovery.
- Logout and invalid-session behavior.

## Why tests and manual checks both matter

Automated tests provide repeatable checks for known cases. Browser testing verifies the interaction among cookies, CORS, frontend state, and actual network requests.

Neither alone proves that the application is production-secure.

---

# 17. Professional Improvements and Production Considerations

The project is a learning implementation. The following points distinguish it from a production authentication service.

## 17.1 Replace in-memory repositories

In-memory user and refresh-session data disappear when the backend restarts.

A production system needs durable storage, appropriate uniqueness constraints, and transactions where session rotation requires atomic changes.

## 17.2 Review access-token storage

This demo stores the access token in `localStorage`. JavaScript can read this storage, so an XSS vulnerability could expose the token.

A production architecture should evaluate keeping access tokens in memory and using a secure refresh-session mechanism to restore authentication after a page reload.

## 17.3 Improve refresh-token reuse detection

The current rotation flow revokes the old session, but it does not implement full token-family tracking or reuse detection.

A production design may record token-family relationships and respond to suspicious reuse by revoking the related session family.

## 17.4 Handle concurrent refreshes across tabs and devices

A shared JavaScript Promise coordinates callers only within that application instance. It does not coordinate separate tabs or separate devices.

The backend must be designed to handle concurrent refresh attempts safely.

## 17.5 Review CSRF and cookie protections

HttpOnly does not prevent CSRF. Production systems should review cookie attributes, origin validation, and whether additional CSRF defenses are necessary for the deployment architecture.

## 17.6 Add rate limiting and monitoring

Login and refresh endpoints can be abused. Production deployments should consider rate limits, security event logging, alerting, and appropriate monitoring without logging credentials or raw tokens.

## 17.7 Validate configuration and inputs

The backend should fail safely when required secrets are missing, validate incoming data, and use consistent error responses that do not reveal sensitive internal details.

## 17.8 Review logout semantics

The frontend can remove its local token immediately, but the application should be clear about whether backend revocation succeeded. Systems with stronger session requirements may need explicit retry or confirmation behavior.

---

# 18. Mentor Defense — Questions and Answers

## Q1. Why do we need both an access token and a refresh token?

The access token authenticates protected API requests and has a short lifetime. The refresh token is used to obtain a replacement access token without asking the user to enter credentials again.

## Q2. Why is the refresh token in an HttpOnly cookie?

The browser manages the cookie and ordinary JavaScript cannot directly read its value. This reduces direct token theft through JavaScript, although it does not eliminate XSS or CSRF risks.

## Q3. Why store the refresh-token hash rather than the raw token?

The refresh token is a credential. Storing only its hash reduces the risk that a repository leak immediately exposes usable refresh tokens.

## Q4. Why rotate refresh tokens?

Successful refresh invalidates the previous refresh session and issues a replacement. This limits the usefulness of a previously used token and provides a basis for detecting suspicious reuse in more advanced designs.

## Q5. Why does the first profile request return `401`?

The access token has expired. The client detects that specific response, attempts refresh, and retries the profile request using the replacement token.

## Q6. Why doesn't the UI show the `401` error anymore?

The `401` is handled inside the API recovery flow. When refresh and the retry succeed, the dashboard receives a successful profile result rather than a final error.

## Q7. Why can React Strict Mode produce duplicate requests during development?

Strict Mode deliberately runs effects an extra time in development to reveal unsafe side effects and cleanup problems. Network requests may therefore appear more than once if the effect initiates them.

## Q8. Why use a shared refresh Promise?

It lets concurrent callers reuse a refresh request that is already pending, reducing duplicate refresh attempts and potential conflicts during token rotation.

## Q9. Does the shared Promise solve every refresh race?

No. It coordinates calls within one frontend instance. Separate tabs, separate devices, and backend concurrency still need appropriate handling.

## Q10. Why are both authentication and authorization middleware needed?

Authentication verifies the token and establishes the request's identity. Authorization checks whether that identity has the role or permission required by the route.

## Q11. Why is the role check on the backend?

Frontend controls can be bypassed. The server must independently enforce access restrictions for every protected operation.

## Q12. Why use a repository interface?

It defines a contract that different storage implementations can satisfy. This makes the service easier to test and makes a future move from in-memory data to a database easier to manage.

## Q13. What does `implements` do?

It makes TypeScript check that a class provides the methods and types required by an interface. It does not automatically provide the implementation.

## Q14. Why use `useEffect` for profile fetching?

Fetching data is a side effect. The effect runs after rendering and can respond to changes in its dependencies, such as the current token.

## Q15. Why use `useCallback` for the parent token-refresh handler?

It keeps the callback reference stable while its dependencies remain unchanged, helping prevent unnecessary effect re-execution when that callback is a dependency.

## Q16. Is the application production-ready?

No. It demonstrates core authentication patterns, but it uses in-memory repositories and local-development cookie settings, and it lacks some production protections such as comprehensive refresh-token reuse detection, durable transactional session storage, and complete deployment security hardening.

---

# 19. Key Takeaways

1. Authentication verifies identity; authorization checks permitted actions.
2. Passwords should be verified with bcrypt rather than compared to stored hashes as plain strings.
3. A signed JWT is not encrypted by default.
4. Access tokens and refresh tokens have different responsibilities.
5. Protected routes must be enforced on the backend.
6. HttpOnly cookies reduce direct JavaScript access to refresh tokens.
7. Refresh-token hashing reduces exposure of usable credentials in a repository leak.
8. Rotation revokes the old refresh session and issues a replacement.
9. A `401` can be an intermediate recovery event rather than the final UI outcome.
10. Shared in-flight Promises can reduce duplicate refresh requests.
11. React effects require correct dependencies and cleanup.
12. Strict Mode duplicate development activity should be understood, not blindly disabled.
13. Frontend state and server-side session state must be coordinated during refresh and logout.
14. Automated tests, browser verification, documentation, and code review serve different purposes.
15. A working demo is not automatically production-secure.

---
**End of Week 6 Day 5 handnote.**
