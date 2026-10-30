# Week 6 Day 4 — React Lifecycle Methods & Weekly Presentation
## Handnote: React Lifecycle Monitor Dashboard

### 1. Today's Objective

Understand how React components behave throughout their lifecycle and implement a dashboard that demonstrates:

- Mounting, updating, and unmounting in class components.
- Lifecycle behavior using `useEffect` in functional components.
- State updates and effect dependency arrays.
- Timer setup and cleanup.
- Browser document title updates.
- API fetching with loading, error, and success states.
- Parent-child communication and lifecycle event logging.
- Responsive UI styling with CSS.

---

## 2. React Component Lifecycle

A component's lifecycle describes the stages it goes through while being used by a React application.

### A. Mounting

Mounting occurs when a component is rendered and added to the DOM for the first time.

Class component methods:
- `constructor()`: initializes state and prepares the component.
- `render()`: describes the UI React should display.
- `componentDidMount()`: runs after the component mounts.

Example:

```tsx
componentDidMount() {
  console.log("Component mounted");
}
```

Typical uses:
- Starting a timer.
- Fetching initial data.
- Setting up subscriptions.
- Registering event listeners.

### B. Updating

Updating occurs when a component receives new props or its state changes.

Class component method:

```tsx
componentDidUpdate() {
  console.log("Component updated");
}
```

Typical causes:
- Calling `setState()`.
- Receiving changed props.
- Updating data that affects the rendered UI.

Important: `componentDidUpdate()` runs after updates, not just once after mounting.

### C. Unmounting

Unmounting occurs when a component is removed from the rendered UI.

Class component method:

```tsx
componentWillUnmount() {
  console.log("Component is being removed");
}
```

Typical cleanup tasks:
- Clearing timers.
- Removing event listeners.
- Unsubscribing from subscriptions.
- Cancelling or ignoring obsolete asynchronous work.

**Key principle:** If a component starts a resource that continues running, it should usually clean up that resource when it is no longer needed.

---

## 3. Class Component Lifecycle Implementation

Our `ClockClass.tsx` uses a class component to display the current time.

### State and props

```tsx
type ClockClassProps = {
  onLog: (message: string) => void;
};

type ClockState = {
  time: Date;
};
```

- `ClockClassProps` defines the data and functions received from the parent.
- `ClockState` defines the component's internal state.
- `time` stores a JavaScript `Date` object.
- `onLog` allows the component to notify its parent about selected lifecycle events.

### Constructor

```tsx
constructor(props: ClockClassProps) {
  super(props);
  this.state = { time: new Date() };
}
```

The constructor initializes the clock state.

`super(props)` calls the parent `Component` constructor so the class component can initialize correctly.

### Starting the timer

```tsx
componentDidMount() {
  this.props.onLog("Class Clock mounted");

  this.timerId = setInterval(() => {
    this.setState({ time: new Date() });
  }, 1000);
}
```

Explanation:

1. The component mounts.
2. The parent is notified that the clock mounted.
3. `setInterval()` schedules a callback every 1,000 milliseconds.
4. `setState()` stores the latest time.
5. React updates the displayed time.

### Rendering the time

```tsx
render() {
  return (
    <p>The time is {this.state.time.toLocaleTimeString()}</p>
  );
}
```

`toLocaleTimeString()` converts the `Date` object into a readable local time string.

### Cleaning up the timer

```tsx
componentWillUnmount() {
  this.props.onLog("Class Clock unmounted");

  if (this.timerId !== undefined) {
    clearInterval(this.timerId);
  }
}
```

`clearInterval()` stops the timer and prevents it from continuing after the clock is removed.

### Important implementation detail

Our `componentDidUpdate()` currently logs to the console only:

```tsx
componentDidUpdate() {
  console.log("4. Component Did Update");
}
```

We intentionally removed `this.props.onLog()` from this method to prevent an infinite update loop, explained in Section 8.

---

## 4. Functional Component Lifecycle with `useEffect`

