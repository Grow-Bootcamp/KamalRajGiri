# Learning Log — Google OAuth + Khalti Payment Integration

## Project

**Google OAuth Authentication and Khalti Sandbox Payment Integration**

**Project type:** Full-stack integration demo

**Technology:** React, TypeScript, Vite, Node.js, Express, Google OAuth 2.0, JWT, Khalti ePayment API v2.

## 1. Objective

The objective was to understand and implement third-party authentication and payment gateway integration in a full-stack application.

The application allows users to authenticate using Google, access a protected profile, make a sandbox payment through Khalti, and see their payment status updated after backend verification.

## 2. Work Completed

### Task 1: Project setup

- Created separate client and server applications.
- Configured React, TypeScript, and Vite.
- Configured Express and TypeScript.
- Set up environment variables.
- Configured development scripts.

### Task 2: Google OAuth configuration

- Created and configured a Google OAuth web client.
- Configured the frontend authorized origin.
- Configured the backend callback URL.
- Added the required OpenID, email, and profile scopes.
- Configured a test account.

### Task 3: Google authentication implementation

- Implemented the Google login route.
- Generated and validated the OAuth state parameter.
- Exchanged the authorization code for Google tokens.
- Verified the Google ID token.
- Extracted the user's profile information.
- Generated an application JWT.
- Stored the JWT in an HTTP-only cookie.
- Implemented the protected `/api/auth/me` endpoint.
- Implemented logout.

**Result:** Google login, profile retrieval, and logout worked successfully.

### Task 4: Khalti sandbox integration

- Configured the Khalti sandbox secret key.
- Implemented the payment initiation endpoint.
- Generated unique purchase order IDs.
- Converted NPR into paisa.
- Sent payment initiation requests to Khalti.
- Received the payment URL and pidx.
- Redirected the user to the Khalti checkout page.

### Task 5: Payment verification

- Implemented the Khalti callback route.
- Retrieved the pending order using pidx.
- Called Khalti's payment lookup endpoint.
- Verified the transaction status.
- Compared the verified amount with the expected amount.
- Handled successful, pending, and unsuccessful payment outcomes.

**Result:** The sandbox payment completed and backend verification succeeded.

### Task 6: Paid status management

Initially, successful verification did not update the product status on the profile.

The issue was that the successful callback removed the pending order from the in-memory Map without retaining a paid status.

The implementation was updated to:
- Add `pending`, `paid`, and `failed` order states.
- Change the order status to `paid` after successful verification.
- Retain the order after verification.
- Add `GET /api/payments/status`.
- Associate orders with the authenticated user's ID.
- Fetch the payment status from the profile page.
- Replace the payment button with the Paid status after successful payment.

**Result:** The profile now displays Paid after a successful and verified payment.

## 3. Testing and Validation

| Test | Result |
|---|---|
| Google OAuth login | Passed |
| Google callback and JWT creation | Passed |
| Protected profile access | Passed |
| Profile data retrieval | Passed |
| Logout | Passed |
| Khalti payment initiation | Passed |
| Khalti sandbox checkout | Passed |
| Backend payment lookup | Passed |
| Successful payment verification | Passed |
| Order status changed to paid | Passed |
| Profile displays paid status | Passed |

## 4. Important Problems and Solutions

### Problem 1: Google OAuth reported a missing client ID

**Cause:** Environment variables were loaded after modules that initialized the Google OAuth client.

**Solution:** Loaded dotenv configuration before other application modules:

```ts
import "dotenv/config";
```

This ensured that environment variables were available during module initialization.

### Problem 2: Payment verification did not update the profile

**Cause:** The successful payment callback removed the pending order rather than retaining its new status.

**Solution:** Updated the order status to `paid`, retained the record, and implemented a payment status endpoint.

### Problem 3: Payment result and actual order status were separate

**Cause:** The result page displayed a success message, but the profile needed to retrieve its own backend payment status.

**Solution:** Added a dedicated payment status endpoint and connected it to the profile page.

## 5. Concepts Learned

- OAuth 2.0 authorization flow.
- Google authorization code flow.
- OAuth state validation.
- Google ID token verification.
- Application JWT generation and verification.
- HTTP-only cookies.
- Credentialed CORS requests.
- Protected Express routes.
- Khalti payment initiation.
- Payment identifiers and purchase order IDs.
- Payment lookup and backend verification.
- NPR-to-paisa conversion.
- Pending, paid, and failed order states.
- React `useEffect` and `useState` for retrieving and displaying backend data.
- The difference between payment verification and order status management.

## 6. Current Limitations

The application uses an in-memory Map instead of a database.

Therefore:
- Payment records are temporary.
- Backend restarts clear the records.
- The project does not yet provide persistent order history.
- It is a learning demo and should not be used as a production payment system.

## 7. Final Outcome

The Google OAuth + Khalti sandbox integration was completed successfully.

A user can sign in using Google, access a protected profile, initiate a Khalti payment, complete the sandbox checkout, and have the backend verify the transaction.

After successful verification, the backend changes the order status to `paid`, and the frontend displays the updated payment status on the profile.

**Final result:** Core authentication, payment processing, payment verification, and paid-status display are working.

## 8. Future Improvements

- Store users, orders, and payments in MySQL or PostgreSQL.
- Persist payment status across backend restarts.
- Implement payment history.
- Prevent duplicate successful payment processing.
- Add stronger payment reconciliation and error handling.
- Add automated integration tests for payment status transitions.
- Improve the payment result page by retrieving verified order information from the backend.
