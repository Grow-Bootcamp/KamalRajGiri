# Learning Log: React Lifecycle Methods and Weekly Summary

## Overview

This learning log summarizes the React lifecycle work documented in
`Week7_06-26-30/W7D4_06-29`. The practical project is a **React Lifecycle
Monitor** built with React, TypeScript, and Vite. It demonstrates component
mounting, updating, unmounting, effects, cleanup, asynchronous data loading,
parent-child communication, and responsive presentation.

## Learning Objectives

- Explain the mounting, updating, and unmounting phases of a React component.
- Relate class lifecycle methods to functional components using `useEffect`.
- Start and clean up timers safely.
- Use dependency arrays to control effect synchronization.
- Handle asynchronous API loading, success, and error states.
- Share state and callbacks between parent and child components.
- Diagnose and prevent an infinite update loop.

## React Component Lifecycle

A component's lifecycle describes how it behaves from creation through removal
from the rendered tree.

### Mounting

Mounting is the first render when a component is created and added to the DOM.
In a class component, the common sequence is:

1. `constructor()` initializes state.
2. `render()` returns the UI.
3. `componentDidMount()` runs after the component is committed.

`componentDidMount()` is an appropriate place to start a timer, fetch initial
data, subscribe to an external source, or register an event listener.

### Updating

Updating occurs when a component's state changes or it receives new props.
`render()` runs again, followed by `componentDidUpdate()` in a class
component. An update is not the same as a mount: a component may render many
times while remaining mounted.

### Unmounting

Unmounting occurs when React removes a component from the rendered tree.
`componentWillUnmount()` is used for cleanup, such as clearing timers,
removing listeners, and unsubscribing from external resources.

The key rule is: a component should clean up resources that it starts when
those resources are no longer needed.

## Class Component: Clock and Lifecycle Methods

[`ClockClass.tsx`](./Week7_06-26-30/W7D4_06-29/my-react-app/src/components/ClockClass.tsx)
uses a class component and stores the current time in state.

```tsx
class ClockClass extends Component<ClockClassProps, ClockState> {
  private timerId: ReturnType<typeof setInterval> | undefined;

  constructor(props: ClockClassProps) {
    super(props);
    this.state = { time: new Date() };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
    }
  }
}
```

The interval updates the clock once per second. Clearing the interval during
unmount prevents callbacks from continuing after the component has been
removed.

The component also logs lifecycle activity to the console. Its
`componentDidUpdate()` does not update parent state, which is important for
avoiding a render loop.

## Functional Component: `useEffect` as Lifecycle Behavior

[`ClockFunction.tsx`](./Week7_06-26-30/W7D4_06-29/my-react-app/src/components/ClockFunction.tsx)
implements the same timer behavior with hooks:

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

The effect setup runs after the component commits. The returned function is
the cleanup function and runs before the effect is re-synchronized and when
the component unmounts.

The dependency-array patterns are:

| Dependency array | Effect behavior |
| --- | --- |
| No array | Runs after every committed render. |
| `[]` | Runs after the initial mount and cleans up on unmount. |
| `[count]` | Runs after mounting and whenever `count` changes. |

The dependency list should contain values used by the effect that can change.
The parent stabilizes `onLog` with `useCallback`, so the function clock does
not restart its timer on every ordinary parent render.

`useEffect` is not required for every calculation or event handler. It is most
useful for synchronizing a component with an external system, such as a timer,
browser API, subscription, or network request.

## State and Browser Title Synchronization

[`TitleCounter.tsx`](./Week7_06-26-30/W7D4_06-29/my-react-app/src/components/TitleCounter.tsx)
combines `useState` and `useEffect`:

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

Clicking the button changes `count`, which causes a render. Because `count` is
in the dependency array, the effect then updates the browser tab title. This
is a side effect because `document.title` is outside React's rendered output.

## Fetching Data with Loading, Success, and Error States

[`UserList.tsx`](./Week7_06-26-30/W7D4_06-29/my-react-app/src/components/UserList.tsx)
fetches users from JSONPlaceholder when it mounts. The component keeps the
three states separate:

```tsx
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

The request flow is:

1. Render the loading message.
2. Fetch the user data in an effect.
3. Check `response.ok`, because `fetch()` does not reject merely for HTTP
   statuses such as 404 or 500.
4. Store the users when the request succeeds.
5. Store an error message when it fails.
6. Set `loading` to `false` in `finally`, regardless of the result.

The `User` type improves compile-time safety, and `user.id` provides a stable
React key for each rendered list item. TypeScript annotations do not validate
the response at runtime; production code may also need runtime validation,
request cancellation, and handling for malformed data.

## Parent-Child Communication and Conditional Rendering

[`App.tsx`](./Week7_06-26-30/W7D4_06-29/my-react-app/src/App.tsx) owns the
visibility state for the clocks and counter, as well as the shared lifecycle
message list.

```tsx
const addLog = useCallback((message: string) => {
  const timeStamp = new Date().toLocaleTimeString();

  setMessages((previous) =>
    [`${timeStamp} - ${message}`, ...previous].slice(0, 20)
  );
}, []);
```

Important ideas demonstrated here:

- Props pass values and callbacks from a parent to a child.
- State belongs to the component responsible for managing it.
- Functional state updates calculate the next value from the previous value.
- The log is capped at 20 messages and displays newest messages first.
- `useCallback` keeps `addLog`'s function identity stable.
- Conditional rendering controls whether a child exists in the tree.
- Hiding a clock unmounts it, so its timer cleanup runs.

[`LifeCycleLog.tsx`](./Week7_06-26-30/W7D4_06-29/my-react-app/src/components/LifeCycleLog.tsx)
renders an empty-state message until lifecycle events are available, then
renders the messages as a list.

## Troubleshooting: Maximum Update Depth Exceeded

The dashboard initially risked an infinite update cycle when
`componentDidUpdate()` called the parent's logging callback:

```text
Clock state changes
  -> componentDidUpdate()
  -> parent setMessages()
  -> App renders again
  -> Clock updates again
  -> componentDidUpdate() runs again
```

The fix was to avoid unconditionally changing parent state from
`componentDidUpdate()`. The class clock now keeps update logging in the
console while using the parent callback only for selected lifecycle events.

If an update method must change state, it should use a specific condition or
compare previous props and state so that the update can settle.

## Styling and Presentation

The dashboard separates behavior from presentation:

- React components define structure, state, and lifecycle behavior.
- CSS defines colors, spacing, cards, controls, focus states, and responsive
  layout.
- `clamp()` makes heading sizes adapt to the viewport.
- Media queries improve usability on smaller screens.
- `overflow-wrap: anywhere` prevents long lifecycle messages from overflowing.
- A dedicated CSS class is clearer than relying on structural selectors such
  as `:last-of-type`.

## Common Mistakes and Interview Notes

1. A render is not the same thing as a first mount.
2. Intervals and subscriptions must be cleaned up.
3. `[count]` means the effect re-synchronizes when `count` changes; it does
   not mean the effect runs only once.
4. `fetch()` usually rejects for network failures, not ordinary HTTP errors.
5. Stable identifiers are preferred over array indexes for React keys.
6. Updating parent state from every child update can create an infinite loop.
7. `useCallback` is useful when reference stability matters, not as a
   universal optimization.
8. React Strict Mode may perform an extra development setup/cleanup cycle.
9. TypeScript types do not validate untrusted API data at runtime.
10. State owned by an unmounted child is discarded, while state owned by its
    parent remains.

## Mentor Defense Questions

### What are the three lifecycle phases?

Mounting creates and inserts a component, updating re-renders it when relevant
props or state change, and unmounting removes it.

### How does `useEffect` relate to class lifecycle methods?

`useEffect` performs setup after a component commits and can return cleanup
logic. Its dependencies determine when the effect must be synchronized again.
It is a functional alternative for many lifecycle use cases, not a literal
one-to-one replacement for every class method.

### Why is cleanup necessary?

Cleanup stops timers and releases other external resources so they do not
continue working after the component no longer needs them.

### Why use a functional state update?

It calculates the next state from the previous state and remains reliable when
React batches updates.

### Why use `useCallback` for `addLog`?

The stable function reference prevents the functional clock's effect from
unnecessarily cleaning up and restarting its timer after unrelated parent
renders.

## Final Takeaway

React lifecycle work is easiest to understand as a cause-and-effect chain:
state or prop changes trigger renders, effects synchronize components with
external systems, and cleanup prevents those systems from outliving the
component that created them. The React Lifecycle Monitor connects these ideas
in one application by showing class lifecycle methods, hook-based effects,
asynchronous data handling, shared state, and responsive UI behavior.

