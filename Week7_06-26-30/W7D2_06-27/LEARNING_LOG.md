# Learning Log — Week 6, Day 2
## Topic: User Roles, Permissions & Authentication Libraries

**Project:** RBAC Demo  
**Technology Stack:** Node.js, TypeScript, Express.js, Sequelize, MySQL, bcrypt, jsonwebtoken  
**Branch:** `w6d2`  
**Date:** 14 October 2026

---

## 1. Learning Objectives

The objectives of today's session were to:

- Understand the difference between authentication and authorization.
- Implement role-based access control (RBAC) for protected API routes.
- Implement permission-based access control.
- Secure user registration and login using password hashing and JWT authentication.
- Explore authentication and authorization libraries commonly used in Node.js applications.
- Manually verify that users can access only the routes permitted by their roles and permissions.

## 2. Key Concepts Learned

### 2.1 Authentication vs. Authorization

**Authentication** verifies the identity of a user. For example, logging in with an email and password verifies the user's credentials.

**Authorization** determines what an authenticated user is allowed to access or perform.

Example:
- Authentication confirms that a user has logged in successfully.
- Authorization determines whether that user can access an administrator dashboard.

Authentication is performed before authorization in our protected-route workflow.

### 2.2 Role-Based Access Control (RBAC)

RBAC assigns roles to users and uses those roles to control access to application resources.

The project uses three roles:

| Role | Access |
|---|---|
| `user` | Basic authenticated-user routes |
| `moderator` | Basic routes and moderation routes |
| `admin` | Basic routes, moderation routes, and administrator routes |

A user's role is stored in the database. Public registration assigns the `user` role by default, preventing users from granting themselves elevated privileges by submitting a different role during registration.

### 2.3 Permission-Based Access Control

Roles represent a user's position or responsibility, while permissions represent specific actions that the user can perform.

The project defines these permissions:

- `read:posts`
- `delete:comments`
- `manage:users`

The application maps roles to permissions:

- **User:** `read:posts`
- **Moderator:** `read:posts`, `delete:comments`
- **Admin:** `read:posts`, `delete:comments`, `manage:users`

This approach allows the application to protect routes based on required actions instead of relying exclusively on role names.

## 3. Project Architecture and Request Flow

The project separates responsibilities across different layers:

- **Routes:** Define API endpoints and attach middleware.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Implement authentication and business logic.
- **Repositories:** Handle database queries through Sequelize.
- **Models:** Define the structure of database records.
- **Middleware:** Performs authentication, role checks, and permission checks.
- **Utilities:** Provide reusable error-handling and JWT functionality.

### Protected Request Workflow

Client Request → Express Route → Authentication Middleware → Authorization Middleware → Controller → Service/Repository → MySQL Database → HTTP Response

For example, an administrator-only request must first contain a valid access token. The application then identifies the current user and checks whether their database role is `admin`. If authorization succeeds, the request continues to the controller.

## 4. Database and User Model

We configured a Sequelize `User` model connected to the MySQL database `rbac_demo`.

The `users` table includes:

- `id`
- `name`
- `email`
- `password_hash`
- `role`
- `createdAt`
- `updatedAt`

The model uses Sequelize timestamps and maps application properties to underscored database column names where configured.

The repository layer provides operations such as:

- Finding a user by email.
- Finding a user by ID.
- Creating a user.
- Retrieving users without password hashes.
- Deleting a user by ID.

The repository's safe-user queries exclude `passwordHash`, helping prevent password hashes from being returned in ordinary API responses.

## 5. Password Security with bcrypt

Passwords should not be stored as plain text. We used `bcrypt` to hash passwords before saving them.

Registration uses:

```ts
const passwordHash = await bcrypt.hash(password, 12);
```

During login, the submitted password is compared with the stored hash:

```ts
const isPasswordValid = await bcrypt.compare(
  password,
  user.passwordHash
);
```

The value `12` is the configured bcrypt cost factor in this project. bcrypt automatically handles the salt as part of its hashing process.

**Important:** Password hashing is not the same as encryption. Hashing is designed to be one-way, while encryption is intended to be reversible with the appropriate key.

## 6. JSON Web Token (JWT) Authentication