Functional components do not use class lifecycle methods. Instead, they can use hooks such as `useState` and `useEffect`.

Our `ClockFunction.tsx` uses:

```tsx
const [time, setTime] = useState<Date>(new Date());
```

`useState` stores the time. Calling `setTime()` requests a React re-render with the new value.

### Effect setup and cleanup

```tsx
useEffect(() => {
  onLog("Function clock effect setup");

  const timerId = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => {
    clearInterval(timerId);
    onLog("Function clock effect cleanup");
  };
}, [onLog]);
```

The effect:

1. Runs its setup after the component commits.
2. Starts a timer.
3. Updates the clock state every second.
4. Returns a cleanup function.
5. Clears the timer when the effect must clean up.

The dependency array contains `onLog`. Because the parent wraps its callback in `useCallback` with an empty dependency array, the callback reference remains stable during ordinary parent renders. Therefore, the effect does not need to restart on every clock tick.

### `useEffect` dependency patterns

| Dependency array | Behavior |
|---|---|
| No dependency array | Effect setup runs after every committed render. |
| `[]` | Effect setup runs after the initial mount; cleanup runs when it unmounts, with an additional development check possible in Strict Mode. |
| `[count]` | Effect setup runs after mounting and when `count` changes. Cleanup runs before the effect is set up again and when it unmounts. |

**Important:** Effects synchronize React components with external systems. They are not required for every calculation or event handler.

---

## 5. `useState`, `useEffect`, and the Browser Title

Our `TitleCounter.tsx` combines state and an effect:

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

The button updates the state:

```tsx
<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>
```

### How it works

1. The initial count is `0`.
2. React renders the button.
3. The effect updates the browser tab title to `Count: 0`.
4. Clicking the button updates the count.
5. React re-renders the component.
6. Since `count` changed, the effect updates the browser title.

`document.title` is a browser DOM API that changes the title displayed in the browser tab.

**Interview point:** `useEffect` is useful here because changing the document title is a side effect outside React's rendered component output.

---

## 6. Fetching API Data with `UserList`

Our `UserList.tsx` retrieves users from JSONPlaceholder.

```tsx
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

These state variables represent three different concerns:

- `users`: the retrieved user data.
- `loading`: whether the request is still in progress.
- `error`: an error message if the request fails.

### API request lifecycle

```text
Component mounts
      |
      v
Loading = true
      |
      v
Fetch user data
      |
      +---- Request succeeds ----> Store users
      |
      +---- Request fails -------> Store error
      |
      v
Finally: loading = false
      |
      v
Render success or error UI
```

### Why check `response.ok`?

```tsx
const response = await fetch(
  "https://jsonplaceholder.typicode.com/users"
);

if (!response.ok) {
  throw new Error("Could not load user");
}
```

`fetch()` does not automatically reject its promise for HTTP error statuses such as 404 or 500. Checking `response.ok` ensures those responses are treated as errors by our application.

### Why use `try`, `catch`, and `finally`?

- `try`: performs the request and processes the response.
- `catch`: handles failures.
- `finally`: turns off the loading indicator whether the request succeeds or fails.

The `User` type describes the fields our UI uses:

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};
```

The list uses a stable key:

```tsx
<li key={user.id}>
  <strong>{user.name}</strong> - {user.email}
</li>
```

React uses keys to identify list items across renders.

**Limitation:** TypeScript's `as User[]` annotation or a type annotation on parsed JSON does not validate the actual response at runtime. Real applications may need runtime validation, request cancellation, and handling for malformed data.

---

## 7. Parent-Child Communication and Lifecycle Logging

The `App.tsx` component manages visibility and the shared event log.

### Independent visibility state

```tsx
const [showClassClock, setShowClassClock] = useState(true);
const [showFunctionClock, setShowFunctionClock] = useState(true);
const [showCounter, setShowCounter] = useState(true);
```

Each state variable independently controls one component.

For example:

```tsx
{showClassClock && <ClockClass onLog={addLog} />}
```

When `showClassClock` is `true`, React renders the clock. When it becomes `false`, React removes the clock, triggering its unmount lifecycle.

### Shared log state

```tsx
const [messages, setMessages] = useState<string[]>([]);
```

The parent owns the event log so events from multiple child components can appear in one place.

### Functional state update

```tsx
setMessages((previous) =>
  [`${timeStamp} - ${message}`, ...previous].slice(0, 20)
);
```

This update:
- Uses the previous state safely.
- Places the newest message first.
- Keeps only the newest 20 messages.

### Why use `useCallback`?

```tsx
const addLog = useCallback((message: string) => {
  const timeStamp = new Date().toLocaleTimeString();

  setMessages((previous) =>
    [`${timeStamp} - ${message}`, ...previous].slice(0, 20)
  );
}, []);
```

`useCallback` preserves the function reference between ordinary renders when its dependencies do not change.

This matters because `ClockFunction` includes `onLog` in its effect dependencies. Without a stable callback, parent re-renders could produce a new function reference and cause unnecessary effect cleanup and setup.

**Caution:** `useCallback` is useful when reference stability matters; it is not necessary for every function.

---

## 8. Troubleshooting: Maximum Update Depth Exceeded

During development, the application produced:

`Maximum update depth exceeded`

The stack trace pointed to `setMessages()` in `App.tsx` and `ClockClass.componentDidUpdate()`.

### Root cause

The update cycle was:

```text
ClockClass state changes
        |
        v
componentDidUpdate()
        |
        v
onLog() calls parent setMessages()
        |
        v
App re-renders
        |
        v
ClockClass updates again
        |
        v
componentDidUpdate() runs again
        |
        v
Repeat indefinitely
```

The issue was not simply that the timer existed. The problem was that every component update triggered another parent state update, which caused another update.

### Fix applied

Remove the parent logging callback from `componentDidUpdate()`:

```tsx
componentDidUpdate() {
  console.log("4. Component Did Update");
}
```

Keep the mount and unmount notifications, while observing frequent update messages in the console.

### General lesson

A lifecycle method that runs after updates must not unconditionally trigger another state update that causes the same lifecycle method to run again.

If an update must trigger a state change, use a specific condition or compare previous props/state, and make sure the update can settle. In this dashboard, console logging is the simpler solution.

---

## 9. Responsive CSS and UI Styling

The `App.css` file styles the dashboard without changing its React behavior.

### Main techniques used

- Global reset with `box-sizing: border-box`.
- Theme colors, typography, and page background.
- Centered layout using `width: min(1100px, 92%)`.
- Card-like sections using padding, borders, rounded corners, and shadows.
- Button hover, active, and keyboard-focus states.
- Responsive spacing with media queries.
- `overflow-wrap: anywhere` to prevent long log messages from overflowing.
- `clamp()` to make the main heading scale with viewport width.

### Why separate CSS from React?

React components describe structure and behavior. CSS controls visual presentation and layout.

This separation makes the interface easier to maintain and allows visual changes without modifying lifecycle logic.

### Styling the lifecycle log reliably

If the log section needs its own styling, assign it a class:

```tsx
<section className="lifecycle-log">
  {/* Lifecycle log content */}
</section>
```

Then style it explicitly:

```css
.lifecycle-log {
  border-left: 4px solid #0d9488;
}
```

A dedicated class is clearer and more reliable than depending on a structural selector such as `:last-of-type`.

---

## 10. Common Mistakes and Interview Traps

