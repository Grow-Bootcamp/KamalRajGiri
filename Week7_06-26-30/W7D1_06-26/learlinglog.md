# Learning Log - JWT Authentication and Route Protection

**Day:** Week 7, Day 1  
**Topic:** JSON Web Tokens (JWT) and protected Express routes  
**Project:** `jwt-demo`

## 1. Goal for the Day

Build a small authentication flow that can:

- Accept a user's login credentials.
- Issue a signed JWT when the credentials are valid.
- Reject invalid login attempts.
- Protect a profile route with authentication middleware.
- Reject missing, malformed, tampered, and expired tokens.
- Verify the behavior with automated tests.

## 2. Authentication and Authorization

These terms are related but not interchangeable:

- **Authentication** answers: "Who is the user?"
- **Authorization** answers: "What is this authenticated user allowed to do?"

The login endpoint authenticates the user. The JWT middleware authenticates later
requests, while a role or permission check would be responsible for authorization.
A valid token alone does not automatically grant access to every resource.

## 3. What Is a JWT?

A JWT is a compact, signed string made of three dot-separated parts:

```text
header.payload.signature
```

### Header

The header identifies metadata such as the token type and signing algorithm:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

The payload contains claims about the subject of the token:

```json
{
  "userId": 1,
  "email": "kamal@example.com",
  "iat": 1780000000,
  "exp": 1780003600
}
```

The payload is encoded, not encrypted. Anyone who obtains the token can decode
the payload, so it must not contain passwords, secrets, or other sensitive data.

### Signature

The signature is generated from the encoded header and payload plus a secret:

```text
HMACSHA256(
  base64url(header) + "." + base64url(payload),
  JWT_SECRET
)
```

The server uses the same secret to verify that the token was created by a
trusted issuer and has not been modified.

## 4. Login and Protected-Route Flow

1. The client sends an email and password to `POST /api/auth/login`.
2. The server validates the input and checks the credentials.
3. For valid credentials, the server signs a JWT with an expiration time.
4. The client stores the token using an appropriate secure strategy.
5. The client sends the token on protected requests:

   ```http
   Authorization: Bearer <jwt>
   ```

6. The middleware extracts and verifies the token.
7. If verification succeeds, the middleware attaches the verified claims to
   `req.user` and calls `next()`.
8. If verification fails, the request ends with `401 Unauthorized`.

## 5. Practical Implementation

### Environment configuration

Secrets belong in environment variables rather than source code:

```ts
import "dotenv/config";

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET must be configured with a strong secret.");
}

const JWT_SECRET = secret;
```

The local `.env` file must not be committed. A safe `.env.example` can document
the required variable names:

```text
PORT=5000
JWT_SECRET=replace-with-a-long-local-secret
```

### Creating a token after login

```ts
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

return res.json({
  message: "Login successful.",
  token
});
```

Only the claims needed by the application should be included. The signing
secret must remain server-side.

### Authentication middleware

```ts
function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required."
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      message: "Authentication token required."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "number" ||
      typeof decoded.email !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token."
      });
    }

    req.user = decoded as AuthTokenPayload;
    return next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token."
    });
  }
}
```

Important details:

- Checking the `Bearer` scheme prevents accepting an unexpected header format.
- Checking for an empty token avoids passing invalid input to the verifier.
- `jwt.verify()` checks the signature and expiration; decoding alone is not
  authentication.
- Restricting the accepted algorithm prevents an algorithm mismatch from being
  accepted accidentally.
- Claims are validated after cryptographic verification before they are used.

### Protecting a route

```ts
app.get("/api/profile", authenticateToken, (req, res) => {
  return res.json({
    message: `Welcome back, ${req.user!.email}`,
    user: {
      id: req.user!.userId,
      email: req.user!.email
    }
  });
});
```

Express runs `authenticateToken` before the route handler. The profile handler
does not run when the middleware returns a `401` response.

