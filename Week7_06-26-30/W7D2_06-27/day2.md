# GROW BootCamp — Week 6, Day 2
## User Roles, Permissions & Authentication Libraries

**Project:** `rbac-demo`  
**Branch:** `w6d2`  
**Stack:** Node.js, TypeScript, Express.js, Sequelize, MySQL, bcrypt, JSON Web Token (JWT)

---

## 1. Objective

The objective was to understand authentication and authorization, implement role-based access control (RBAC), explore common authentication libraries, and build a protected REST API using TypeScript, Express.js, Sequelize, and MySQL.

## 2. Authentication vs Authorization

**Authentication** verifies who a user is.

Example: A user provides an email and password to log in.

**Authorization** determines what an authenticated user is allowed to do.

Example: An administrator can access the admin dashboard, while a regular user cannot.

| Authentication | Authorization |
|---|---|
| Verifies identity | Checks permissions |
| Happens during login or token verification | Happens when accessing a protected resource |
| Failure commonly returns `401 Unauthorized` | Insufficient permission commonly returns `403 Forbidden` |

## 3. Role-Based Access Control (RBAC)

RBAC assigns permissions according to a user's role instead of checking each user's identity separately.

Our project uses three roles:

- **User:** Can access ordinary user features.
- **Moderator:** Can access moderation features and delete comments in the demonstration permission system.
- **Admin:** Can access administrative features and manage users.

### Role hierarchy used in the project

| Feature | User | Moderator | Admin |
|---|---|---|---|
| View own profile | Yes | Yes | Yes |
| Access moderation dashboard | No | Yes | Yes |
| Access admin dashboard | No | No | Yes |
| Read posts permission | Yes | Yes | Yes |
| Delete comments permission | No | Yes | Yes |
| Manage users permission | No | No | Yes |

The role hierarchy is implemented through explicit middleware rules and a permission mapping; the permissions are not automatically inherited by every role unless configured.

## 4. Project Architecture

The application follows a layered architecture:

- **Model:** Defines the database entity and its fields.
- **Repository:** Encapsulates database queries.
- **Service:** Contains business logic, validation, password hashing and login logic.
- **Controller:** Handles HTTP requests and responses.
- **Routes:** Maps HTTP methods and paths to middleware and controllers.
- **Middleware:** Authenticates requests, authorizes access and handles errors.
- **Configuration:** Loads environment variables and configures the database connection.

### Request flow

`Client → Express Route → Authentication Middleware → Authorization Middleware → Controller → Service/Repository → MySQL → Response`

Each layer has a specific responsibility, making the application easier to maintain and test.

## 5. Database and User Model

We configured a MySQL database named `rbac_demo` and used Sequelize to map the user model to the `users` table.

Important fields include:

- `id`: Unique user identifier.
- `name`: User's name.
- `email`: Unique email address.
- `password_hash`: Hashed password.
- `role`: User role (`user`, `moderator`, or `admin`).
- `created_at` and `updated_at`: Timestamps.

The role is assigned by the server during registration. The client must not be allowed to choose its own administrative role.

The repository provides methods to find users by email or ID, create users, retrieve users without password hashes, and delete users.

## 6. Password Security with bcrypt

Passwords should never be stored as plain text.

During registration, our service hashes the password:

```ts
const passwordHash = await bcrypt.hash(password, 12);
```

During login, it compares the submitted password with the stored hash:

```ts
const isValid = await bcrypt.compare(
  password,
  user.passwordHash
);
```

**Important concepts:**

- Hashing is designed to be one-way; the stored hash is not the original password.
- bcrypt generates and stores salt information as part of its encoded hash.
- The cost factor controls the computational effort required for hashing. Our implementation uses cost factor `12`.
- Password comparison should use `bcrypt.compare()` rather than comparing a new hash string directly with the stored hash.

## 7. JSON Web Tokens (JWT)

JWT allows a server to issue a signed token after successful authentication. The client then sends the token with requests to protected endpoints.

A JWT has three parts:

1. **Header:** Identifies the token type and signing algorithm.
2. **Payload:** Contains claims, such as the subject/user ID and optional metadata.
3. **Signature:** Allows the server to verify that the token was signed with the expected secret or key.

Conceptually:

`Header.Payload.Signature`

Our implementation signs access tokens using `jsonwebtoken`, a secret from environment configuration, the user's ID as the subject (`sub`), and an expiry.

A protected request uses the following header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The authentication middleware:

1. Checks for the `Bearer` authorization header.
2. Extracts the token.
3. Verifies its signature and expiry.
4. Restricts accepted signing algorithms.
5. Validates the token's subject.
6. Loads the current user from MySQL.
7. Attaches the user to the Express request.

The authorization middleware then checks the user's current role or permissions.

**Security note:** Never put passwords or password hashes in a JWT payload. JWT payloads are encoded, not automatically encrypted. Authorization should rely on trusted, verified identity and current permissions—not blindly trust a role claim supplied by a client.

## 8. Authentication and Authorization Middleware

### Authentication

The `authenticate` middleware checks whether the request has a valid access token and whether the corresponding account still exists.