After successful registration or login, the server issues a JWT access token.

A JWT commonly contains three parts:

1. **Header:** Identifies the token type and signing algorithm.
2. **Payload:** Contains claims such as the subject identifying the user and token timestamps.
3. **Signature:** Helps the server verify that the token was signed using the expected secret or key.

The token is sent to protected endpoints using the HTTP Authorization header:

```http
Authorization: Bearer <access_token>
```

The authentication middleware:

1. Reads the Authorization header.
2. Checks for a Bearer token.
3. Verifies the token signature and permitted algorithm.
4. Validates the token's user identifier.
5. Loads the current user from the database.
6. Attaches the authenticated user to the request.
7. Returns `401 Unauthorized` if authentication fails.

The application loads the user from the database instead of relying solely on a role claim in the token. This helps ensure that role changes in the database take effect after the user authenticates again and obtains a new token.

JWT payloads are generally readable by anyone who possesses the token. Sensitive information, including passwords and password hashes, must never be placed in the payload.

## 7. Authentication and Authorization Middleware

### 7.1 Authentication Middleware

The authentication middleware establishes the identity of the current user.

Example usage:

```ts
router.get("/me", authenticate, userController.me);
```

Expected behavior:

- Missing token: `401 Unauthorized`
- Invalid token: `401 Unauthorized`
- Valid token with an existing user: request continues

### 7.2 Role Authorization Middleware

The `authorizeRoles()` middleware restricts access according to the user's role.

Examples:

```ts
router.get(
  "/moderation",
  authenticate,
  authorizeRoles("moderator", "admin"),
  userController.moderationDashboard
);
```

```ts
router.get(
  "/admin/dashboard",
  authenticate,
  authorizeRoles("admin"),
  userController.adminDashboard
);
```

A user who is authenticated but lacks the required role receives `403 Forbidden`.

### 7.3 Permission Authorization Middleware

The `authorizePermissions()` middleware checks whether the current user's role includes the required permission.

Example:

```ts
router.get(
  "/posts",
  authenticate,
  authorizePermissions("read:posts"),
  userController.posts
);
```

Another example:

```ts
router.delete(
  "/comments/:id",
  authenticate,
  authorizePermissions("delete:comments"),
  userController.deleteComment
);
```

The comments deletion endpoint is a demonstration of authorization. It does not represent a complete comment-management feature unless actual comment persistence and deletion logic are implemented.

**Important distinction:**

- `401 Unauthorized` means the request lacks valid authentication.
- `403 Forbidden` means the user is authenticated but does not have the required access.

## 8. API Endpoints Implemented

