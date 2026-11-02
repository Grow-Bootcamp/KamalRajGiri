# Week 7 Day 2 — Authentication & Role-Based Authorization in React

## 1. Objective

The goal of this assignment was to integrate a React TypeScript frontend with an Express TypeScript authentication backend.

The application supports:

- User registration and login
- JWT-based authentication
- Protected React routes
- Role-based authorization
- Access-token expiration and refresh
- Refresh-token rotation and logout revocation
- Session restoration after browser reload
- Role-aware navigation and admin-only access

## 2. Authentication vs. Authorization

**Authentication** answers: Who is the user?

The user provides credentials. The backend verifies the email and password and issues an access token.

**Authorization** answers: What is the authenticated user allowed to do?

The backend checks the user's role and permissions before granting access to a protected resource.

Example:

- A normal user can access `/dashboard`.
- An admin can access `/dashboard` and `/admin`.
- An unauthenticated visitor must log in before accessing protected routes.

Authentication must happen before role-based authorization.


## 2. Authentication vs. Authorization

These two terms are related, but they solve different problems.

Authentication = Who are you?

Authentication verifies a user's identity.

The user provides credentials. The backend verifies the email and password and issues an access token.

Authorization = What are you allowed to do?

Authorization determines what an authenticated user is allowed to access. The backend checks the user's role and permissions before granting access to a protected resource.

Example:

- A normal user can access `/dashboard`.
- An admin can access `/dashboard` and `/admin`.
- An unauthenticated visitor must log in before accessing protected routes.

Authentication must happen before role-based authorization.

Frontend — User experience

- Hide unavailable buttons.
- Redirect unauthenticated visitors.
- Display only permitted navigation links.
- Show unauthorized messages.

Backend — Actual security

- Verify JWT signatures and expiration.
- Identify the authenticated user.
- Verify roles and permissions.
- Reject unauthorized API requests.

Golden rule: Frontend authorization is not a security boundary. Backend authorization is mandatory.

One important detail: checking whether a token exists is not equivalent to proving that it is valid.

The backend must verify the token when the frontend requests protected resources.

## 3. JWT Access Tokens

JWT means JSON Web Token. It is a compact token format commonly used to carry claims between a client and server.

A JWT has three sections:

1. Header — describes the token type and signing algorithm.
2. Payload — contains claims such as the subject (`sub`) and role.
3. Signature — allows the backend to verify that the token has not been altered.

The sections are separated by periods:

`header.payload.signature`

The backend signs access tokens using HS256 and the configured `JWT_SECRET`.

The token includes the user's ID and role and expires after 15 minutes.

**Important:** A signed JWT is not automatically encrypted. Its payload can generally be decoded by anyone holding the token. Never put passwords or other secrets in the payload.

The backend must verify the signature, algorithm, and expiry before trusting the claims.

## 4. Password Hashing with bcrypt

Passwords must not be stored as plain text.

During registration:

1. Validate the submitted fields.
2. Normalize the email.
3. Hash the password with bcrypt.
4. Store the password hash with the user record.

During login, bcrypt compares the submitted password with the stored hash.

The application never needs to decrypt the password hash.

Public API responses omit `passwordHash`.

## 5. Access Tokens vs. Refresh Tokens

### Access token

- A signed JWT.
- Short-lived, with a 15-minute expiry in this project.
- Sent to protected API endpoints in the `Authorization: Bearer <token>` header.
- Kept in React memory rather than localStorage.

### Refresh token

- A cryptographically random opaque token, not a JWT.
- Has a seven-day lifetime in this project.
- Sent by the browser in an HttpOnly cookie.
- Stored in the backend repository as a SHA-256 hash rather than as the raw token.
- Used to obtain a new access token when the application restores a session.

The access token is used for API authorization. The refresh token is used to obtain new access credentials.

## 6. Refresh-Token Hashing

The backend generates a random refresh token using Node.js cryptographic randomness.

It calculates a SHA-256 hash before storing the token record.

Conceptually:

`raw token → SHA-256 hash → repository`

When a refresh request arrives, the backend hashes the cookie value and looks up the matching record.

Storing only the hash reduces the impact of someone obtaining the repository contents. A real production system still needs secure persistent storage, access controls, and revocation procedures.

## 7. Refresh-Token Rotation

Rotation replaces the refresh token after a successful refresh.

The implemented flow is:

1. The browser sends its refresh cookie to `/api/auth/refresh`.
2. The backend hashes the token and finds its record.
3. The backend verifies that the record exists and has not expired.
4. The backend retrieves the corresponding user.
5. The old token record is deleted.
6. A new access token and refresh token are generated.
7. The new refresh-token hash is stored.
8. The new refresh token is returned through the cookie; the access token and user are returned in JSON.

An expired, unknown, or invalid refresh token is rejected.

Production systems should use atomic database operations or transactions and consider refresh-token reuse detection to handle concurrent requests safely.

## 8. HttpOnly Cookies

The refresh token is set using an HttpOnly cookie.

Relevant options:

- `httpOnly: true` — prevents ordinary frontend JavaScript from reading the cookie.
- `secure` — requires HTTPS when enabled for production.
- `sameSite: 'lax'` — provides a degree of cross-site request protection.
- `path: '/api/auth'` — limits the paths where the browser sends the cookie.
- `maxAge` — sets the cookie lifetime.

The frontend uses `credentials: 'include'` so browser requests can include the cookie.

The backend CORS configuration allows the frontend origin and credentials. The backend also uses `cookie-parser` to read incoming cookies.

HttpOnly cookies do not eliminate every browser security risk. Production deployment also requires appropriate CSRF protection, HTTPS, and careful origin configuration.