1. **Confusing render with mount:** A render is not the same as the first mount. A component can render repeatedly while remaining mounted.
2. **Forgetting timer cleanup:** Unremoved intervals can continue running after a component is removed.
3. **Misunderstanding dependencies:** `[count]` means the effect synchronizes when `count` changes; it does not mean the effect runs only once.
4. **Assuming `fetch()` rejects for HTTP errors:** It usually rejects for network-level failures, not merely because the server returns 404 or 500.
5. **Using array indexes as keys by default:** Prefer stable identifiers when available.
6. **Updating parent state from every child update:** This can create an infinite render/update cycle.
7. **Treating `useCallback` as a universal optimization:** Use it when stable function identity is useful.
8. **Ignoring React Strict Mode:** In development, Strict Mode may run an extra effect setup/cleanup cycle to expose unsafe behavior. This is not necessarily a production bug.
9. **Assuming TypeScript types validate API responses:** Type annotations do not provide runtime validation.
10. **Assuming unmounting resets all state everywhere:** State belonging to a removed component is discarded, but state owned by its parent remains.

---

## 11. Mentor Defense Questions

### Q1. What are the three main class lifecycle phases?

**Answer:** Mounting creates and inserts the component, updating re-renders it when relevant props or state change, and unmounting removes it.

### Q2. What is the purpose of `componentDidMount()`?

**Answer:** It runs after mounting and is useful for starting timers, subscriptions, or initial data-fetching workflows.

### Q3. Why do we clear an interval in `componentWillUnmount()`?

**Answer:** To stop scheduled callbacks after the component is removed and avoid unnecessary background work.

### Q4. How does `useEffect` correspond to class lifecycle behavior?

**Answer:** `useEffect` can perform setup after a component commits and return cleanup logic. Dependencies determine when the effect must be re-synchronized. It is a functional alternative for many lifecycle use cases, not a literal one-to-one mapping of every class method.

### Q5. What does an empty dependency array mean?

**Answer:** The effect has no reactive dependencies to track. Its setup runs after the initial mount, with cleanup on unmount; development Strict Mode can perform an additional setup/cleanup check.

### Q6. Why did the maximum update depth error occur?

**Answer:** `componentDidUpdate()` called a parent callback that updated parent state. That re-rendered the child, triggering `componentDidUpdate()` again and repeating the cycle.

### Q7. Why did we use `useCallback` for `addLog`?

**Answer:** To keep its function reference stable so it does not unnecessarily trigger effect re-synchronization in the functional clock.

### Q8. Why do we track loading, error, and data separately?

**Answer:** They represent different parts of the asynchronous request state and allow the UI to display the correct loading, failure, or success feedback.

### Q9. What is the difference between props and state?

**Answer:** Props are values passed from a parent to a child. State is data managed by a component that can change and trigger a re-render.

### Q10. Why use functional state updates?

**Answer:** They calculate the next state from the previous state, which is useful when updates depend on the current value and React may batch updates.

### Q11. What does conditional rendering achieve in the dashboard?

**Answer:** It controls whether a component exists in the rendered tree. Hiding a clock this way unmounts it, so its cleanup lifecycle runs.

### Q12. What is the purpose of responsive CSS?

**Answer:** It adapts the layout, spacing, and controls to different viewport sizes while keeping the application usable on desktop and mobile.

---

## 12. Final Revision Checklist

- [ ] Explain mounting, updating, and unmounting without memorizing only method names.
- [ ] Explain the role of `constructor`, `render`, `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.
- [ ] Explain `useState`, `useEffect`, dependency arrays, and cleanup.
- [ ] Explain how the class and functional clocks update their time.
- [ ] Explain how the title counter synchronizes `document.title`.
- [ ] Explain the API request's loading, success, and error paths.
- [ ] Explain props, parent callbacks, shared state, and conditional rendering.
- [ ] Explain the maximum update depth bug and its fix.
- [ ] Explain stable keys, `useCallback`, Strict Mode, and runtime API validation.
- [ ] Verify the dashboard behaves correctly and the responsive CSS is applied.

### Final takeaway

The React Lifecycle Monitor Dashboard demonstrates how React handles component creation, updates, cleanup, effects, asynchronous data, and shared state. The most important lesson is to connect lifecycle behavior to cause and effect: state changes trigger renders, effects synchronize with external systems, and cleanup prevents resources from outliving the component that created them.