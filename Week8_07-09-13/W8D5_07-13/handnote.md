# Week 7 Day 2 — Authentication & Role-Based Authorization
## Technical Handnote

## 1. Project Overview

This project implements authentication and role-based authorization using:

- Backend: Node.js, Express, TypeScript
- Frontend: React, TypeScript, Vite
- Database: MySQL
- Database driver: mysql2
- Authentication: JSON Web Token (JWT)
- Password security: bcrypt
- Refresh-token security: Cryptographically random tokens and SHA-256 hashing
- Session management: HttpOnly cookies
- Routing: React Router

The original backend used in-memory Maps to store users and refresh-token records. We migrated this storage to MySQL so that application data and sessions persist even after the backend restarts.

The existing authentication and authorization logic was preserved during the migration.

---

## 2. Authentication vs Authorization

These two terms are related, but they solve different problems.

### Authentication = Who are you?

Authentication verifies a user's identity.

For example:
- A user submits an email and password.
- The backend retrieves the user from MySQL.
- bcrypt compares the submitted password with the stored password hash.
- If valid, the backend issues authentication tokens.

### Authorization = What are you allowed to do?

Authorization determines which resources and operations an authenticated user can access.

Our application uses three roles:

- user
- moderator
- admin

For example:
- A normal user can access the dashboard.
- An admin can access the dashboard and admin-protected functionality.
- A normal user cannot access admin-only backend endpoints.

### Frontend vs Backend Security

Frontend responsibilities:
- Hide unavailable navigation links.
- Redirect unauthenticated visitors.
- Display role-specific UI.
- Show unauthorized messages.

Backend responsibilities:
- Verify JWT signatures and expiration.
- Identify the authenticated user.
- Verify roles and permissions.
- Reject unauthorized API requests.

**Golden rule:** Frontend authorization is not a security boundary. Backend authorization is mandatory.

Checking whether a token exists is not equivalent to proving that it is valid. The backend must verify the token before granting access to protected resources.

---

## 3. Password Hashing with bcrypt

Passwords should never be stored as plain text.

During registration:

1. The user submits a password.
2. bcrypt hashes the password.
3. The resulting hash is stored in the database.
4. The original password is not stored.

During login:

1. The backend retrieves the user using their email.
2. bcrypt compares the submitted password with the stored hash.
3. If the comparison succeeds, authentication continues.

Important distinction:

- Hashing is a one-way process.
- Encryption is designed to be reversible using the appropriate key.
- Password verification uses bcrypt comparison, not password decryption.

The database column is named `password_hash`.

---

## 4. JWT Authentication

JWT stands for JSON Web Token.

It allows the backend to issue a signed token representing an authenticated user.

A JWT has three sections:

1. Header
2. Payload
3. Signature

They are separated by dots:

header.payload.signature

### Header

Contains token metadata, including the signing algorithm.

### Payload

Contains claims about the authenticated user.

Our authentication flow uses the user's ID and role in the token payload.

For example, the conceptual payload is:

- sub: user ID
- role: user's role

### Signature

The signature allows the backend to verify that the token was signed using the expected secret and has not been modified.

A signed JWT is not automatically encrypted. Its payload should not contain passwords or other secrets.

### Access Token

The access token:

- Is used to access protected API endpoints.
- Is sent through the Authorization header.
- Uses the Bearer authentication scheme.
- Has a configured lifetime of 15 minutes in this project.

Example header:

Authorization: Bearer ACCESS_TOKEN

The backend verifies the token before allowing access to protected routes.

---

## 5. Access Token vs Refresh Token

Our implementation uses two different tokens.

### Access Token

Purpose:
- Authorize API requests.
- Provide short-lived authenticated access.

Characteristics:
- JWT.
- Short lifetime: 15 minutes.
- Kept in React application memory.
- Sent through the Authorization header.

### Refresh Token

Purpose:
- Obtain a new access token after the access token expires.
- Restore an existing session when the frontend application starts.

Characteristics:
- Opaque, cryptographically random token.
- Not a JWT.
- Stored in an HttpOnly cookie.
- Has a configured lifetime of 7 days.
- Its SHA-256 hash is stored in MySQL.

The browser sends the refresh-token cookie to the backend when making eligible requests.

JavaScript cannot directly read an HttpOnly cookie.

---

## 6. Why We Use Two Tokens

Using a short-lived access token reduces the period during which an exposed access token can be used.

The refresh token allows the user to continue their session without entering credentials every time the access token expires.

