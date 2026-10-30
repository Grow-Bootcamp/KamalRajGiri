# WEEK 6, DAY 1 — JWT AUTHENTICATION AND ROUTE PROTECTION

## 1. Why Backend Authentication Matters

A backend must determine two things:

1. Who is making the request?
2. What is that person allowed to access?

HTTP is a stateless protocol. Each request is independent by default, so a successful login does not automatically make the server remember the user in later requests.

Applications use authentication mechanisms to maintain or re-establish identity across requests.

### Common Authentication Approaches

**Session-based authentication**
- The server stores session information.
- The client usually stores a session ID in a cookie.
- The server uses that ID to identify the session on later requests.

**Token-based authentication**
- The server issues a token after successful authentication.
- The client sends the token with later requests.
- The server validates the token before allowing access.

Note: Stateless HTTP does not mean the server cannot remember users. Sessions, databases, caches, and tokens provide application-level continuity.

## 2. Authentication vs. Authorization

**Authentication — Who are you?**

Authentication verifies a user's identity. Logging in with an email and password is an example.

**Authorization — What are you allowed to do?**

Authorization determines which resources or actions a user can access.

Example:
- A student may view their own profile.
- An administrator may manage user accounts.

A valid JWT can help establish identity, but it does not automatically grant permission to every resource.

## 3. What Is a JWT?

JWT stands for JSON Web Token.

It is a compact, URL-safe format for representing claims that can be transmitted between parties.

In a typical application:
1. The client submits login credentials.
2. The server validates the credentials.
3. The server creates and signs a JWT.
4. The client receives the token.
5. The client sends the token with future requests.
6. The server verifies the token before allowing access to protected routes.

A typical signed JWT contains three parts:

Header.Payload.Signature

These parts are separated by periods.

Important: Base64URL encoding is NOT encryption.

## 4. The Three Parts of a JWT

### A. Header

The header contains metadata about the token, including its signing algorithm.

Example:

{
  "alg": "HS256",
  "typ": "JWT"
}

- alg: Identifies the signing algorithm.
- typ: Identifies the token type; JWT is commonly used.

The server should explicitly allow the expected signing algorithm rather than blindly trusting the algorithm named in a token.

### B. Payload

The payload contains claims, which are statements about the user or token.

Example:

{
  "userId": 1,
  "email": "kamal@example.com",
  "iat": 1791800000,
  "exp": 1791803600
}

Explanation:

- userId: Application-specific claim identifying the user.
- email: Application-specific claim containing the user's email.
- iat: Issued-at time.
- exp: Expiration time.

JWT timestamps use Unix time in seconds.

A JWT library may automatically add the iat claim and calculate exp from the configured token lifetime.

SECURITY RULE:

A normal signed JWT is not encrypted. Anyone who obtains the token can decode and read its header and payload.

Never include:
- Passwords
- Password hashes
- API keys
- Secret keys
- Other confidential information

Include only the claims the application actually needs.

### C. Signature

The signature helps the server detect unauthorized modifications to the token.

For HS256, the signature is generated using HMAC-SHA256 and a shared secret.

Conceptually:

signature = HMAC-SHA256(
  encodedHeader + "." + encodedPayload,
  secretKey
)

If someone modifies the payload without producing a valid signature using the correct secret, verification fails.

Important:
- The signature protects integrity; it does not hide the payload.
- A signed JWT is not automatically revocable before expiry.
- Early revocation requires an additional strategy, such as a denylist or token-version check.

## 5. HS256 Explained

HS256 means HMAC using SHA-256.

- HMAC: Hash-based Message Authentication Code.
- SHA-256: A cryptographic hash function.
- Secret: The shared key used to sign and verify the token.

With HS256, the same secret is used for signing and verification.

Therefore, the secret must remain private. Anyone who obtains it may be able to create valid tokens.

The project uses HS256 and an expiration time of one hour.

## 6. Signing, Decoding, and Verifying

The jsonwebtoken package provides three important operations.

**jwt.sign()**
- Creates a signed JWT.
- Used after successful credential validation.

**jwt.verify()**
- Verifies the token's signature.
- Checks applicable claims, including expiration.
- Throws an error if verification fails.

**jwt.decode()**
- Reads the token contents without verifying the signature.
- Must not be treated as proof of identity.

Remember:

SIGN = Create a token.

DECODE = Read token contents without verifying authenticity.

VERIFY = Check authenticity and applicable claims.

The application should also validate the verified payload's expected structure and claim types.

## 7. Typical JWT Authentication Flow

1. Client submits an email and password to the login endpoint.

2. Server validates the credentials against the user record.

3. If the credentials are valid, the server signs a JWT containing the necessary claims.

4. The server returns the token to the client.

5. The client sends the token to a protected endpoint using the Authorization header.

Example:

Authorization: Bearer <token>

6. Authentication middleware extracts and verifies the token.

7. If verification succeeds and the expected claims are present, the middleware attaches the verified user information to the request.

8. The middleware calls next(), allowing the request to continue to the protected route handler.

9. If authentication fails, the server returns an appropriate error response.

