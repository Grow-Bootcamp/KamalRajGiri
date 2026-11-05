# Week 7 Day 4 — Learning Log

**Topic:** Context API, `useReducer`, React Hooks, Custom Hooks, and Chart Libraries

## Project Overview

Built a Todo Management and Analytics Dashboard with React, TypeScript, and Vite. The project demonstrates shared state management using Context API and `useReducer`, reusable hook patterns, and data visualization with Recharts and Chart.js.

## Work Completed

### 1. Context API and `useReducer`

- Created a typed Todo context and a `TodoProvider` at the application root.
- Managed the Todo collection with `useReducer` instead of prop drilling or Redux.
- Implemented reducer actions for:
  - Adding a Todo.
  - Toggling completion.
  - Deleting a Todo.
  - Clearing completed Todos.
- Used immutable state updates in the reducer.
- Created a reusable `useTodos()` hook that exposes Todo state and its dispatcher.
- Added a provider check so `useTodos()` throws a clear error when used outside `TodoProvider`.

```tsx
const [todos, dispatch] = useReducer(todoReducer, initialTodos);
```

### 2. React Hooks

Studied and practiced:

- `useState` for component-level state and functional updates.
- `useEffect` for synchronizing with external systems, including cleanup for timers and requests.
- `useMemo` for caching calculated values when dependencies have not changed.
- `useCallback` for caching function references passed to memoized children.
- `useRef` for DOM access and mutable values that should not trigger re-renders.
- Custom hooks for reusable stateful logic.

Practical examples included:

- Memoized square calculation with `useMemo`.
- Memoized child callback with `useCallback` and `React.memo`.
- Input focusing with `useRef`.
- Local-storage preference management with `useLocalStorage`.
- API data fetching with `useFetch`.

### 3. Custom Hooks Implementation

**useLocalStorage<T>**

- Implemented a generic custom hook for browser local storage.
- Used lazy state initialization to retrieve previously stored values.
- Used `JSON.parse()` to restore stored data.
- Used `JSON.stringify()` and `useEffect` to persist updated values.
- Returned the stored value and its state setter for reusable consumption.

**useFetch<T>**

- Implemented a generic custom hook for reusable API requests.
- Managed data, loading, and error states.
- Used `useEffect` to fetch data when the URL changes.
- Added HTTP response validation using `response.ok`.
- Implemented request cancellation using `AbortController`.
- Added cleanup to cancel outdated requests and handled `AbortError`.

**UserExample**

- Integrated `useFetch<User[]>` to retrieve user information from JSONPlaceholder.
- Displayed loading and error states.
- Rendered fetched user names and email addresses.
- Used stable user IDs as React list keys.

### 4. Rules and Best Practices for Hooks

- Hooks must be called at the top level, not inside loops, conditions, or nested functions.
- Hooks must be called from React components or other custom hooks.
- Custom hook names must start with `use`.
- State should not be mutated directly.
- Effects should not be used for values that can be calculated directly from props or state.
- Cleanup functions should be used when effects create resources that need to be released.

### 5. Data Visualization

**Recharts**

Implemented and explored:

- Pie Chart
- Bar Chart
- Horizontal Bar Chart
- Stacked Bar Chart
- Line Chart
- Area Chart
- Doughnut Chart
- Radar Chart
- Composed Chart

The Todo Status Chart uses data from Todo Context. Other analytics charts use monthly, category, and skill datasets.

**Chart.js**

- Installed `chart.js` and `react-chartjs-2`.
- Configured the required chart elements, scales, and plugins.
- Implemented an initial monthly bar chart.
- Reviewed labels, datasets, chart options, and responsive configuration.
- Additional Chart.js chart practice remains planned.

## Key Learnings

- Context API shares data across a component tree and helps avoid prop drilling.
- `useReducer` is useful for complex state transitions with multiple related actions.
- `useState` suits simple local state, while `useReducer` centralizes predictable state transitions.
- `useMemo` caches a computed value; `useCallback` caches a function reference.
- `useRef` preserves mutable values without causing a render when `.current` changes.
- Custom hooks make stateful logic reusable and easier to maintain.
- TypeScript generics make custom hooks reusable across different data types.
- `AbortController` helps cancel outdated API requests.
- API-driven components should handle loading, error, and successful data states.
- Recharts uses composable React components, while Chart.js uses a configuration-based approach.

## Verification

The project includes the required Todo management, Context API, React Hooks, custom hooks, Recharts visualizations, and initial Chart.js implementation.

Verification commands:

```bash
npm run typecheck
npm run build
```

The initial Chart.js implementation passed type checking and production build verification. A Vite bundle-size warning was observed but did not prevent the build from completing.

Final verification of the complete updated project remains pending.

## Pending Work

- Continue practicing additional Chart.js chart types.
- Complete the remaining `useRef` render-counter exercise.
- Perform additional custom hook revision and edge-case testing.
- Complete final project verification with type checking and a production build.
- Commit the learning log and practice code.
- Raise a GitHub Pull Request for review.
- Share the learning-log and PR links in the OpenProject comment and the corresponding Microsoft Teams thread.

**Status:** Context API, `useReducer`, Todo management, React Hook practice, custom hook implementations, Recharts visualizations, and the initial Chart.js bar chart are implemented. Additional revision, Chart.js practice, final verification, commit, and PR communication remain pending.