The two tokens have different responsibilities:

Access token = API access.

Refresh token = obtain a new access token.

The refresh token is more sensitive because it can be used to obtain new access tokens. Therefore, we store only its hash in the database and use an HttpOnly cookie for browser transport.

---

## 7. Refresh Token Generation and Hashing

Our refresh-token implementation follows this process:

1. Generate a cryptographically random token.
2. Return the original token through an HttpOnly cookie.
3. Calculate its SHA-256 hash.
4. Store the hash, user ID, and expiration timestamp in MySQL.

Conceptually:

Original refresh token
        |
        v
    SHA-256
        |
        v
   Token hash
        |
        v
  MySQL database

The original refresh token is not stored in the database.

When the browser later sends the original token:

1. The backend hashes the received token.
2. It searches MySQL using that hash.
3. It checks whether the record exists and is still valid.
4. It verifies the associated user.
5. It issues a new access token if validation succeeds.

---

## 8. Refresh Token Rotation

Refresh-token rotation means replacing an existing refresh token with a new one whenever the refresh endpoint successfully processes it.

Our implementation:

1. Browser sends the existing refresh token.
2. Backend calculates its SHA-256 hash.
3. Backend searches for the corresponding database record.
4. Backend validates the token and its expiration.
5. Backend removes the old refresh-token record.
6. Backend generates a new refresh token.
7. Backend stores the new token's hash.
8. Backend issues a new access token.
9. Backend sends the new refresh token through the HttpOnly cookie.

Conceptually:

Old refresh token
        |
        v
Validate old token
        |
        v
Delete old token record
        |
        v
Generate new refresh token
        |
        v
Store new token hash
        |
        v
Issue new access token

The previous refresh token becomes invalid after successful rotation.

This limits the usefulness of a previously issued refresh token.

---

## 9. Logout and Refresh Token Revocation

Logout must invalidate the refresh-token session.

Our logout implementation:

1. Receives the refresh-token cookie.
2. Hashes the original refresh token.
3. Finds the corresponding record in MySQL.
4. Deletes the record.
5. Clears the refresh-token cookie.

After deletion, the old refresh token cannot be used to obtain another access token.

The database operation is important because deleting a browser cookie alone does not revoke a token that might have been copied earlier.

---

## 10. React Authentication Context

The frontend uses React Context to share authentication state across components.

The AuthContext provides shared information such as:

- Current user
- Access token
- Loading state
- Login functionality
- Logout functionality

The AuthProvider wraps the application so that components can access authentication state without passing props through every component.

### Why use Context?

Without Context, authentication information would need to be passed through multiple component levels.

Context makes shared authentication state accessible throughout the component tree.

### Why keep the access token in memory?

Our implementation keeps the access token in React memory rather than localStorage.

This means the token is not intentionally persisted in browser local storage.

When the application reloads, the frontend restores the session using the refresh-token cookie.

---

## 11. Restoring Authentication on Application Startup

When the application starts:

1. AuthProvider begins with a loading state.
2. Its useEffect initiates session restoration.
3. The frontend sends a request to the refresh endpoint.
4. The browser includes the refresh-token cookie.
5. The backend validates the token using MySQL.
6. The backend rotates the refresh token.
7. The backend issues a new access token.
8. The frontend updates authentication state.
9. The loading state finishes.

This prevents the frontend from immediately treating a user as unauthenticated while session restoration is still in progress.

### Shared Refresh Promise

React Strict Mode can expose duplicate effect execution during development.

Our implementation uses a shared module-level refresh Promise to prevent multiple simultaneous session-restoration requests from independently performing refresh operations.

Requests that need the same refresh operation can share its Promise instead of starting separate refresh operations.

---

## 12. Protected Routes and Role-Based UI

React Router is used to control which pages are accessible.

### ProtectedRoute

The protected route checks authentication state.

- If authentication is still loading, it waits.
- If the user is unauthenticated, it redirects to login.
- If authenticated, it renders the protected route using Outlet.

### Role-Based Authorization

Role checks determine whether a user should access a particular frontend section.

For example:

- Normal user: dashboard.
- Admin: dashboard and admin panel.

If the user's role is insufficient, the application displays or redirects to the unauthorized page.

However, frontend route protection is only a user-experience feature. The backend must independently enforce authorization.

---

## 13. Backend Middleware

### Authentication Middleware

The authentication middleware:

