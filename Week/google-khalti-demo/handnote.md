# Google OAuth + Khalti Payment Integration — Handnote

## 1. Project Overview

This project demonstrates how to integrate Google OAuth authentication with Khalti sandbox payments in a React and Express application.

A user can:
- Sign in using a Google account.
- Access a protected profile page.
- Initiate a NPR 100 payment through Khalti.
- Complete the sandbox checkout.
- Have the backend verify the payment.
- See the product's payment status change from **Pending/Unpaid** to **Paid**.

**Technology stack**

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Authentication | Google OAuth 2.0 |
| Session | JWT in HTTP-only cookie |
| Payment | Khalti ePayment API v2 |
| Data storage | In-memory Map |

## 2. Overall Architecture

The application has two main parts:

- Client: React application running on `localhost:5173`.
- Server: Express API running on `localhost:5000`.

The client communicates with the backend using HTTP requests. The backend handles OAuth, JWT verification, and payment communication with Khalti.

## 3. Google OAuth 2.0

### What is OAuth?

OAuth 2.0 is an authorization framework that allows an application to obtain permission to access information from another service without collecting the user's password.

Google login uses an authorization flow involving redirects.

### Authentication flow

1. User clicks Login with Google.
2. Frontend navigates to `/api/auth/google`.
3. Backend generates an OAuth state value.
4. Backend redirects the user to Google's authorization page.
5. User selects a Google account and grants the requested permissions.
6. Google redirects to the backend callback with an authorization code and state.
7. Backend validates the state and exchanges the code for tokens.
8. Backend verifies the Google ID token.
9. Backend extracts the user's Google identity.
10. Backend creates its own application JWT.
11. JWT is stored in an HTTP-only cookie.
12. User is redirected to the profile page.

### Why validate OAuth state?

The state parameter helps protect the OAuth callback against cross-site request forgery (CSRF).

The backend:
- Generates a random state.
- Stores it in a temporary cookie.
- Compares the returned state with the stored value.
- Rejects mismatches.

### Google ID token vs application JWT

These tokens have different purposes.

**Google ID token**
- Issued by Google.
- Contains verified identity claims.
- Used by the backend to establish the user's identity.

**Application JWT**
- Issued by our own backend.
- Represents the authenticated user in our application.
- Used to protect our API routes.

We verify the Google ID token before issuing our own application JWT.

## 4. JWT and HTTP-only Cookies

JWT stands for JSON Web Token.

A JWT contains claims such as:
- `sub`: user's unique Google identifier.
- `email`: user's email.
- `name`: user's display name.
- `picture`: profile image URL.
- `iat`: issued-at timestamp.
- `exp`: expiration timestamp.

Our application JWT is signed using the backend's JWT secret.

### Why HTTP-only cookies?

The application stores the JWT in an HTTP-only cookie.

This means:
- Frontend JavaScript cannot directly read the cookie.
- The browser sends the cookie with eligible requests.
- The backend verifies the JWT before returning protected information.

Frontend requests must use:

```ts
fetch("http://localhost:5000/api/auth/me", {
  credentials: "include",
});
```

Backend CORS must allow the frontend origin and credentials.

## 5. Khalti Payment Integration

### What is a payment gateway?

A payment gateway connects an application to a payment service that processes transactions.

In this project, Khalti handles the sandbox checkout while our backend initiates and verifies the transaction.

### Important API endpoints

Khalti API base URL:

```text
https://dev.khalti.com/api/v2
```

**Initiate payment**

```text
POST /epayment/initiate/
```

**Lookup payment**

```text
POST /epayment/lookup/
```

Both requests use the Khalti secret key in the Authorization header:

```text
Authorization: Key YOUR_SECRET_KEY
```

The secret key must remain on the backend. It must never be exposed in frontend code.

### Amount conversion

Khalti expects the payment amount in paisa.

```text
NPR 1 = 100 paisa

NPR 100 = 10,000 paisa
```

The backend defines the product price:

```ts
const PRODUCT_AMOUNT = 10000;
```

The client does not decide the amount.

## 6. Payment Initiation Flow

