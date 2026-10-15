# React Fundamentals — Learning Log

## 1. Overview

Today I learned the fundamentals of React and created a small React + TypeScript
application with Vite. The main topics were:

- JSX and TSX syntax.
- Functional components and component composition.
- Props and the `children` prop.
- Rendering lists and using stable keys.
- Conditional rendering.
- State with the `useState` hook.
- Event handling and controlled form inputs.
- Updating arrays and objects without mutating state.
- Lifting state up so related components can share data.

The practical demo is a student dashboard with student cards, a counter, a
controlled name input, and a favorite-fruits list.

## 2. Project Setup

The project was created with Vite using the React TypeScript template:

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

Vite provides the development server and build tooling. JSX/TSX is transformed
into JavaScript for the browser, while TypeScript checking is a separate
concern. A successful JSX transformation does not by itself guarantee that
the code is type-safe.

The application is mounted in `main.tsx`:

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## 3. React Mental Model

React interfaces are built from reusable components. A component reads its
props and state, performs its logic, and returns the UI that should be
displayed:

```text
Props + State → Component Logic → UI
```

When state changes, React renders the relevant component again so the UI
matches the latest data.

## 4. JSX and TSX

JSX lets a component describe UI with HTML-like syntax inside JavaScript.
TSX is the same syntax used inside a TypeScript file.

```tsx
const greeting = "React";

function Welcome() {
  return <h1>Hello, {greeting}!</h1>;
}
```

Important JSX rules:

1. Return one root element or a Fragment.
2. Close every tag, including `<input />` and `<img />`.
3. Use `className` instead of `class`.
4. Use camelCase event names such as `onClick` and `onChange`.
5. Put JavaScript expressions inside curly braces.
6. Use a JavaScript object for inline styles.
7. Begin custom component names with an uppercase letter.

For example:

```tsx
function StudentCard() {
  return (
    <article className="student-card">
      <h2>Student information</h2>
      <p style={{ color: "blue" }}>Learning React</p>
    </article>
  );
}
```

## 5. Functional Components and Composition

A functional component is a JavaScript or TypeScript function that returns
JSX:

```tsx
function Greeting() {
  return <p>Welcome to the student portal.</p>;
}
```

Components can be composed by rendering one component inside another. The
demo's `App` component combines `Panel`, `StudentCard`, `StudentList`,
`Counter`, `NameInput`, and `FavoriteFruits`.

The `Panel` component also demonstrates `children`. Instead of hard-coding
the panel content, the parent supplies nested JSX:

```tsx
<Panel title="Student Dashboard">
  <p>Welcome to the portal.</p>
  <p>View your courses and enrollment status.</p>
</Panel>
```

This makes `Panel` reusable for different types of content.

## 6. Props

Props are read-only values passed from a parent component to a child
component. They are useful for sending data and callback functions down the
component tree.

The student list receives both the students to display and the function to
remove a student:

```tsx
type StudentListProps = {
  students: Student[];
  onRemove: (studentId: number) => void;
};

function StudentList({ students, onRemove }: StudentListProps) {
  // Render the supplied students.
}
```

`StudentCard` receives one student and calls the callback when its button is
clicked:

```tsx
<button type="button" onClick={() => onRemove(student.id)}>
  Remove
</button>
```

Props should not be changed by the receiving component. If a child needs to
request a change, the parent can pass a callback that updates the parent's
state.

## 7. Rendering Lists and Conditional UI

The `map()` method renders one component for every item in an array:

```tsx
{students.map((student) => (
  <StudentCard
    key={student.id}
    student={student}
    onRemove={onRemove}
  />
))}
```

The `key` uniquely identifies each item so React can update the list
efficiently. A stable ID is preferred over an array index when items can be
removed or reordered.

The demo uses a ternary expression to show either an empty-state message or
the student list:

```tsx
{students.length === 0 ? (
  <p>No students remaining.</p>
) : (
  <div className="student-list">{/* cards */}</div>
)}
```

Other useful conditional-rendering patterns are:

```tsx
{isEnrolled && <span>Enrolled</span>}
```

and an early return when a component cannot render without required data.

## 8. State with `useState`

State is component-owned data that can change over time. The `useState` hook
returns the current value and a setter function:

```tsx
const [count, setCount] = useState(0);
```

The counter demo uses functional updates:

```tsx
function increment() {
  setCount((previousCount) => previousCount + 1);
}
```

Functional updates are useful when the next value depends on the previous
value. The `reset` handler can assign a known value directly:

```tsx
function reset() {
  setCount(0);
}
```

A normal local variable does not trigger a React render when changed. State
does, so state is the correct place for values that affect displayed UI.

## 9. Events and Controlled Inputs

React event props receive functions rather than the result of calling a
function during rendering:

```tsx
<button type="button" onClick={increment}>
  Increment
</button>
```

The `NameInput` component is a controlled input. React state is the source of
truth for the input value:

```tsx
const [name, setName] = useState("");

<input
  id="studentName"
  value={name}
  onChange={(event) => setName(event.target.value)}
/>
```

Because the value is controlled by state, the component can immediately
display derived information:

```tsx
<p>Hello, {name || "Student"}!</p>
<p>Characters: {name.length}</p>
```

The same component resets the input by setting the state back to an empty
string.

## 10. Updating Arrays and Objects Immutably

State should be treated as immutable. Instead of changing an existing array,
create a new array with methods such as:

- Spread syntax (`...`) to add an item.
- `filter()` to remove an item.
- `map()` to update an item.
- `find()` to retrieve one item.

The favorite-fruits demo adds a fruit with the spread operator:

```tsx
setFruits((previousFruits) => [
  ...previousFruits,
  { id: Date.now(), name: trimmedName },
]);
```

It removes a fruit with `filter()`:

```tsx
setFruits((previousFruits) =>
  previousFruits.filter((fruit) => fruit.id !== fruitId),
);
```

The input is trimmed and empty fruit names are ignored before a new item is
created. Each fruit has an ID so the ID can be used for both React's `key` and
the remove operation.

## 11. Forms and Conditional Empty States

The favorite-fruits form handles submission in React:

```tsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    addFruit();
  }}
>
  {/* controlled input and submit button */}
</form>
```

Calling `preventDefault()` stops the browser from reloading the page. The
component renders the list when fruits exist and an empty-state message when
the list is empty:

```tsx
{fruits.length === 0 ? (
  <p>No favorite fruits added yet.</p>
) : (
  <ul>{/* fruit items */}</ul>
)}
```

## 12. Lifting State Up

When multiple components need to work with the same data, the state should be
stored in their closest common parent. In the demo:

```tsx
const [students, setStudents] = useState<Student[]>(initialStudents);
```

`App` owns the students state and passes:

- The student data to `StudentList`.
- The first student to the featured `StudentCard`.
- The `handleRemove` callback to the cards.

This keeps one source of truth. Removing a student updates `App`'s state,
which causes both the featured card and the full list to render from the
updated data.

## 13. Key Takeaways

- React components should be small, reusable, and composable.
- JSX is JavaScript/TypeScript syntax for describing UI, not ordinary HTML.
- Props pass read-only data and behavior from parent to child.
- State stores changing data that affects what a component renders.
- Event handlers should be passed as functions.
- Controlled inputs keep form values synchronized with state.
- List items need stable keys.
- State arrays and objects should be updated by creating new values instead
  of mutating existing ones.
- Lifting state up allows sibling components to share consistent data.
- TypeScript types make component contracts and callback parameters explicit.

## 14. Practice Checklist

- [x] Create a React TypeScript project with Vite.
- [x] Render JSX from a functional component.
- [x] Compose multiple components in `App`.
- [x] Pass typed props and callback functions.
- [x] Render a typed list with stable keys.
- [x] Add conditional empty states.
- [x] Implement a counter with `useState`.
- [x] Build controlled text and fruit inputs.
- [x] Add and remove array items immutably.
- [x] Lift student state into the common parent component.