| Method | Endpoint | Access Requirement |
|---|---|---|
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/users/me` | Authenticated user |
| `GET` | `/api/users/moderation` | Moderator or admin |
| `GET` | `/api/users/admin/dashboard` | Admin only |
| `GET` | `/api/users/posts` | `read:posts` permission |
| `DELETE` | `/api/users/comments/:id` | `delete:comments` permission |
| `DELETE` | `/api/users/:id` | `manage:users` permission |

The comment-deletion endpoint is a permission-checking demonstration. The user-deletion endpoint was prepared as an admin-permission example; successful manual verification of that endpoint has not yet been confirmed.

## 9. Authentication and Authorization Packages Reviewed

### 9.1 bcrypt

**Purpose:** Password hashing and password verification.

- Hashes passwords before database storage.
- Compares submitted passwords against stored hashes.
- Used directly in our registration and login workflow.

### 9.2 jsonwebtoken

**Purpose:** Creating and verifying JSON Web Tokens.

- Signs tokens after successful authentication.
- Verifies signatures and token validity.
- Used by our project to issue and validate access tokens.

### 9.3 express-jwt

**Purpose:** Express middleware for JWT validation.

- Can validate JWTs on protected routes.
- Can populate request authentication information.
- Provides an alternative to writing all JWT-validation middleware manually.

Our project uses `jsonwebtoken` directly with custom Express middleware rather than depending on `express-jwt`.

### 9.4 Passport.js and passport-jwt

**Purpose:** Authentication framework and JWT authentication strategy.

- Passport.js provides a flexible authentication framework.
- `passport-jwt` allows Passport to authenticate requests using JWTs.
- Passport can support multiple authentication strategies.

These packages offer an alternative architecture to the custom authentication middleware implemented in this project.

### 9.5 express-session

**Purpose:** Session-based authentication.

- Maintains server-side session state.
- Commonly uses a session cookie to identify the user's session.
- Differs from a typical stateless JWT access-token workflow.

For production use, session-based systems should use an appropriate persistent session store rather than relying on the default in-memory store.

## 10. Input Validation and Error Handling

The application validates registration and login inputs before performing the relevant operations.

Examples of validation and error-handling behavior include:

- Missing or incorrectly typed request fields are rejected.
- Passwords must satisfy the configured minimum length.
- Email addresses are normalized to lowercase.
- Duplicate email registration is rejected.
- Invalid login credentials return `401 Unauthorized`.
- Missing resources can return `404 Not Found`.
- Duplicate email conflicts can return `409 Conflict`.
- Unexpected server errors are handled by the centralized error handler.

Validation should be applied at the appropriate boundaries, and database constraints should remain in place as an additional safeguard.

## 11. Manual Verification Results

The following behaviors were manually tested.

| Test | Expected Result | Observed Result |
|---|---|---|
| Register a new user | `201 Created` | Passed |
| Login with correct credentials | `200 OK` | Passed |
| Login with an incorrect password | `401 Unauthorized` | Passed |
| Access `/api/users/me` without a token | `401 Unauthorized` | Passed |
| Access `/api/users/me` with a valid token | `200 OK` | Passed |
| Regular user accesses moderation route | `403 Forbidden` | Passed |
| Regular user accesses admin dashboard | `403 Forbidden` | Passed |
| Moderator accesses moderation route | `200 OK` | Passed |
| Moderator accesses admin dashboard | `403 Forbidden` | Passed |
| Moderator uses comment-deletion demo route | `200 OK` | Passed |
| Admin accesses admin dashboard | `200 OK` | Passed |
| Access `/api/users/me` with an invalid token | `401 Unauthorized` | Passed |
| Admin-only user deletion | Successful deletion | Not yet confirmed |

The role tests were performed after changing the user's role in MySQL and logging in again to obtain a fresh token.

The successful response from the comment-deletion demonstration verifies the permission middleware's access decision; it does not prove that a real comment was deleted from a database.

## 12. Key Security Lessons

1. Never store plain-text passwords.
2. Never trust a role supplied by a public registration request.
3. Authenticate a request before applying role or permission checks.
4. Use `401` for failed authentication and `403` for insufficient permissions.
5. Verify JWT signatures and restrict the accepted signing algorithm.
6. Validate token claims before using them.
7. Avoid exposing password hashes in API responses.
8. Do not place secrets or sensitive data in a JWT payload.
9. Protect administrative actions with explicit authorization checks.
10. Keep JWT secrets in environment variables and use a strong secret.
11. Use HTTPS in production to protect tokens in transit.
12. Treat access tokens as sensitive credentials and avoid sharing them in logs, screenshots, or public messages.

## 13. Problems and Verification Notes

- Confirmed that the TypeScript type-check command passes.
- Confirmed that the MySQL connection succeeds and Sequelize creates the `users` table.
- Confirmed the main registration, login, authentication, role-authorization, and permission-authorization flows through manual requests.
- Automated tests were intentionally skipped for this session because testing logic had been covered previously. Automated test coverage for this specific project has not been independently confirmed.
- The admin-only user-deletion endpoint still needs manual verification if it is to be reported as tested.
- The daily learning log, Git commit/push, pull request, and posting of the relevant links must be completed and verified separately.

## 14. Overall Learning Outcome

Today's work focused on implementing a layered authentication and authorization system in an Express.js and TypeScript application.

The project now demonstrates secure password hashing, JWT-based authentication, database-backed user identification, role-based access control, permission-based access control, and consistent HTTP authorization responses.

The implementation was manually verified for the main required authentication and authorization flows. The remaining work is to finalize the learning-log file in the repository, commit and push the changes, raise the pull request, and share the required links with the mentor through the designated project task and Microsoft Teams.