1. User clicks Pay NPR 100 with Khalti.
2. Frontend sends a POST request to `/api/payments/initiate`.
3. Browser includes the application authentication cookie.
4. Backend verifies the JWT.
5. Backend generates a unique purchase order ID.
6. Backend sends the initiation request to Khalti.
7. Khalti returns a payment URL and pidx.
8. Backend stores the pending order in an in-memory Map.
9. Backend sends the payment URL to the frontend.
10. Frontend redirects the browser to Khalti checkout.

### Important values

- `pidx`: payment identifier returned by Khalti.
- `purchase_order_id`: unique identifier generated by our application.
- `amount`: payment amount in paisa.
- `payment_url`: URL used to open the Khalti checkout page.

## 7. Payment Verification

A redirect from Khalti does not, by itself, prove that payment succeeded.

Our backend uses Khalti's lookup API to verify the transaction.

### Verification flow

1. Khalti redirects the user to our backend callback.
2. Backend receives the pidx and purchase order ID.
3. Backend finds the corresponding pending order.
4. Backend sends the pidx to Khalti's lookup endpoint.
5. Khalti returns the transaction information.
6. Backend checks the payment status and amount.
7. If the payment is completed and the amount matches, the order status becomes `paid`.
8. Backend redirects the user to the payment result page.

The essential success condition in our demo is:

```ts
const isSuccessful =
  result.status === "Completed" &&
  result.total_amount === order.amount &&
  result.refunded !== true;
```

The backend, not the frontend redirect query parameter, determines whether the payment was successful.

## 8. Order Status Management

We introduced an order type:

```ts
type DemoOrder = {
  orderId: string;
  amount: number;
  userId: string;
  status: "pending" | "paid" | "failed";
};
```

The order is initially stored with:

```ts
status: "pending"
```

After successful verification:

```ts
order.status = "paid";
```

The order is retained instead of being deleted.

### Payment status endpoint

```text
GET /api/payments/status
```

This endpoint:
1. Reads the application cookie.
2. Verifies the JWT.
3. Finds a paid order belonging to the authenticated user.
4. Returns the payment status.

Example response:

```json
{
  "paid": true,
  "order": {
    "orderId": "DEMO-example",
    "amount": 10000,
    "status": "paid"
  }
}
```

The frontend uses this response to display the correct profile state.

## 9. React Profile Payment State

The profile maintains payment-related state:

```tsx
const [isPaid, setIsPaid] = useState(false);
const [paymentStatusLoading, setPaymentStatusLoading] =
  useState(true);
```

When the profile loads, a `useEffect` requests the payment status.

The UI has three possible states:

| State | Display |
|---|---|
| Loading | Checking payment status |
| Unpaid | Pay NPR 100 with Khalti |
| Paid | Payment successfully verified |

After payment, the user returns to the profile and sees the Paid status instead of the payment button.

## 10. Environment Variables

The backend uses environment variables for private credentials and configuration.

```env
PORT=5000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
JWT_SECRET=...
KHALTI_SECRET_KEY=...
SERVER_URL=http://localhost:5000
```

Never commit real credentials or secret keys to GitHub.

## 11. Important Security Concepts

- Verify Google ID tokens on the backend.
- Validate OAuth state.
- Keep OAuth and Khalti secrets on the backend.
- Use HTTP-only cookies for the application JWT.
- Verify JWTs before accessing protected routes.
- Do not trust payment success query parameters.
- Verify payment with Khalti lookup.
- Compare the verified amount with the server-side order amount.
- Associate an order with its authenticated user.

For a production system, additional protections include persistent order records, unique transaction constraints, payment idempotency, stronger CSRF protections, and secure HTTPS cookie settings.

## 12. Current Project Limitations

This is a learning demonstration, not a production payment system.

The project uses an in-memory Map for order storage.

Consequences:
- Orders are not stored permanently.
- Restarting the backend clears payment records.
- The demonstration does not provide a durable payment history.
- A real application needs a database and reliable order/payment state management.

## 13. Key Takeaways

1. OAuth authentication and application authentication are related but different.
2. Google issues its own ID token; our backend issues the application JWT.
3. HTTP-only cookies allow the browser to send authentication information without exposing the token to frontend JavaScript.
4. Payment initiation and payment verification are separate operations.
5. A payment redirect does not establish payment success.
6. The backend must verify the payment with the payment provider.
7. Payment verification and order status management are separate responsibilities.
8. The frontend should display the status returned by the backend.