## 9. Login Flow

1. The user submits an email and password.
2. The frontend calls `/api/auth/login`.
3. The backend validates the input.
4. The backend finds the user and verifies the password using bcrypt.
5. The backend generates an access token and refresh token.
6. The backend stores the refresh-token hash.
7. The raw refresh token is set in an HttpOnly cookie.
8. The JSON response contains the access token and public user, not the raw refresh token.
9. React stores the user and access token in context state.

## 10. Session Restoration

React state held only in memory disappears when the browser page reloads.

The application solves this by requesting `/api/auth/refresh` when the `AuthProvider` starts.

The initial state is:

- `user = null`
- `accessToken = null`
- `isLoading = true`

The startup effect requests a refresh. On success, it stores the returned user and access token in React state.

On failure, the application treats the user as logged out.

Finally, it sets `isLoading` to `false`, allowing route guards to make a decision.

The refresh token itself is not read by React; the browser manages the HttpOnly cookie.

## 11. React Context

`AuthContext` shares authentication state and functions with components throughout the application.

The context exposes:

- `user`
- `accessToken`
- `isLoading`
- `login()`
- `logout()`

`AuthProvider` wraps the application. Components call `useAuth()` to access the shared state.

This avoids passing authentication props manually through every component.

## 12. React useEffect and Strict Mode

`useEffect` runs the session-restoration logic after React renders.

The effect includes cleanup to prevent a completed request from updating state after that effect execution has been cleaned up.

React Strict Mode can execute an additional setup-and-cleanup cycle during development.

Because refresh tokens rotate, concurrent refresh calls can interfere with one another. The implementation shares a refresh Promise so overlapping effect executions can reuse the same request.

This is a frontend deduplication measure. Production systems should also handle concurrency and token rotation atomically on the backend.

## 13. Protected Routes

The `ProtectedRoute` component checks authentication and optionally allowed roles.

Its decision sequence is:

1. If `isLoading` is true, show a loading state.
2. If there is no authenticated user, redirect to `/login`.
3. If allowed roles were specified and the user's role is not included, redirect to `/unauthorized`.
4. Otherwise, render the nested route using `Outlet`.

The login redirect saves the original location in navigation state. After login, the application can return the user to the requested page.

## 14. Role-Based Authorization

The project uses these roles:

- `user`
- `moderator`
- `admin`

The frontend can hide links that the current role should not see. For example, the Admin navigation link is shown only to admins.

However, frontend checks are not sufficient for security. A user can manually enter a URL or call the API directly.

The backend therefore uses:

- `authenticate` to verify the access token.
- `authorizeRoles('admin')` to restrict the admin endpoint.

The backend returns an authentication error when a valid authenticated identity is missing, and a forbidden response when an authenticated user lacks the required role.

The frontend provides navigation and presentation; the backend enforces access control.

## 15. Logout

The frontend calls `/api/auth/logout`.

The backend hashes the refresh cookie, deletes its stored token record, and clears the cookie using matching cookie-path settings.

The frontend clears the user and access token from React state.

Revoking a refresh token prevents its reuse for future refreshes. An already-issued access token can remain valid until expiry unless the backend implements additional access-token revocation checks.

## 16. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a normal user |
| POST | `/api/auth/login` | Verify credentials and issue tokens |
| POST | `/api/auth/refresh` | Rotate refresh token and issue access token |
| POST | `/api/auth/logout` | Revoke refresh token and clear cookie |
| GET | `/api/auth/me` | Retrieve the current authenticated user |
| GET | `/api/auth/admin` | Admin-only backend resource |

## 17. Error Handling

Common HTTP statuses:

- `200 OK` — successful login, refresh, logout, or resource request.
- `201 Created` — registration succeeded.
- `400 Bad Request` — invalid request fields.
- `401 Unauthorized` — missing or invalid authentication credentials.
- `403 Forbidden` — authenticated user lacks the required role.
- `404 Not Found` — requested user or resource does not exist.
- `409 Conflict` — registration email already exists.
- `500 Internal Server Error` — unexpected server-side failure.

The frontend displays useful errors without needing to expose secrets or internal server details.

## 18. Current Storage Limitation

The current `UserRepository` stores users and refresh-token records in in-memory Maps.

Consequences:

- Data disappears when the backend restarts.
- Users and sessions do not persist across server restarts.
- In-memory storage is not appropriate for a deployed multi-instance application.

The next persistence step is to migrate the repository to MySQL and use appropriate constraints, indexes, transactions, and secure configuration.

## 19. Verification Completed

The following checks passed during development:

- Backend TypeScript typecheck.
- Backend production build.
- Frontend TypeScript check through `tsc -b`.
- Frontend Vite production build.
- Registration and login.
- Refresh-cookie issuance.
- Session restoration after browser reload.
- Refresh-token rotation.
- Logout and refresh-token revocation.
- Normal-user denial of admin access.
- Admin access to the protected admin page.

## 20. Final Lessons

This assignment connected React authentication state to a real backend session flow.

Key lessons:

1. Authentication and authorization solve different problems.
2. JWT signatures must be verified on the backend.
3. Passwords should be hashed with a suitable password-hashing algorithm.
4. Access tokens and refresh tokens have different responsibilities.
5. Refresh-token rotation must invalidate old tokens.
6. HttpOnly cookies reduce direct JavaScript access to refresh credentials.
7. React Context shares auth state; it does not enforce backend security.
8. Route guards improve user experience but do not replace server authorization.
9. Production systems need persistent storage and concurrency-safe token rotation.
10. Successful builds are important, but runtime behavior must also be tested.
