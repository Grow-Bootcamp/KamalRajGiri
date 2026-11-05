# Week 7 Day 4 — Handnote
## Context API, useReducer, React Hooks & Chart Libraries

### 1. Context API

Context API allows us to share data across multiple components without manually passing props through intermediate components.

**Main functions:**
- `createContext()` — creates a context.
- `useContext()` — consumes context data.
- Provider — makes context data available to child components.

**Benefits:**
- Avoids prop drilling.
- Supports shared application state.
- Useful for authentication, themes, and global preferences.

### 2. useReducer

`useReducer` manages state through a reducer function and dispatched actions.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

Important concepts:
- State: Current application data.
- Action: Describes what should happen.
- Dispatch: Sends an action to the reducer.
- Reducer: Returns the next state based on the current state and action.

Our Todo reducer supports:
- `add`
- `toggle`
- `delete`
- `clearDone`

**useState vs useReducer:**
- `useState`: Suitable for simple state.
- `useReducer`: Suitable for complex state transitions involving multiple actions.

### 3. useState

`useState` manages component-level state.

```tsx
const [count, setCount] = useState(0);
```

Important points:
- State updates schedule a re-render.
- Never mutate state directly.
- Use functional updates when the next value depends on the previous value.

```tsx
setCount((previous) => previous + 1);
```

### 4. useEffect

`useEffect` synchronizes components with external systems.

```tsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

Dependency behavior:
- No dependency array: runs after every committed render.
- `[]`: runs after the initial mount.
- `[count]`: runs when count changes.

Cleanup example:

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Running');
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

Cleanup is important for timers, subscriptions, and requests.

Avoid effects for values that can be calculated directly from existing state or props.

### 5. useMemo

`useMemo` caches a calculated value between renders.

```tsx
const square = useMemo(() => count * count, [count]);
```

- Recalculates when a dependency changes.
- Reuses the previous result when dependencies remain unchanged.
- Useful for expensive calculations.
- Avoid unnecessary use for cheap calculations.

### 6. useCallback

`useCallback` caches a function reference between renders.

```tsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

Useful when:
- Passing callbacks to memoized child components.
- Preventing unnecessary function-reference changes.
- Using functions as dependencies in other hooks.

**Difference:**
- `useMemo`: Caches a calculated value.
- `useCallback`: Caches a function reference.

`useCallback` alone does not prevent re-renders. It can help `React.memo` skip unnecessary child renders when props remain unchanged.

### 7. useRef

`useRef` stores a mutable value that persists between renders without triggering a re-render when changed.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

inputRef.current?.focus();
```

Common uses:
- Accessing DOM elements.
- Focusing inputs.
- Storing timer IDs.
- Keeping mutable values that do not directly affect the UI.

**useState vs useRef:**
- `useState`: Updating the value triggers a re-render.
- `useRef`: Updating `.current` does not trigger a re-render.

### 8. Custom Hooks

Custom hooks extract reusable stateful logic from components.

Rules:
- Names must start with `use`.
- Hooks must be called at the top level.
- Custom hooks can be called inside React components or other custom hooks.

#### A. useLocalStorage<T>

Purpose: Persist application values in browser local storage.

Implementation concepts:
- Generic TypeScript support.
- Lazy state initialization using `useState`.
- Retrieve stored data using `localStorage.getItem()`.
- Parse JSON using `JSON.parse()`.
- Persist updated state using `useEffect`.
- Serialize values using `JSON.stringify()`.

```tsx
const [value, setValue] = useLocalStorage('theme', 'light');
```

This allows components to reuse local storage logic without implementing it repeatedly.

#### B. useFetch<T>

Purpose: Reusable data fetching with loading and error handling.

Implementation concepts:
- Generic TypeScript type `<T>`.
- `useState` for data, loading, and error.
- `useEffect` to fetch data when the URL changes.
- `fetch()` to request API data.
- `response.ok` to detect HTTP errors.
- `AbortController` to cancel outdated requests.
- Cleanup function to abort requests.
- Error handling for failed requests and aborted requests.

Example:

```tsx
const { data, loading, error } = useFetch<User[]>(
  'https://jsonplaceholder.typicode.com/users'
);
```

The consuming component handles:
1. Loading state.
2. Error state.
3. Successful data rendering.

**Important:** TypeScript generics describe the expected response type but do not validate the actual JSON returned by an API.

### 9. Rules of Hooks

1. Call hooks only at the top level.
2. Do not call hooks inside loops, conditions, or nested functions.
3. Call hooks only inside React components or custom hooks.
4. Custom hook names should begin with `use`.

### 10. React Chart Libraries

#### Recharts
- React-oriented charting library.
- Uses reusable React components.
- Supports responsive charts and data visualization.

Implemented chart types:
- Pie
- Bar
- Horizontal Bar
- Stacked Bar
- Line
- Area
- Doughnut
- Radar
- Composed

#### Chart.js
- JavaScript charting library.
- Uses configuration-based chart definitions.
- `react-chartjs-2` provides React components for Chart.js.

Important concepts:
- Labels represent chart categories.
- Datasets contain numerical values.
- Options control chart appearance and behavior.
- Responsive configuration adapts charts to available space.

An initial monthly bar chart was implemented using Chart.js.

### 11. Key Takeaways

- Context API shares data across component trees.
- `useReducer` organizes state transitions through actions.
- `useMemo` caches values.
- `useCallback` caches function references.
- `useRef` stores mutable values without triggering renders.
- Custom hooks promote reusable logic.
- `AbortController` helps manage outdated fetch requests.
- Chart libraries convert structured data into visual representations.