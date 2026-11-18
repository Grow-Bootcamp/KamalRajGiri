# NestJS OTP Authentication System

A full-stack authentication application built with **NestJS, TypeScript, MySQL, Prisma ORM, React, and JWT**.

The application implements user registration, password-based login, email-based OTP-style verification (OTP is logged to the backend console for local testing), and JWT-protected dashboard access.

## Features

### Authentication
- User registration with full name, email, and password.
- Password hashing using bcrypt.
- Login using email and password.
- OTP generation using Node.js `crypto.randomInt()`.
- Six-digit OTP verification.
- OTP expires after 10 minutes.
- OTP values are stored as bcrypt hashes rather than plaintext.
- Maximum of five incorrect OTP attempts.
- OTP records are deleted after successful verification, expiration, or maximum failed attempts.
- Scheduled cleanup of expired OTP records every minute.
- JWT access token issued after successful OTP verification.
- JWT token expiration set to 15 minutes.
- Protected API endpoints using a custom NestJS authentication guard.

### Frontend
- User registration page.
- Login page.
- OTP verification page.
- Protected dashboard.
- Displays authenticated user's information.
- Automatic redirection when no valid session is available.
- Logout functionality.
- Toast notifications for success and error messages.

## Technologies Used

### Backend
- Node.js
- NestJS
- TypeScript
- MySQL
- Prisma ORM 7
- bcrypt
- JSON Web Token (`@nestjs/jwt`)
- class-validator
- class-transformer
- @nestjs/schedule

### Frontend
- React
- TypeScript
- Vite
- React Router DOM
- React Toastify
- CSS

## Project Structure

```text
nestjs-otp-demo/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── password.util.ts
│   │   │
│   │   ├── otp/
│   │   │   ├── otp.module.ts
│   │   │   ├── otp.service.ts
│   │   │   └── otp-cleanup.service.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env
│   ├── prisma.config.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Register.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── VerifyOtp.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   └── package.json
│
└── README.md
```

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MySQL Server
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd nestjs-otp-demo
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Add the following configuration:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=nestjs_otp_demo

JWT_SECRET=your_long_random_secret_key
```

Replace the database credentials and JWT secret with your own values.

**Important:** Never commit your `.env` file or expose your JWT secret.

### 4. Create the MySQL Database

Create the database in MySQL:

```sql
CREATE DATABASE nestjs_otp_demo;
```

### 5. Run Prisma Migrations

From the backend directory:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 6. Start the Backend

Run the development server:

```bash
npm run start:dev
```

The backend will run at:

```text
http://localhost:3000
```

### 7. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at the URL displayed by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

Base URL:

```text
http://localhost:3000
```

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Not required |
| POST | `/auth/login` | Validate credentials and generate OTP | Not required |
| POST | `/auth/verify-otp` | Verify OTP and issue JWT | Not required |
| GET | `/auth/me` | Retrieve authenticated user profile | Bearer token required |

### 1. Register

**POST** `/auth/register`

Request body:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

The backend validates the input, hashes the password, and creates the user in MySQL.

### 2. Login

**POST** `/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

After successful credential validation, the backend generates a six-digit OTP.

For local testing, the OTP is displayed in the backend console.

The response includes a challenge ID and OTP expiration time.

### 3. Verify OTP

**POST** `/auth/verify-otp`

Request body:

```json
{
  "challengeId": "your-challenge-uuid",
  "otp": "123456"
}
```

After successful verification, the backend deletes the OTP record and issues a JWT access token.

Example response:

```json
{
  "message": "OTP verified successfully",
  "verified": true,
  "accessToken": "your-access-token",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. Get Current User

**GET** `/auth/me`

Request header:

```text
Authorization: Bearer <access-token>
```

The JWT authentication guard verifies the token before allowing access to the endpoint.

If the token is valid, the API returns the authenticated user's profile.

Requests with missing, invalid, or expired tokens receive an HTTP 401 Unauthorized response.

## Authentication Workflow

```text
User Registration
       |
       v
Password Hashed with bcrypt
       |
       v
User Stored in MySQL
       |
       v
User Login
       |
       v
Validate Email and Password
       |
       v
Generate Six-Digit OTP
       |
       v
Store OTP Hash in MySQL
       |
       v
Display OTP in Backend Console
       |
       v
User Enters OTP
       |
       v
Verify OTP and Expiration
       |
       v
Delete Verified OTP
       |
       v
Generate JWT Access Token
       |
       v
Frontend Stores Access Token
       |
       v
Access Protected Dashboard
       |
       v
Backend JWT Guard Validates Token
       |
       v
Display Authenticated User Profile
```

## Security Considerations

- Passwords are hashed using bcrypt before database storage.
- OTP values are hashed before database storage.
- OTPs expire after 10 minutes.
- OTP verification is limited to five incorrect attempts.
- Expired OTP records are automatically removed through scheduled cleanup.
- JWT tokens are signed using a secret stored in environment variables.
- Protected backend endpoints validate JWT signatures and expiration.
- The dashboard requires authentication.
- Frontend logout removes the stored access token.

**Note:** OTP delivery is simulated through backend console logging for development and testing. Actual email or SMS delivery is not implemented.

The frontend stores the JWT in localStorage for this demonstration. A production application should consider HttpOnly, Secure, SameSite cookies and additional protections against common web vulnerabilities.

## Validation and Build

### Backend

```bash
npm run build
```

### Frontend

```bash
npm run build
```

Both backend and frontend production builds completed successfully during development.

## Future Improvements

- Integrate an actual email service for OTP delivery.
- Implement refresh tokens and token revocation.
- Use secure HttpOnly cookies for authentication.
- Add automated backend and frontend tests.
- Implement password reset functionality.
- Add role-based access control.

## Author

Developed as a full-stack authentication learning project using NestJS and React.

---

**Project Status:** Completed

**Backend:** NestJS + Prisma + MySQL

**Frontend:** React + TypeScript

**Authentication:** Password + OTP + JWT