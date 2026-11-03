# Week 7 Day 3 — Learning Log

**Topic:** State Management with Redux & Redux Toolkit

## Work Completed

### 1. State Management Concepts
- Studied local state, shared state, and prop drilling.
- Compared React `useState`, Context API, and Redux Toolkit.
- Identified suitable use cases and trade-offs for each approach.

### 2. Redux Toolkit Setup
- Installed `@reduxjs/toolkit` and `react-redux`.
- Configured a centralized Redux store using `configureStore`.
- Created a cart slice using `createSlice`.
- Implemented typed reducers and action payloads.

### 3. React-Redux Integration
- Connected Redux to React using the `Provider` component.
- Created typed `useAppSelector` and `useAppDispatch` hooks.
- Read cart state using selectors and dispatched actions from components.

### 4. Shopping Cart Implementation
- Created a Products page with Add to Cart functionality.
- Implemented Navbar cart quantity updates.
- Built a Cart page with quantity controls, remove functionality, and clear-cart functionality.
- Calculated individual subtotals and the overall cart total.
- Integrated React Router and toast notifications.
- Styled the cart using a responsive table layout.

### 5. State Persistence
- Implemented localStorage-based cart persistence.
- Loaded saved cart data using `preloadedState`.
- Used `store.subscribe()` to save cart updates automatically.
- Added runtime validation and error handling for stored data.

### 6. Testing and Verification
- Verified adding products and increasing duplicate product quantities.
- Tested quantity changes and minimum quantity enforcement.
- Verified product removal and clearing the cart.
- Confirmed cart restoration after browser refresh.
- Confirmed empty-cart behavior and Navbar quantity synchronization.
- Completed TypeScript type checking successfully.

## Key Learnings

- Understood Redux store, slices, actions, reducers, and dispatch.
- Learned how Redux Toolkit uses Immer for immutable state updates.
- Understood how Provider connects the Redux store to React.
- Learned how selectors subscribe components to selected state.
- Understood the difference between local, shared, and centralized state.
- Learned how to persist and validate application state using localStorage.

## Project Structure

```text
src/
├── app/
│   ├── hooks.ts
│   └── store.ts
├── features/
│   └── cart/
│       └── cartSlice.ts
├── components/
│   └── Navbar.tsx
├── pages/
│   ├── Products.tsx
│   ├── Cart.tsx
│   └── Cart.css
├── App.tsx
└── main.tsx
```

## Verification

- TypeScript type checking: Passed.
- Shopping cart functional tests: Passed.
- localStorage persistence tests: Passed.
- Redux and React integration: Verified.

## Status

Implementation and manual verification completed. Ready for Git commit, mentor pull request, and assignment submission.