1. Reads the Authorization header.
2. Extracts the Bearer token.
3. Verifies the JWT signature and expiration.
4. Identifies the authenticated user.
5. Attaches authenticated information to the request.
6. Passes control to the next middleware or route handler.

### Authorization Middleware

The authorization middleware checks whether the authenticated user's role is permitted to access the requested endpoint.

For example:

- A user with the admin role can access admin-only routes.
- A normal user receives an authorization error when attempting to access an admin-only route.

### 401 vs 403

401 Unauthorized:
The request does not have valid authentication credentials.

Examples:
- Missing token.
- Invalid token.
- Expired access token.

403 Forbidden:
The user is authenticated but does not have sufficient permission.

Example:
- A normal user attempts to access an admin-only endpoint.

---

# PART TWO — MYSQL DATABASE MIGRATION

## 14. Why We Migrated from In-Memory Storage

The original implementation used JavaScript Maps for storing:

- Users.
- Refresh-token records.

An in-memory Map stores information in the running Node.js process.

Problem:

When the backend process stops or restarts, the stored data disappears.

This is unsuitable for persistent application accounts and sessions.

We migrated the storage layer to MySQL.

### Before Migration

AuthService
    |
    v
UserRepository
    |
    v
JavaScript Maps
    |
    v
Process memory

### After Migration

AuthService
    |
    v
UserRepository
    |
    v
mysql2
    |
    v
MySQL database

The business logic and repository interface were preserved while the storage implementation changed.

---

## 15. MySQL Database Structure

Database name:

week7_auth_demo

We created two tables.

### users

| Column | Purpose |
|---|---|
| id | Unique user identifier |
| name | User's name |
| email | Unique email address |
| password_hash | bcrypt password hash |
| role | user, moderator, or admin |
| created_at | Registration timestamp |

Important constraints:

- `id` is the primary key.
- `email` has a unique constraint.
- `role` uses an ENUM.
- `password_hash` stores the hashed password.

### refresh_tokens

| Column | Purpose |
|---|---|
| token_hash | SHA-256 hash of refresh token |
| user_id | Associated user ID |
| expires_at | Expiration timestamp |
| created_at | Token creation timestamp |

Important constraints:

- `token_hash` is the primary key.
- `user_id` references `users(id)`.
- The foreign key uses `ON DELETE CASCADE`.
- Indexes support queries by user ID and expiration.

### Relationship

One user can have multiple refresh-token records over time or across sessions.

Relationship:

users (1) -------- (many) refresh_tokens

The `user_id` foreign key connects each refresh-token record to its user.

---

## 16. MySQL Connection Pool

We implemented the database connection in:

src/config/database.ts

We use:

mysql2/promise

The database configuration reads connection details from environment variables:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

### Why use a connection pool?

A connection pool maintains reusable database connections.

Instead of opening and closing a new connection for every query, the application can reuse available connections.

Our configuration includes:

- waitForConnections
- connectionLimit
- queueLimit
- enableKeepAlive

The connection pool is shared by the repository.

---

## 17. Environment Variables

The backend `.env` file contains database configuration.

Example:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=week7_auth_demo

The actual password must remain local and must not be committed to Git.

Environment variables separate configuration and secrets from application source code.

---

## 18. UserRepository — Database Implementation

File:

src/repos/user.repo.ts

The MySQL repository implements the database operations required by the authentication service.

### findByEmail(email)

- Normalizes the email.
- Queries the users table.
- Returns the matching user or null.

### findById(id)

- Searches by user ID.
- Returns the user or null.

### create(user)

- Inserts a new user into MySQL.
- Stores the password hash, not the original password.
- Returns the created user data.

### saveRefreshToken(record)

- Inserts a refresh-token hash.
- Associates it with the user ID.
- Stores its expiration timestamp.

### findRefreshToken(tokenHash)

- Searches for a refresh-token record.
- Returns the associated user ID and expiry information.

### deleteRefreshToken(tokenHash)

- Deletes the matching refresh-token record.

### Parameterized Queries

We use placeholders such as `?` in SQL queries.

Example:

SELECT id, name, email
FROM users
WHERE email = ?
LIMIT 1

Values are passed separately to the database driver.

This helps prevent SQL injection by avoiding direct insertion of user input into SQL strings.

---

## 19. Why We Preserved the Repository Pattern

The repository separates database operations from business logic.

AuthService should not need to know whether users are stored in:

- A JavaScript Map.
- MySQL.
- PostgreSQL.
- Another storage system.

It calls repository methods instead.

