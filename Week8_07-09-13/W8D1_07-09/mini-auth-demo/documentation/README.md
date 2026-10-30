# Mini Auth Demo — React, TypeScript, Express & JWT

A full-stack authentication demo built with React, TypeScript, and Express. It demonstrates login, JWT-protected endpoints, role-based authorization, secure password verification, and automatic access-token renewal using rotating refresh tokens stored in an HttpOnly cookie.

## Project Overview

The Mini Auth Module was developed for **Week 6, Day 5** to bring together backend authentication and authorization with a React frontend.

The original assignment focused on login, protected routes, role-based access control, React state management, and fetching protected data after login. The project was then extended with automatic access-token refresh and refresh-token rotation.

## Features

- Login using email and password.
- Password-hash verification with bcrypt.
- JWT access tokens for authenticated API requests.
- Protected profile endpoint.
- Role-based authorization for `user` and `admin` roles.
- Refresh tokens stored as hashes in the backend session repository.
- Refresh tokens delivered to the browser through an HttpOnly cookie.
- Automatic access-token refresh after a protected request returns `401`.
- Refresh-token rotation to invalidate the previous refresh session when a new one is issued.
- Logout endpoint that revokes the refresh session and clears the cookie.
- React login form and protected dashboard.
- Typed frontend API service and TypeScript interfaces.
- Loading and error states for asynchronous operations.
- Shared in-flight refresh promise to reduce duplicate concurrent refresh requests.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Fetch API
- React Hooks (`useState`, `useEffect`, and `useCallback`)

### Backend
- Node.js
- Express
- TypeScript
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- Cookie parsing middleware
- Node.js cryptographic utilities for refresh-token generation and hashing

### Development and Testing
- TypeScript type checking
- Backend authentication and refresh-flow tests
- Browser Network and Console tools for frontend verification

## Architecture

```text
mini-auth-demo/
├── client/
│   └── src/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   └── ProtectedDashboard.tsx
│       ├── services/
│       │   └── api.ts
│       ├── types/
│       │   └── auth.ts
│       └── App.tsx
└── server/
    └── src/
        ├── controllers/
        ├── routes/
        ├── middleware/
        ├── services/
        ├── repositories/
        ├── models/
        └── server.ts
```

The backend directory names above describe the intended organization. Refer to the actual source tree for the precise filenames and nesting in this checkout.

### Request Flow

1. The user submits login credentials through the React login form.
2. The frontend sends the credentials to `POST /api/auth/login`.
3. The backend validates the credentials using the user repository and bcrypt.
4. On successful login, the backend returns an access token in the JSON response and sets the refresh token in an HttpOnly cookie.
5. The frontend uses the access token in the `Authorization: Bearer <token>` header when requesting the protected profile.
6. If the access token expires, the profile request receives `401 Unauthorized`.
7. The frontend calls `POST /api/auth/refresh` with browser credentials included.
8. The backend validates the refresh session, revokes the previous session, and issues a new access token and refresh token.
9. The frontend retries the profile request with the new access token and updates its token state.
10. On logout, the backend revokes the refresh session and clears the cookie; the frontend clears its local authentication state.

## Prerequisites

Install a compatible version of Node.js and npm. Run the frontend and backend in separate terminals.

## Environment Configuration

Create the backend environment file using the configuration expected by the server.

Example:

```env
PORT=5000
JWT_SECRET=replace_with_a_random_secret_at_least_32_characters_long
```

Use a strong, randomly generated secret. Never commit a real secret or production environment file to Git.

The backend must validate that `JWT_SECRET` exists and meets the project's minimum length requirement.

## Running the Project

Install dependencies separately in each application directory:

```bash
cd server
npm install
```

Start the backend using the development script defined in its `package.json`:

```bash
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

The development setup uses the backend at `http://localhost:5000` and the Vite frontend at `http://localhost:5173`, matching the configured CORS origin.

