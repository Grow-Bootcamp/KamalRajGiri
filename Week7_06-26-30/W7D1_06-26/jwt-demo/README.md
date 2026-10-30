# Week 6, Day 1 --- JWT Authentication and Route Protection

## Overview

Today's task focused on understanding JSON Web Tokens (JWT),
implementing authentication in an Express API using TypeScript,
protecting routes with middleware, and testing the authentication flow.

## Learning Objectives

-   Understand authentication and authorization.
-   Understand the structure and purpose of a JWT.
-   Generate and verify tokens with `jsonwebtoken`.
-   Read configuration from environment variables using `dotenv`.
-   Implement Bearer-token authentication middleware.
-   Protect an API route and test expected authentication failures.
-   Use TypeScript, automated tests, and a production build to validate
    the implementation.

## Key Concepts

### Authentication vs. Authorization

-   **Authentication** verifies who the user is.
-   **Authorization** determines what an authenticated user is allowed
    to access or do.

### JWT Structure

A JWT commonly contains three dot-separated parts:

1.  **Header** --- identifies token metadata, such as the signing
    algorithm.
2.  **Payload** --- contains claims, such as a user ID and email.
3.  **Signature** --- helps verify that the token was signed with the
    expected secret and has not been altered.

The payload is encoded, not encrypted by default. Do not put passwords,
secrets, or other sensitive data in it.

### Signing and Verification

-   `jwt.sign()` creates a signed token.
-   `jwt.verify()` validates the token's signature and checks applicable
    claims, including expiration.
-   Decoding a token alone does not prove that it is valid.

### Bearer Token Authentication

A protected request sends the token in the HTTP `Authorization` header:

``` http
Authorization: Bearer <token>
```

The authentication middleware extracts the token, verifies it, attaches
the verified user claims to the request, and calls `next()` when
authentication succeeds. Requests with missing, invalid, tampered, or
expired tokens are rejected.

## Technology Stack

-   Node.js
-   Express
-   TypeScript
-   `jsonwebtoken`
-   `dotenv`
-   Vitest
-   Supertest

## API Endpoints

  -------------------------------------------------------------------------
  Method            Endpoint            Purpose           Access
  ----------------- ------------------- ----------------- -----------------
  GET               `/api/public`       Demonstrates a    Public
                                        public endpoint   

  POST              `/api/auth/login`   Checks demo       Public
                                        credentials and   
                                        issues a JWT      

  GET               `/api/profile`      Returns profile   Requires a valid
                                        information for   JWT
                                        the authenticated 
                                        user              
  -------------------------------------------------------------------------

### Login Flow

1.  The client sends the demo email and password to `/api/auth/login`.
2.  The server checks the credentials.
3.  If they are valid, the server signs a JWT with the configured secret
    and an expiration time.
4.  The client uses the returned token in the `Authorization` header for
    protected requests.
5.  The middleware verifies the token before the protected route runs.

## Configuration and Project Structure

The project uses environment variables for configuration. The `.env`
file contains local values such as `PORT` and `JWT_SECRET`; it must not
be committed to version control. A `.env.example` file can document the
required variable names without exposing real secrets.

``` text
jwt-demo/
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── server.test.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

-   `app.ts` defines and exports the Express application for reuse in
    tests.
-   `server.ts` starts the HTTP listener.
-   `server.test.ts` contains automated API tests.
-   `.gitignore` excludes `.env`, `node_modules/`, and generated `dist/`
    files.

## Validation and Test Results

The following commands completed successfully:

``` bash
npm run typecheck
npm test
npm run build
```

**Automated test result: 8 tests passed.**

  -----------------------------------------------------------------------
  Test scenario           Expected behavior       Result
  ----------------------- ----------------------- -----------------------
  Public endpoint         Returns success without Passed
                          a token                 

  Protected endpoint      Returns                 Passed
  without token           `401 Unauthorized`      

  Incorrect login         Returns                 Passed
  credentials             `401 Unauthorized`      

  Valid login             Issues a JWT            Passed

  Valid JWT               Grants access to the    Passed
                          profile endpoint        

  Tampered token          Is rejected             Passed

  Expired token           Is rejected             Passed

  Empty Bearer token      Is rejected             Passed
  -----------------------------------------------------------------------

## Security Notes and Limitations

This is a learning demonstration, not a production-ready authentication
system.

-   The demo user is stored in memory.
-   The demo credentials use a plaintext password. Real applications
    must store securely hashed passwords and verify them with an
    appropriate password-hashing library.
-   Keep the JWT secret strong, private, and outside source control.
-   Never commit `.env`; commit only a safe `.env.example`.
-   Keep sensitive information out of JWT payloads.
-   Validate input and use appropriate error handling.
-   Production applications should use a database-backed user system and
    review token lifetime, revocation strategy, transport security, and
    authorization rules.

## What I Learned

-   How authentication differs from authorization.
-   How a JWT is structured and why signing differs from encryption.
-   How to issue a token after successful login and verify it in
    middleware.
-   How to protect an Express route using a Bearer token.
-   How to test both successful and rejected authentication requests.
-   Why separating app construction from server startup makes API
    testing easier.
-   How TypeScript checks, automated tests, and a production build help
    validate a project.

## Completion Checklist

-   [x] Implement JWT login and token generation.
-   [x] Add middleware to verify Bearer tokens.
-   [x] Protect the profile endpoint.
-   [x] Test valid and invalid authentication scenarios.
-   [x] Pass TypeScript type checking.
-   [x] Pass all 8 automated tests.
-   [x] Complete the TypeScript production build.
-   [x] Prepare the learning log and repository deliverables.

## Run Locally

Install dependencies:

``` bash
npm install
```

Create a local `.env` file with a strong `JWT_SECRET` and the desired
`PORT`. Do not commit this file.

Run the development server:

``` bash
npm run dev
```

Run checks:

``` bash
npm run typecheck
npm test
npm run build
```

Run the compiled server after building:

``` bash
npm start
```

Use only the demo credentials defined in the local source code when
testing this learning project.