This means the storage implementation can change without rewriting the authentication flow, provided the repository interface remains compatible.

We retained the original in-memory repository as a reference:

src/repos/InMemouser.repo.ts

The active routes and service import:

src/repos/user.repo.ts

The active implementation uses MySQL.

---

## 20. MySQL Persistence Verification

We manually verified the migration using MySQL CLI and Postman.

### Registration

A test user was registered successfully.

The record appeared in:

users

### Refresh Token Persistence

A refresh-token record appeared in:

refresh_tokens

The database stored its hash rather than the original token.

### Refresh Rotation

Verified:

- Old refresh-token record was invalidated.
- New refresh-token hash was stored.
- User association remained correct.

### Logout

Verified:

- The refresh-token record was deleted.
- The old token could no longer be used to restore a session.

### Backend Restart

Verified:

- User data remained in MySQL after restarting the backend.
- A previously issued refresh-token session could be restored.
- A new access token was generated.

These checks demonstrate that the MySQL-backed authentication flow works across backend restarts.

---

## 21. CORS and Cookie Configuration

The frontend and backend run on different development ports.

Frontend:

http://localhost:5173

Backend:

http://localhost:5000

The backend must allow the frontend origin and credentials.

Our implementation uses:

- CORS with the frontend origin.
- `credentials: true`.
- Cookie parsing middleware.
- HttpOnly refresh-token cookies.

The frontend API requests that need cookies use:

credentials: "include"

For production, cookie security settings, HTTPS, SameSite policy, domain configuration, and CSRF protection must be reviewed according to the deployment environment.

---

## 22. Important Concepts to Remember

| Concept | Meaning |
|---|---|
| Authentication | Verifies identity |
| Authorization | Checks access permissions |
| JWT | Signed token carrying claims |
| Access token | Short-lived API authorization token |
| Refresh token | Used to obtain a new access token |
| bcrypt | Password hashing |
| SHA-256 | Hashing used for refresh-token storage |
| HttpOnly | Prevents JavaScript from reading a cookie |
| React Context | Shares authentication state |
| useEffect | Handles side effects such as session restoration |
| Outlet | Renders matched nested routes |
| Middleware | Processes requests before route handlers |
| Connection pool | Reuses database connections |
| Repository | Separates persistence from business logic |
| Foreign key | Enforces a relationship between database tables |
| Parameterized query | Separates SQL structure from supplied values |
| Token rotation | Replaces an existing refresh token with a new one |

---

## 23. Final Project Understanding

The complete authentication flow:

### Registration

React UI
    |
    v
Registration API
    |
    v
AuthService
    |
    v
bcrypt password hashing
    |
    v
UserRepository
    |
    v
MySQL users table

### Login

React UI
    |
    v
Login API
    |
    v
AuthService
    |
    v
Find user and verify password
    |
    v
Generate access and refresh tokens
    |
    v
Store refresh-token hash in MySQL
    |
    v
Send access token and HttpOnly cookie

### Protected API Request

React UI
    |
    v
Authorization: Bearer ACCESS_TOKEN
    |
    v
Authentication middleware
    |
    v
JWT verification
    |
    v
Authorization middleware (when required)
    |
    v
Protected route

### Session Refresh

Browser sends refresh cookie
    |
    v
Refresh API
    |
    v
Hash token and query MySQL
    |
    v
Validate token
    |
    v
Rotate refresh token
    |
    v
Issue new access token

### Logout

Browser sends refresh cookie
    |
    v
Logout API
    |
    v
Find token hash
    |
    v
Delete refresh-token record
    |
    v
Clear cookie

---

## 24. Final Implementation Status

Completed:

- JWT authentication.
- bcrypt password hashing.
- Access-token handling.
- Refresh-token generation.
- Refresh-token hashing and storage.
- HttpOnly refresh-token cookies.
- Refresh-token rotation.
- Logout revocation.
- React authentication context.
- Session restoration.
- Protected routes.
- Role-based frontend access.
- Backend role authorization.
- MySQL database integration.
- Persistent users and refresh-token records.
- Session restoration after backend restart.
- TypeScript typecheck.
- Production build.
- Manual Postman and MySQL verification.

Automated tests were intentionally excluded from this migration's final scope.

The old in-memory repository remains as a reference implementation, while the active application uses the MySQL repository.

**Main takeaway:** We changed the persistence layer without needing to redesign the entire authentication system. The repository pattern allowed us to move from process memory to MySQL while preserving the authentication service and its responsibilities.