Use the actual scripts in each `package.json` if their names differ.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/login` | Validate credentials and issue tokens | Public |
| POST | `/auth/refresh` | Rotate refresh session and issue a new access token | Refresh cookie required |
| POST | `/auth/logout` | Revoke refresh session and clear cookie | Refresh cookie if present |
| GET | `/auth/profile` | Retrieve the authenticated user's profile | Valid access token and allowed role |
| GET | `/auth/admin` | Demonstrate role-restricted access | Valid access token and admin role |

### Login

Send JSON credentials:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

On success, the response body contains the access token. The refresh token is set separately in an HttpOnly cookie.

### Protected Profile

Send the access token in the request header:

```http
Authorization: Bearer <access-token>
```

### Refresh

Send a POST request to `/api/auth/refresh` with browser credentials included. The browser sends the HttpOnly refresh cookie automatically when the cookie and request settings permit it.

A successful refresh returns a new access token in JSON and sets a rotated refresh token cookie.

### Logout

Send a POST request to `/api/auth/logout` with credentials included so the browser can send the refresh cookie and receive the cookie-clearing response.

## Token and Session Design

### Access Token

- Signed JWT used to authenticate protected API requests.
- Contains the user's subject identifier and role.
- Expires after **1 minute** in the current refresh-flow demo.
- Sent in the Bearer authorization header.

### Refresh Token

- Generated using cryptographically secure random bytes.
- Its hash, rather than the raw token, is stored in the refresh-session repository.
- Stored in the browser as an HttpOnly cookie.
- Expires after **7 days** in the current implementation.
- Rotated on successful refresh; the previous session is revoked.

The one-minute access-token lifetime is intentionally short to make expiry and refresh behavior easy to test. It is a demonstration setting, not a universal production recommendation.

## Frontend State and Automatic Refresh

The React application stores the current access token in application state and, in this demo, persists it in `localStorage`.

The API service centralizes network requests and error handling. When a profile request returns `401`, `getProfileWithRefresh()` attempts a refresh and retries the protected request with the new token.

A shared in-flight refresh promise helps multiple callers reuse the same refresh request while it is pending.

`ProtectedDashboard` manages loading, profile, and error state. It also guards state updates from stale effect executions. React Strict Mode can intentionally run effects an extra time during development, so duplicate development requests or console messages do not automatically indicate a production failure.

## Security Notes and Limitations

This is a learning project, not a production-ready authentication service.

- The user and refresh-session repositories are in-memory in this demo. Their data does not survive a server restart.
- `localStorage` is accessible to JavaScript. A production design should evaluate keeping short-lived access tokens in memory and restoring sessions through a refresh endpoint.
- The refresh cookie is configured for local HTTP development (`secure: false`). Production deployment must use HTTPS and an appropriate `Secure` cookie configuration.
- CORS, cookie settings, and CSRF protections must be reviewed for the actual deployment topology.
- Refresh-token rotation in the in-memory demo is not an atomic database transaction and does not implement full token-family reuse detection.
- Production systems need durable storage, rate limiting, monitoring, input validation, appropriate session invalidation, and comprehensive security testing.
- Do not log passwords, raw access tokens, or raw refresh tokens.

## Verification

The refresh-flow backend checks passed for these scenarios:

1. Valid login returns an access token and sets an HttpOnly refresh cookie.
2. A valid refresh cookie produces a new access token and a rotated cookie.
3. An invalid or expired refresh session is rejected with `401 Unauthorized`.
4. Logging out revokes the refresh session, so reuse of the old refresh token is rejected.

The frontend flow was also manually verified:

- Login opens the protected dashboard.
- An expired access token triggers a refresh request.
- A successful refresh allows the profile request to be retried.
- The dashboard remains visible without displaying the temporary access-token expiration error.
- Logout and invalid-session scenarios were checked.

Run the project's actual test and type-check scripts before submitting the final commit, and record the latest results rather than relying only on previous runs.

## Key Learning Outcomes

- Authentication verifies identity; authorization checks what that identity may access.
- JWT access tokens authenticate requests but do not automatically renew themselves.
- A `401` response can trigger a recovery flow when a valid refresh session exists.
- HttpOnly cookies reduce direct JavaScript access to refresh tokens.
- Hashing refresh tokens in server-side storage reduces the exposure caused by a repository leak.
- Rotation limits the usefulness of an old refresh token after a successful refresh.
- React effects require careful cleanup and stale-request handling.
- Centralizing API behavior makes authentication recovery easier to maintain and test.
- Passing type checks and tests is necessary, but does not alone establish production security.

## Project Status

**Week 6 Day 5 assignment:** Implemented.

**Refresh-token enhancement:** Core flow implemented and verification passed. Final documentation, review, and Git submission remain part of the delivery workflow.