In a production application, credentials should be transmitted over HTTPS, and passwords should be verified against securely stored password hashes rather than plaintext passwords.

## 8. Important HTTP Status Codes

**200 OK**
The request succeeded.

Example: Successful login or profile retrieval.

**400 Bad Request**
The request is malformed or required input is missing.

Example: Email or password was not provided.

**401 Unauthorized**
Authentication is missing or invalid.

Examples:
- Missing token
- Invalid token
- Expired token
- Invalid login credentials

**403 Forbidden**
The user is authenticated but does not have permission to perform the requested action.

Remember:
- 401 generally concerns authentication.
- 403 generally concerns authorization.

## 9. Environment Configuration

Example .env file:

PORT=5000
JWT_SECRET=<strong-random-secret>

The dotenv/config import loads environment variables from the local .env file into process.env.

Example:

import "dotenv/config";

const PORT = Number(process.env.PORT ?? 5000);
const secret = process.env.JWT_SECRET;

Explanation:

- process.env.PORT reads the configured port.
- ?? 5000 provides a default when PORT is null or undefined.
- Number() converts the port value to a number.
- process.env.JWT_SECRET reads the JWT signing secret.

The application checks that the secret exists and meets the project's minimum length requirement.

Example:

if (!secret || secret.length < 32) {
  throw new Error(
    "JWT_SECRET must be configured with a strong secret."
  );
}

const JWT_SECRET: string = secret;

The first check ensures that the secret exists and is long enough. After this check, TypeScript can safely treat it as a string.

Security notes:
- Keep the real secret private.
- Do not hard-code the secret in application source files.
- Do not commit .env to Git.
- Use a strong, randomly generated secret.
- A minimum length check alone does not guarantee that a secret is sufficiently random.

## 10. JWT Creation in TypeScript

Example:

const token = jwt.sign(
  {
    userId: user.id,
    email: user.email
  },
  JWT_SECRET,
  {
    algorithm: "HS256",
    expiresIn: "1h"
  }
);

Explanation:

- jwt.sign() creates the token.
- userId and email are included as claims.
- JWT_SECRET is used to sign the token.
- algorithm specifies HS256.
- expiresIn sets the token lifetime to one hour.

The token is returned only after the login credentials have been validated.

The JWT does not replace the user database. If the application needs current account status or permissions, it may need to consult trusted server-side data.

## 11. Bearer Token Authentication Middleware

Middleware is a function that runs during the request-response cycle.

Authentication middleware checks whether a request contains a valid token before allowing it to continue to a protected route.

### Step 1: Read the Authorization Header

const authHeader = req.headers.authorization;

This reads the Authorization header from the incoming HTTP request.

Example:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

### Step 2: Check the Bearer Prefix

if (!authHeader?.startsWith("Bearer ")) {
  return res.status(401).json({
    message: "Authentication token required."
  });
}

Explanation:

- startsWith("Bearer ") checks whether the header begins with the expected prefix.
- The space after Bearer is intentional.
- ! means NOT.
- ?. is optional chaining.

Optional chaining prevents an error if authHeader is undefined or null.

The condition rejects the request when the header is missing or does not use the expected Bearer format.

### Step 3: Extract the Token

const token = authHeader.slice("Bearer ".length).trim();

Explanation:

- "Bearer ".length gives the length of the prefix.
- slice() removes the prefix and returns the remaining string.
- trim() removes surrounding whitespace.

For example:

Input:
"Bearer abc123"

After slice():
"abc123"

### Step 4: Reject an Empty Token

if (!token) {
  return res.status(401).json({
    message: "Authentication token required."
  });
}

A header may contain the word Bearer but no actual token.

This condition rejects an empty token before verification.

### Step 5: Verify the Token

const decoded = jwt.verify(token, JWT_SECRET, {
  algorithms: ["HS256"]
});

This verifies the token using the configured secret and permits only the HS256 algorithm.

If the token is invalid, tampered with, or expired, verification throws an error.

### Step 6: Validate the Claims

The application checks that the verified token contains the expected data types.

Example:

if (
  typeof decoded === "string" ||
  typeof decoded.userId !== "number" ||
  typeof decoded.email !== "string"
) {
  return res.status(401).json({
    message: "Invalid authentication token."
  });
}

Explanation:

- typeof decoded === "string" rejects a string payload.
- userId must be a number.
- email must be a string.

A valid signature does not automatically mean the payload contains every claim the application requires.

### Step 7: Attach the User to the Request

req.user = decoded as AuthTokenPayload;

This makes the verified user claims available to later middleware or route handlers.

The TypeScript type assertion tells the compiler how the application intends to use the value. It does not perform runtime validation; the preceding checks provide that validation.

### Step 8: Continue or Reject

return next();

next() passes control to the next middleware or route handler.

If verification fails, the catch block returns a 401 response instead of allowing the protected handler to run.

## 12. Extending the Express Request Type

Example:

interface AuthTokenPayload extends JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

Explanation:

- AuthTokenPayload describes the claims the application expects.
- JwtPayload provides the standard JWT payload type.
- Express.Request represents an incoming Express request.
- user? means the user property is optional.

Why optional?

