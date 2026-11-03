# Week 7 Day 2 — Learning Log

**Topic:** Authentication & Role-Based Authorization in React with JWT and MySQL

## 1. Objective

Integrate the React frontend with the JWT authentication backend and implement protected routes, role-based access control, session management, and persistent database storage.

## 2. Work Completed

### 2.1 Frontend Authentication Integration

- Integrated the React frontend with the Express authentication backend.
- Configured the API base URL using Vite environment variables.
- Implemented API requests with Bearer access-token authentication.
- Configured credential-based requests for HttpOnly refresh-token cookies.

### 2.2 Authentication Context

- Created an AuthContext to share authentication state across components.
- Implemented AuthProvider to manage the authenticated user, access token, and loading state.
- Implemented login and logout functionality through the shared authentication context.
- Kept the access token in React memory instead of localStorage.
- Used useEffect to restore the user's session when the application starts.
- Implemented a shared refresh Promise to prevent duplicate simultaneous session-restoration requests during React Strict Mode development.

### 2.3 Protected Routes

- Implemented ProtectedRoute using React Router.
- Redirected unauthenticated users to the login page.
- Preserved the originally requested route for post-login navigation.
- Used Outlet to render authorized nested routes.
- Implemented unauthorized access handling.

### 2.4 Role-Based Authorization

- Implemented role-aware frontend navigation and protected UI.
- Supported three roles: `user`, `moderator`, and `admin`.
- Restricted admin-specific frontend sections based on the authenticated user's role.
- Used backend authentication and authorization middleware to enforce actual API access restrictions.
- Maintained the distinction between authentication and authorization.

### 2.5 Access Token and Refresh Token Management

- Implemented short-lived JWT access tokens with a configured 15-minute lifetime.
- Used opaque, cryptographically random refresh tokens with a configured 7-day lifetime.
- Stored the refresh token in an HttpOnly cookie.
- Stored only the SHA-256 hash of the refresh token in the database.
- Implemented refresh-token validation and rotation.
- Invalidated the previous refresh-token record after successful rotation.
- Implemented logout revocation and cookie clearing.
- Verified session restoration through the refresh endpoint.

### 2.6 Migration from In-Memory Storage to MySQL

Initially, the backend used JavaScript Maps to store users and refresh-token records. This meant that application data disappeared when the backend process restarted.

Migrated the persistence layer to MySQL while preserving the existing authentication service and repository responsibilities.

**Database configuration:**

- Installed and configured `mysql2`.
- Created a MySQL connection pool in `src/config/database.ts`.
- Configured database credentials through environment variables.
- Verified the database connection successfully.

**Database schema:**

Created the `week7_auth_demo` database with two tables:

1. `users`
   - Stores user IDs, names, email addresses, password hashes, roles, and creation timestamps.
   - Uses a unique constraint on email.

2. `refresh_tokens`
   - Stores refresh-token hashes, associated user IDs, expiration timestamps, and creation timestamps.
   - Uses a foreign key referencing `users(id)`.
   - Includes indexes for user IDs and token expiration.

**Repository implementation:**

- Preserved the original in-memory repository as a reference.
- Created a new MySQL-backed `user.repo.ts`.
- Implemented `findByEmail()` to retrieve users by normalized email.
- Implemented `findById()` to retrieve users by ID.
- Implemented `create()` to persist new users.
- Implemented `saveRefreshToken()` to store refresh-token hashes.
- Implemented `findRefreshToken()` to retrieve refresh-token records.
- Implemented `deleteRefreshToken()` to revoke refresh-token records.
- Used parameterized SQL queries for database operations.

The active authentication routes and service now import the MySQL repository rather than the in-memory implementation.

### 2.7 Database Persistence Verification

Manually verified the database-backed authentication lifecycle using Postman and MySQL CLI.

- Confirmed that registration creates a persistent user record.
- Confirmed that refresh-token hashes are stored in MySQL.
- Verified successful refresh-token rotation.
- Verified that logout deletes the corresponding refresh-token record.
- Confirmed that user records remain after restarting the backend.
- Verified that an existing refresh-token session can be restored after a backend restart.
- Confirmed that session restoration generates a new access token.

### 2.8 Cleanup and Build Verification

- Removed the temporary MySQL connection-test file.
- Verified that the `.gitignore` file excludes environment secrets.
- Confirmed that active imports use the MySQL repository.
- Retained the old in-memory repository only as a reference.
- Successfully completed TypeScript type checking.
- Successfully completed the production TypeScript build.

## 3. Important Concepts Practiced

- Authentication vs authorization.
- JWT structure, signing, and verification.
- bcrypt password hashing.
- Access-token and refresh-token responsibilities.
- SHA-256 refresh-token hashing.
- Refresh-token rotation and revocation.
- HttpOnly cookies.
- React Context API.
- useState and useEffect.
- React Strict Mode behavior.
- Protected routes and nested routing.
- Express authentication and authorization middleware.
- Repository pattern.
- MySQL connection pooling.
- Relational database design and foreign keys.
- Parameterized SQL queries.
- Persistent session management.

## 4. Verification Results

| Verification | Status |
|---|---|
| Frontend authentication integration | Completed |
| Authentication context | Completed |
| Protected routes | Completed |
| Role-based frontend access | Completed |
| Backend authorization | Completed |
| JWT access-token handling | Passed |
| Refresh-token generation and storage | Passed |
| Refresh-token rotation | Passed |
| Logout revocation | Passed |
| MySQL connection | Passed |
| User registration persistence | Passed |
| Refresh-token persistence | Passed |
| User persistence after backend restart | Passed |
| Session restoration after backend restart | Passed |
| TypeScript typecheck | Passed |
| Production build | Passed |

**Testing approach:** Manual verification using Postman and MySQL CLI. Automated tests were intentionally excluded from the final migration scope.

## 5. Final Outcome

Successfully completed the React authentication and role-based authorization implementation and migrated the backend persistence layer from in-memory Maps to MySQL.

The application now supports persistent user records and refresh-token sessions across backend restarts while retaining JWT authentication, refresh-token rotation, logout revocation, and role-based backend authorization.

**Final implementation status: Completed.**