## 6. API Surface

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/public` | Demonstrates a public endpoint | Public |
| `POST` | `/api/auth/login` | Validates credentials and issues a JWT | Public |
| `GET` | `/api/profile` | Returns the authenticated user's profile | Valid JWT required |

The demo user is stored in memory:

```text
email: kamal@example.com
password: Kamal123
```

This is intentionally suitable only for learning. A real application should
use a database and a password-hashing library such as Argon2 or bcrypt.

## 7. What Happens in Different Situations?

| Situation | Expected result | Reason |
|---|---|---|
| Public route without a token | `200 OK` | The route is intentionally public |
| Profile route without `Authorization` | `401 Unauthorized` | Authentication is required |
| Incorrect login credentials | `401 Unauthorized` | No user is authenticated |
| Missing email or password | `400 Bad Request` | The request input is incomplete |
| `Authorization: Basic ...` | `401 Unauthorized` | The API expects Bearer authentication |
| `Authorization: Bearer ` | `401 Unauthorized` | The token is empty |
| Tampered token | `401 Unauthorized` | The signature no longer matches |
| Expired token | `401 Unauthorized` | The `exp` claim is no longer valid |
| Valid signature but wrong claim types | `401 Unauthorized` | Required application claims are invalid |
| Valid token with insufficient permission | Should be `403 Forbidden` | Authentication succeeded, authorization failed |

`401` means the request is not authenticated. `403` is more appropriate when
the identity is known but the identity is not allowed to perform the action.

## 8. Testing Strategy

The test suite uses Vitest and Supertest to test the API as a client would.
The important scenarios covered are:

1. Public access succeeds.
2. Protected access without a token is rejected.
3. Incorrect credentials are rejected.
4. Correct credentials issue a JWT.
5. A valid JWT grants profile access.
6. A tampered token is rejected.
7. An expired token is rejected.
8. An empty Bearer token is rejected.

The token returned by login can also be independently verified in a test:

```ts
const response = await request(app)
  .post("/api/auth/login")
  .send({
    email: "kamal@example.com",
    password: "Kamal123"
  });

expect(response.status).toBe(200);
expect(typeof response.body.token).toBe("string");

const decoded = jwt.verify(response.body.token, secret);
expect(decoded).toMatchObject({
  userId: 1,
  email: "kamal@example.com"
});
```

Separating the Express `app` from the server startup makes this style of
request testing straightforward and avoids opening a real listener during the
test suite.

## 9. Validation Completed

The project validation commands completed successfully:

```bash
npm run typecheck
npm test
npm run build
```

Result: **8 automated tests passed**, TypeScript type checking passed, and the
production build completed.

## 10. Key Learnings

- JWTs provide signed claims, not encrypted secrets.
- `jwt.verify()` must be used before trusting token claims.
- A strong secret must stay private and outside source control.
- Authentication middleware is reusable across protected routes.
- Token expiration limits the lifetime of a stolen token.
- A valid token proves identity, but separate authorization checks are still
  required for roles and permissions.
- Input validation and explicit failure responses make the authentication flow
  predictable.
- Testing rejected requests is as important as testing successful login.
- Keeping configuration, app construction, and server startup separate improves
  maintainability and testability.

## 11. Limitations and Next Improvements

This mini-project demonstrates the core flow but is not production-ready.
Potential next steps are:

- Replace the in-memory user with a database-backed user model.
- Hash passwords and never compare plaintext passwords.
- Add request validation with a schema-validation library.
- Add refresh-token or session-management strategy where appropriate.
- Add token revocation or rotation for logout and credential compromise.
- Use HTTPS and secure client-side token storage.
- Add role/permission middleware for authorization.
- Avoid exposing whether an email exists through overly specific errors.
- Add rate limiting and audit logging to the login endpoint.
- Rotate the JWT secret using a managed secret store.

## 12. Completion Checklist

- [x] Understand JWT header, payload, and signature.
- [x] Generate a JWT after valid login.
- [x] Verify JWT signature and expiration.
- [x] Implement Bearer-token middleware.
- [x] Protect the profile endpoint.
- [x] Handle missing, empty, invalid, tampered, and expired tokens.
- [x] Test successful and rejected authentication flows.
- [x] Pass TypeScript type checking.
- [x] Pass all 8 automated tests.
- [x] Complete the production build.
- [x] Prepare the learning log for the day's repository deliverables.
