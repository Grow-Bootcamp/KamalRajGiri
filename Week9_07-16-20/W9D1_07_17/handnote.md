# Week 7 Day 3 — State Management with Redux & Redux Toolkit

## 1. What Is State Management?

State is information an application remembers while it is running.

Examples:
- Logged-in user
- Shopping cart items
- Form input
- Modal visibility
- Selected theme

React's `useState` manages local component state. When multiple components need the same data, we may lift state to a common parent, use Context API, or use a centralized state-management library such as Redux Toolkit.

### The problem: Prop Drilling

Prop drilling means passing data through intermediate components that do not need that data, simply to reach a deeply nested component.

For example:

App → Navbar → Header → UserProfile

If only UserProfile needs user information, passing it through every intermediate component can become inconvenient.

---

## 2. Five Important Redux Terms

### Store
The central object that holds the application's Redux state.

### Slice
An organized section of the Redux store containing a feature's initial state and reducers.

Example:
- cart slice
- auth slice
- products slice

### Action
An object describing an event that happened.

An action typically contains:
- type
- payload (optional data)

Example:
`{ type: 'cart/clearCart' }`

### Reducer
A function that receives the current state and an action and calculates the next state.

Reducers should be predictable and free of side effects.

### Dispatch
The function used to send an action to the Redux store.

Example:
`dispatch(addToCart(product))`

---

## 3. Redux Data Flow

The normal Redux flow is:

1. User interacts with a component.
2. Component dispatches an action.
3. Redux processes the action.
4. The reducer calculates the next state.
5. Store holds the updated state.
6. Components using affected selections receive updates and re-render.

Important distinction:
- Action describes what happened.
- Reducer decides how state changes.
- Dispatch sends the action.

---

## 4. Redux Toolkit

Redux Toolkit (RTK) is the recommended approach for writing Redux logic.

It reduces boilerplate and provides utilities such as:

- `configureStore()`
- `createSlice()`
- `PayloadAction`

### createSlice()

Creates a slice containing initial state, reducers, and generated action creators.

Example:

```ts
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
});
```

Redux Toolkit uses Immer internally. This allows mutation-like syntax inside slice reducers while producing immutable updates.

Never directly mutate Redux state from a component.

### configureStore()

Creates the Redux store and combines reducers.

```ts
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
```

### TypeScript types

```ts
export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;
```

These infer the application's state structure and dispatch type.

---

## 5. Connecting Redux to React

React-Redux provides:

### Provider

Wraps the React application and makes the store available to descendant components.

```tsx
<Provider store={store}>
  <App />
</Provider>
```

### useSelector

Reads selected Redux state.

```tsx
const items = useAppSelector(
  (state) => state.cart.items
);
```

### useDispatch

Provides the dispatch function.

```tsx
const dispatch = useAppDispatch();

dispatch(addToCart(product));
```

Typed hooks make Redux usage safer and more convenient in TypeScript applications.

---

## 6. Shopping Cart Implementation

The project contains:

- `src/app/store.ts`
- `src/app/hooks.ts`
- `src/features/cart/cartSlice.ts`
- `src/components/Navbar.tsx`
- `src/pages/Products.tsx`
- `src/pages/Cart.tsx`

### Cart actions

- `addToCart`: Adds a product or increments its existing quantity.
- `removeFromCart`: Removes a product using its ID.
- `changeQuantity`: Changes quantity while enforcing a minimum of one.
- `clearCart`: Removes all cart items.

### Derived total

```ts
const total = items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
```

Derived values should usually be calculated from existing state rather than stored separately.

### Why use product IDs?

A product ID identifies the product uniquely. It allows the reducer to find existing products and update their quantities rather than creating duplicate rows.

---

## 7. localStorage Persistence

Redux store state normally exists in memory. A browser refresh creates a new store.

We implemented persistence using localStorage.

Important methods:

- `localStorage.getItem()`: Retrieves saved data.
- `JSON.parse()`: Converts JSON text into JavaScript data.
- `preloadedState`: Initializes Redux with previously saved state.
- `store.subscribe()`: Runs a callback after store updates.
- `JSON.stringify()`: Converts JavaScript data into JSON text.
- `localStorage.setItem()`: Saves the serialized data.

### Persistence flow

Browser starts → Load saved cart → Initialize Redux → User dispatches action → Redux updates → Save updated cart.

Runtime validation is important because TypeScript types do not validate data retrieved from browser storage.

localStorage is browser-specific storage, not a replacement for a database or secure server-side persistence.

---

## 8. useState vs Context API vs Redux Toolkit

### useState
Best for local component state.

Examples:
- Modal visibility
- Form inputs
- Dropdown visibility

### Context API
Best for sharing relatively simple values across many components.

Examples:
- Theme
- Language
- Current user information

Context can be combined with `useReducer` for more structured state updates.

### Redux Toolkit
Useful for complex or frequently updated shared state.

Examples:
- Shopping cart
- Product lists
- Complex application state

### Comparison

| Feature | useState | Context API | Redux Toolkit |
|---|---|---|---|
| Purpose | Local state | Shared values | Centralized state |
| Setup | Simple | Moderate | Structured |
| Prop drilling | Doesn't solve directly | Avoids it | Avoids it |
| Reducers | No | Optional | Built-in |
| DevTools | React DevTools | React DevTools | Redux DevTools |

Choose the simplest approach that adequately solves the application's state-management problem.

---

## 9. Common Mistakes

1. Missing Provider: Redux hooks cannot access the store.
2. Incorrect selector path: Use the actual store structure, such as `state.cart.items`.
3. Forgetting dispatch: Calling an action creator alone does not update the store.
4. Direct mutation: Never mutate selected Redux state in a component.
5. Duplicating derived state: Calculate totals from cart items instead of maintaining a separate total state.
6. Trusting localStorage data: Validate parsed runtime data before using it.

---

## 10. Final Revision

- Store: Holds Redux state.
- Slice: Organizes one feature's state and reducers.
- Action: Describes an event.
- Reducer: Calculates the next state.
- Dispatch: Sends an action.
- Provider: Makes the store accessible to React.
- useSelector: Reads selected state.
- useDispatch: Dispatches actions.
- Immer: Enables mutation-like reducer syntax while preserving immutable updates.
- localStorage: Persists browser data between refreshes.

**Main takeaway:** Redux Toolkit provides predictable, centralized state management for complex shared application state.