Not every request is authenticated. A public route may not have req.user. The authentication middleware attaches it only after successful verification.

The optional property helps TypeScript represent that possibility accurately.

## 13. Protecting a Route

Example:

app.get(
  "/api/profile",
  authenticateToken,
  (req: Request, res: Response) => {
    return res.json({
      message: `Welcome back, ${req.user!.email}`,
      user: {
        id: req.user!.userId,
        email: req.user!.email
      }
    });
  }
);

The request flow is:

Request
   |
   v
authenticateToken middleware
   |
   +---- Invalid token ----> 401 response
   |
   +---- Valid token ------> next()
                                |
                                v
                         Profile handler
                                |
                                v
                         Profile response

The exclamation mark in req.user! is TypeScript's non-null assertion operator. It tells TypeScript that the developer expects req.user to exist at that point.

It does not check the value at runtime. Its use is justified only when the middleware guarantees that the handler runs after successful authentication.

## 14. App Setup vs. Server Startup

For automated testing, it is useful to separate the Express application from the network listener.

**src/app.ts**
- Creates the Express app.
- Registers middleware and routes.
- Exports the app.

**src/server.ts**
- Imports the app.
- Calls app.listen() to start the HTTP server.

**src/server.test.ts**
- Imports the app.
- Uses Supertest to make requests without manually starting a separate listening server.

Example app export:

export { app };

Example server startup:

import { app } from "./app";

const PORT = Number(process.env.PORT ?? 5000);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

This separation reduces unwanted server-startup side effects during testing and helps avoid port conflicts.

## 15. API Endpoints

GET /api/public
- Purpose: Returns a public welcome message.
- Authentication: Not required.

POST /api/auth/login
- Purpose: Validates demo credentials and issues a JWT.
- Authentication: Email and password must be supplied and validated.

GET /api/profile
- Purpose: Returns profile information for the authenticated user.
- Authentication: A valid JWT is required.

## 16. Automated Testing

Supertest helps test HTTP endpoints in an Express application.

Typical test scenarios include:

1. Public endpoint returns success without a token.
2. Profile endpoint returns 401 when the token is missing.
3. Incorrect login credentials return 401.
4. Valid login returns a JWT.
5. A valid token allows profile access.
6. A tampered token returns 401.
7. An expired token returns 401.
8. An empty Bearer token returns 401.

Reported project result:
- 8 automated tests passed.
- TypeScript type checking passed.
- TypeScript build completed successfully.

These results confirm the listed behavior. They do not, by themselves, prove that the application is production-secure.

## 17. Common Mistakes to Avoid

1. Using jwt.decode() as proof of authentication.
2. Believing Base64URL encoding encrypts the payload.
3. Putting passwords or secrets in JWT claims.
4. Hard-coding the JWT secret.
5. Committing .env to Git.
6. Accepting arbitrary signing algorithms.
7. Forgetting to validate the expected payload structure.
8. Forgetting to configure token expiration.
9. Assuming authentication automatically grants all permissions.
10. Assuming a JWT can automatically be revoked before expiry.
11. Using plaintext passwords or in-memory users in a production system.
12. Starting a separate server unnecessarily during Supertest tests.

## 18. Security Limitations of This Demonstration

This project is a learning example, not a complete production authentication system.

- The demo user is stored in memory, not a persistent database.
- The demo password is plaintext. Production applications should securely hash passwords and verify submitted passwords against those hashes.
- The JWT secret must be strong and private.
- HTTPS should be used in production to protect tokens in transit.
- JWT payloads should contain minimal, non-sensitive claims.
- Token expiry, rotation, and early revocation should be considered.
- Browser token storage must be selected carefully. Applications should consider XSS risks and CSRF risks when using cookies.
- Authentication and authorization must both be enforced.

## 19. Quick Revision Questions

1. What does JWT stand for?
2. Why is HTTP described as stateless?
3. What is the difference between authentication and authorization?
4. What are the three parts of a JWT?
5. What does HS256 mean?
6. Why is a signed JWT not necessarily encrypted?
7. What is the difference between jwt.sign(), jwt.decode(), and jwt.verify()?
8. Why is the JWT secret stored in an environment variable?
9. What does Authorization: Bearer <token> mean?
10. Why do we use authHeader?.startsWith("Bearer ")?
11. What do slice() and trim() do when extracting a token?
12. Why do we validate the decoded payload's claim types?
13. What does next() do?
14. Why is req.user optional in the Express type declaration?
15. What is the difference between 401 and 403?
16. Why separate app.ts from server.ts?
17. What does Supertest help us test?
18. Why is the demonstration not production-ready?

## 20. Final Memory Summary

JWT authentication follows this sequence:

SIGN → SEND → VERIFY → AUTHORIZE → RESPOND

- SIGN: Issue a token after validating credentials.
- SEND: The client sends the token in the Authorization header.
- VERIFY: Middleware validates the token and expected claims.
- AUTHORIZE: The application checks whether the user may access the resource.
- RESPOND: The server returns the requested data or an appropriate error.

The key lesson is that a token must not simply be decoded and trusted. The backend must verify it, validate the expected claims, and enforce the appropriate permissions.