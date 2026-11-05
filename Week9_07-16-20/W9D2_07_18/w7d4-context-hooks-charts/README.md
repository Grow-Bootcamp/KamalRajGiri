# Week 7 Day 4 — Context API, Hooks & Chart Libraries

## Project Overview

This project demonstrates React global state management using Context API and `useReducer`, practical implementation of React Hooks, reusable custom hooks, and data visualization using Recharts and Chart.js.

The application is a Todo Management and Analytics Dashboard.

## Technologies Used

- React
- TypeScript
- Vite
- Context API
- useReducer
- React Hooks
- Recharts
- Chart.js
- react-chartjs-2
- CSS
- Browser Local Storage
- Fetch API

## Implemented Features

### 1. Global State Management

Implemented Todo state management using Context API and `useReducer`.

Features:
- Add todos.
- Toggle completion status.
- Delete todos.
- Clear completed todos.
- Share Todo state across components.

Created:
- Typed Todo interface.
- Discriminated union for Todo actions.
- Reducer function.
- Context provider.
- Reusable `useTodos()` hook.

### 2. React Hooks Practice

Studied and practised:

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- `useRef`
- Custom Hooks

Practical examples included:
- Memoized calculations using `useMemo`.
- Stable callback references using `useCallback`.
- Preventing unnecessary child renders using `React.memo`.
- Accessing and focusing DOM elements using `useRef`.

### 3. Custom Hooks

#### useLocalStorage<T>

Implemented a reusable custom hook for browser local storage.

Features:
- Generic TypeScript support.
- Lazy initialization from stored values.
- JSON parsing and serialization.
- Automatic persistence when the value changes.
- Reusable state and setter returned to consuming components.

Example:

```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

#### useFetch<T>

Implemented a reusable generic data-fetching hook.

Features:
- API requests using Fetch API.
- Loading state management.
- Error handling.
- HTTP response validation.
- Request cancellation using `AbortController`.
- Cleanup when the URL changes or the component unmounts.

Created `UserExample` to demonstrate fetching and rendering user data from JSONPlaceholder.

The component handles loading, error, and successful response states.

### 4. Data Visualization with Recharts

Implemented multiple chart types:

- Pie Chart
- Bar Chart
- Horizontal Bar Chart
- Stacked Bar Chart
- Line Chart
- Area Chart
- Doughnut Chart
- Radar Chart
- Composed Chart

Created shared analytics datasets for monthly tasks, categories, and skills.

The Todo Status Chart uses actual Todo Context data.

### 5. Chart.js

Installed Chart.js and `react-chartjs-2`.

Implemented:
- Chart.js registration and configuration.
- Monthly bar chart using sample analytics data.
- Chart options for responsiveness, title, legend, and axis configuration.

Further Chart.js chart implementations are planned for additional practice.

## Project Structure

```text
src/
├── components/
│   ├── todos/
│   └── charts/
│       ├── recharts/
│       └── chartjs/
├── context/
│   ├── TodoContext.tsx
│   └── todoReducer.ts
├── data/
│   └── analyticsData.ts
├── examples/
│   └── hooks/
├── hooks/
│   ├── useFetch.ts
│   └── useLocalStorage.ts
├── pages/
│   ├── Todos.tsx
│   └── Analytics.tsx
├── types/
│   ├── todo.ts
│   └── analytics.ts
├── App.tsx
└── main.tsx
```

## Installation

Clone the repository:

```bash
git clone git@github.com:kamalrajgiri/GrowBootCamp.git
```

Navigate to the project directory:

```bash
cd GrowBootCamp/Week7_06-26-30/w7d4-context-hooks-charts
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Verification

Run TypeScript type checking:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

## Learning Outcomes

- Manage shared application state using Context API and `useReducer`.
- Understand and apply common React Hooks.
- Optimize calculations and callback references where appropriate.
- Access DOM elements using `useRef`.
- Create reusable custom hooks with TypeScript generics.
- Persist application preferences using local storage.
- Fetch API data with loading, error, and cancellation handling.
- Build data visualizations using Recharts and Chart.js.

## Current Status

- Context API and `useReducer` implementation completed.
- Todo management functionality implemented.
- Recharts analytics dashboard implemented.
- Practical React Hooks examples completed.
- `useLocalStorage<T>` implemented.
- `useFetch<T>` implemented.
- User API example implemented using JSONPlaceholder.
- Initial Chart.js monthly bar chart implemented.
- Additional hook revision and Chart.js practice planned for the weekend.

## Author

Kamal Raj Giri

Week 7 Day 4 — GrowBootCamp