```ts
router.get(
  "/me",
  authenticate,
  userController.me
);
```

A missing, invalid or expired token should be rejected with `401 Unauthorized`.

### Role-based authorization

The `authorizeRoles()` middleware checks whether the authenticated user has one of the permitted roles.

```ts
router.get(
  "/admin/dashboard",
  authenticate,
  authorizeRoles("admin"),
  userController.adminDashboard
);
```

A regular user or moderator receives `403 Forbidden` when attempting to access this admin-only route.

### Permission-based authorization

Our permission middleware maps roles to explicit permissions:

```ts
const ROLE_PERMISSIONS = {
  user: ["read:posts"],
  moderator: ["read:posts", "delete:comments"],
  admin: [
    "read:posts",
    "delete:comments",
    "manage:users"
  ]
};
```

A protected route can require a specific permission:

```ts
router.get(
  "/posts",
  authenticate,
  authorizePermissions("read:posts"),
  userController.posts
);
```

The permission mapping is illustrative of our project's rules; the actual implementation uses TypeScript's `UserRole` and `Permission` types.

**Middleware order matters:** authentication must run before role or permission checks because authorization needs an authenticated user.

## 9. Libraries and Packages

### bcrypt / bcryptjs

- **Purpose:** Password hashing and verification.
- **Use case:** Securely storing passwords and validating login credentials.
- **Difference:** `bcrypt` uses native bindings, while `bcryptjs` is implemented in JavaScript.

### jsonwebtoken

- **Purpose:** Signing and verifying JWTs.
- **Use case:** Creating access tokens after successful login and validating tokens on protected requests.
- **Project usage:** The application creates a signed access token and verifies it in authentication middleware.

### express-jwt

- **Purpose:** Middleware for validating JWTs in Express applications.
- **Use case:** Applications that want JWT verification handled by dedicated middleware rather than implementing all verification steps manually.

### Passport.js and passport-jwt

- **Purpose:** Passport provides an authentication framework with strategies for different authentication mechanisms.
- **Use case:** Passport can support local authentication, JWT authentication and other strategies through suitable plugins.
- **Relationship:** `passport-jwt` is a strategy used with Passport to authenticate requests using JWTs.

### express-session

- **Purpose:** Maintains server-side sessions, usually identified by a session cookie.
- **Use case:** Traditional web applications that store login state in server-managed sessions.

JWT and server-side sessions are different approaches. JWT is commonly used for stateless token-based authentication, while sessions store authentication state on the server. Either approach still requires authorization checks.

## 10. Validation and Error Handling

Our service validates registration and login input, hashes passwords, checks existing email addresses and returns safe user information.

The public response excludes the password hash.

Important responses:

- `201 Created`: Account successfully registered.
- `200 OK`: Successful login or authorized request.
- `400 Bad Request`: Missing or invalid request data.
- `401 Unauthorized`: Missing or invalid authentication credentials.
- `403 Forbidden`: Authenticated user lacks the required permission.
- `404 Not Found`: Requested user does not exist.
- `409 Conflict`: Email already registered.
- `500 Internal Server Error`: Unexpected server-side failure.

The centralized error handler converts known application errors into appropriate HTTP responses without exposing internal error details to clients.

## 11. Practical Implementation and Verification

We implemented and tested the following:

| Test | Observed result |
|---|---|
| TypeScript typecheck | Passed |
| Register a user | `201 Created` |
| Login with correct credentials | `200 OK` |
| Login with incorrect password | `401 Unauthorized` |
| Access `/api/users/me` without a token | `401 Unauthorized` |
| Access `/api/users/me` with a valid token | `200 OK` |
| Regular user accesses moderation/admin routes | `403 Forbidden` |
| Moderator accesses moderation route | `200 OK` |
| Moderator accesses admin dashboard | `403 Forbidden` |
| Moderator uses `delete:comments` permission | `200 OK` for the demonstration endpoint |
| Admin accesses admin dashboard | `200 OK` |
| Access protected route with an invalid token | `401 Unauthorized` |

The results above reflect the manual tests reported during the session. Automated tests for this particular project and successful admin-only user deletion have not been confirmed.

## 12. Key Security Lessons

1. Never store plain-text passwords.
2. Never return password hashes in public API responses.
3. Never trust a role supplied during public registration.
4. Verify JWT signatures and expiry before trusting token claims.
5. Validate the token subject before using it as a database ID.
6. Authenticate before checking roles or permissions.
7. Use `401` for failed authentication and `403` for insufficient authorization.
8. Load current role information from the database when immediate role changes must take effect.
9. Validate request input and handle expected errors consistently.
10. Restrict destructive operations to authorized users and test them only with disposable data.

## 13. Final Summary

Today we developed and manually verified a TypeScript-based RBAC API using Express.js, Sequelize and MySQL. We implemented registration and login, bcrypt password hashing, JWT authentication, role-based access control, permission-based authorization and centralized error handling.

The project demonstrates how authentication establishes a user's identity while authorization controls access to protected resources. We also reviewed commonly used authentication packages, their use cases and the differences between token-based authentication and server-side sessions.

