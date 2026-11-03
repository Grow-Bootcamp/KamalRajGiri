# Week 7 Day 2 — Authentication & Role-Based Authorization

A full-stack authentication and authorization demo built with React, TypeScript, Express, JWT, and MySQL.

The project demonstrates user registration, login, protected routes, role-based authorization, access-token management, refresh-token rotation, logout revocation, and persistent session storage.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- React Context API

### Backend
- Node.js
- Express 5
- TypeScript
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- cookie-parser
- CORS

### Database
- MySQL
- mysql2/promise

### Development Tools
- tsx
- TypeScript

## Features

### Authentication
- User registration and login.
- bcrypt password hashing.
- JWT access tokens.
- Short-lived access tokens (15 minutes).
- Opaque refresh tokens.
- Refresh tokens stored as SHA-256 hashes.
- HttpOnly refresh-token cookies.
- Automatic session restoration.

### Refresh Token Management
- Refresh-token validation.
- Refresh-token rotation.
- Previous refresh-token invalidation.
- Logout revocation.
- Persistent refresh-token storage in MySQL.

### Authorization
- Role-based access control.
- Supported roles:
  - `user`
  - `moderator`
  - `admin`
- Protected frontend routes.
- Backend authentication middleware.
- Backend role authorization middleware.
- Unauthorized access handling.

### Database
- Persistent user records.
- Persistent refresh-token records.
- Unique email constraint.
- Foreign-key relationship between users and refresh tokens.
- MySQL connection pooling.
- Parameterized SQL queries.

## Project Structure

```text
Week7-auth-demo/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── ...
│   ├── .env
│   └── package.json
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── database.ts
    │   │
    │   ├── middleware/
    │   │   ├── auth.middleware.ts
    │   │   └── authorize.middleware.ts
    │   │
    │   ├── repos/
    │   │   ├── user.repo.ts
    │   │   └── InMemouser.repo.ts
    │   │
    │   ├── routes/
    │   │   └── auth.routes.ts
    │   │
    │   ├── services/
    │   │   ├── auth.service.ts
    │   │   └── roles.ts
    │   │
    │   ├── types/
    │   │   ├── express.d.ts
    │   │   └── user.ts
    │   │
    │   ├── app.ts
    │   └── server.ts
    │
    ├── database/
    │   └── schema.sql
    │
    ├── .env
    └── package.json
```

Note: The frontend structure is abbreviated. The old in-memory repository is retained as a reference; the active application imports `user.repo.ts`.

## Architecture

```text
React Frontend
      |
      v
Express Routes
      |
      v
AuthService
      |
      v
UserRepository
      |
      v
mysql2/promise
      |
      v
MySQL Database
```

The repository layer separates database operations from authentication business logic.

The authentication service does not directly execute SQL queries.

## Database Setup

### 1. Create the database

Run the SQL file:

```bash
mysql -u root -p < database/schema.sql
```

Alternatively, open `server/database/schema.sql` in MySQL Workbench or DBeaver and execute it.

The schema creates:

```text
week7_auth_demo
```

### 2. Database Tables

#### users

Stores:
- User ID
- Name
- Email
- Password hash
- Role
- Creation timestamp

#### refresh_tokens

Stores:
- SHA-256 refresh-token hash
- Associated user ID
- Expiration timestamp
- Creation timestamp

The `user_id` column references `users(id)` with `ON DELETE CASCADE`.

## Environment Configuration

Create a `.env` file inside the `server/` directory.

```env
PORT=5000

JWT_SECRET=YOUR_LONG_RANDOM_SECRET

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=week7_auth_demo
```

Use your own database credentials and a sufficiently strong JWT secret.

Never commit real credentials to Git.

If the frontend uses an API base URL, configure its Vite environment variable in `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

The frontend configuration must match the API URL used by the application.

## Installation

### Backend

Open a terminal:

```bash
cd server
npm install
```

Start the backend in development mode:

```bash
npm run dev
```

Backend development server:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Frontend development server:

```text
http://localhost:5173
```

## Backend Commands

Run these commands inside `server/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run build` | Compile TypeScript |
| `npm start` | Start compiled application |

## Authentication Flow

### Registration

1. User submits registration information.
2. Backend validates the input.
3. bcrypt hashes the password.
4. UserRepository inserts the user into MySQL.
5. The user is assigned the `user` role by public registration.

### Login

1. User submits email and password.
2. Backend retrieves the user from MySQL.
3. bcrypt verifies the password.
4. Backend generates an access token.
5. Backend generates a refresh token.
6. The refresh-token hash is stored in MySQL.
7. The refresh token is returned through an HttpOnly cookie.

### Protected Requests

The frontend sends the access token through:

```http
Authorization: Bearer ACCESS_TOKEN
```

The backend authentication middleware verifies the JWT before granting access.

### Session Restoration

When the frontend starts:

1. AuthProvider attempts session restoration.
2. Browser sends the refresh-token cookie.
3. Backend validates the refresh token using MySQL.
4. Backend rotates the refresh token.
5. Backend issues a new access token.
6. Frontend updates its authentication state.

### Logout

1. Frontend calls the logout endpoint.
2. Backend identifies the refresh-token record.
3. Backend deletes the record from MySQL.
4. Backend clears the refresh-token cookie.

## Token Security

| Token | Implementation |
|---|---|
| Access token | JWT |
| Access-token lifetime | 15 minutes |
| Refresh token | Opaque random token |
| Refresh-token lifetime | 7 days |
| Refresh-token storage | SHA-256 hash in MySQL |
| Browser refresh-token storage | HttpOnly cookie |

The access token is held in React memory rather than localStorage.

The refresh token is not stored as plain text in the database.

## CORS and Cookies

Development frontend:

```text
http://localhost:5173
```

Development backend:

```text
http://localhost:5000
```

The backend must allow the frontend origin and credentials.

The frontend must include credentials in requests that need the refresh-token cookie.

For production deployment, configure HTTPS, secure cookie settings, SameSite policy, domain settings, and CSRF protection appropriately.

## Verification Performed

The MySQL migration was manually verified using Postman and MySQL CLI.

| Verification | Result |
|---|---|
| MySQL connection | Passed |
| User registration | Passed |
| User persistence | Passed |
| Refresh-token persistence | Passed |
| Refresh-token rotation | Passed |
| Logout revocation | Passed |
| User persistence after backend restart | Passed |
| Session restoration after backend restart | Passed |
| TypeScript typecheck | Passed |
| Production build | Passed |

Automated tests were intentionally excluded from the final migration scope.

## Important Notes

- `user.repo.ts` is the active MySQL repository.
- `InMemouser.repo.ts` is retained only as a reference implementation.
- User passwords are stored as bcrypt hashes.
- Refresh tokens are stored as SHA-256 hashes.
- The backend remains responsible for actual authorization enforcement.
- MySQL keeps user and refresh-token records persistent across backend restarts.

## Learning Outcomes

Through this project, the following concepts were implemented and practiced:

- Authentication vs authorization.
- Password hashing with bcrypt.
- JWT structure and verification.
- Access-token and refresh-token responsibilities.
- Refresh-token hashing and rotation.
- HttpOnly cookies.
- React Context API.
- Protected routes and role-based UI.
- Express authentication middleware.
- Backend role authorization.
- Repository pattern.
- MySQL connection pooling.
- Relational database design.
- Parameterized SQL queries.
- Persistent authentication sessions.

---

**Project:** Week 7 Day 2 — Authentication & Role-Based Authorization

**Status:** MySQL migration completed and manually verified.