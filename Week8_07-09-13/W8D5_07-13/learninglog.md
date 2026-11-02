# Week 7 Day 2 — Learning Log

## Topic

Authentication and Role-Based Authorization in React with TypeScript

## Objective

Integrated the React frontend with an Express authentication backend, implemented protected routes and role-based access, and added refresh-token session restoration.

## Work Completed

### 1. Authentication API Integration
- Connected React to the backend registration and login endpoints.
- Used bcrypt for password hashing and verification.
- Implemented JWT access-token authentication.
- Returned public user information without exposing password hashes.

### 2. Refresh-Token Session Management
- Generated cryptographically random refresh tokens.
- Stored SHA-256 hashes of refresh tokens in the repository.
- Implemented refresh-token expiry and rotation.
- Delivered refresh tokens through HttpOnly cookies.
- Added refresh and logout API endpoints.
- Restored authentication state after browser reload.
- Used a shared refresh Promise to avoid overlapping startup refresh requests in React Strict Mode.

### 3. React Authentication State
- Used `AuthContext` and `AuthProvider` to share authentication state.
- Managed the current user, access token, and loading state.
- Implemented login, logout, and session restoration.
- Kept the access token in React memory rather than localStorage.

### 4. Protected Routes and RBAC
- Implemented protected routes using React Router.
- Redirected unauthenticated users to the login page.
- Restricted admin pages to users with the admin role.
- Added role-aware navigation.
- Verified backend authorization with authentication and role middleware.

### 5. UI and Styling
- Created a fresh responsive `index.css`.
- Added global styles, forms, buttons, cards, navigation, authentication layouts, status messages, and responsive rules.

## Testing and Verification

- Backend TypeScript typecheck passed.
- Backend production build passed.
- Frontend TypeScript check passed as part of the production build.
- Frontend Vite production build passed.
- Registration and login tested successfully.
- Refresh-cookie issuance and rotation tested successfully.
- Session restoration after browser reload tested successfully.
- Logout and refresh-token revocation tested successfully.
- Normal-user access to the admin route was denied.
- Admin access to the admin route succeeded.

## Technologies Used

- React
- TypeScript
- React Router
- Vite
- Node.js
- Express
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt
- Node.js cryptographic utilities
- cookie-parser
- CORS
- CSS

## Current Limitation

The backend repository uses in-memory Maps for users and refresh-token records. Restarting the backend clears this data. Migration to MySQL is planned as a future improvement.

## Outcome

The main assignment functionality was implemented and tested successfully, including authentication, role-based authorization, refresh-token rotation, browser session restoration, logout, and responsive frontend styling.

## Next Steps

- Confirm temporary development-only admin-promotion code has been removed.
- Review and commit final changes.
- Push the `w7d2` branch.
- Open a mentor pull request.
- Share the PR and learning-log links in the project task and Teams update.
