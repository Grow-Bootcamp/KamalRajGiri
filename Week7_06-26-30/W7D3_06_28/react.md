# React Fundamentals — Handnote
## Topics: JSX, Components, Props, Lists, Conditional Rendering, State and Events

## 1. What Is React?

React is a JavaScript library used to build user interfaces (UIs), especially interactive web applications.

React applications are built by combining small, reusable UI pieces called **components**.

For example, a student dashboard may contain:
- Navbar
- Sidebar
- Student profile
- Course list
- Notifications

Each part can be implemented as a separate component and combined into one interface.

### Important concepts

- **Component:** A reusable piece of UI.
- **JSX:** A syntax extension that lets us describe UI using HTML-like syntax inside JavaScript or TypeScript.
- **Props:** Data passed from a parent component to a child component.
- **State:** Data managed by a component that can change over time.
- **Event handler:** A function executed in response to an event, such as a button click.
- **Rendering:** React determining what UI should appear based on the current component data.

### React's basic mental model

A component receives props and reads its state to determine what UI to display.

When relevant state changes, React renders the component again so the UI reflects the updated state.

Conceptually:

Props + State → Component Logic → UI

---

## 2. JSX and TSX

### What is JSX?

JSX allows us to write HTML-like markup inside JavaScript.

```jsx
const element = <h1>Hello, React!</h1>;
```

JSX is not ordinary HTML. It is transformed into JavaScript by the development/build toolchain.

### What is TSX?

TSX is JSX syntax used in a TypeScript file.

Common extensions:

- `.js` — JavaScript
- `.jsx` — JavaScript with JSX
- `.ts` — TypeScript
- `.tsx` — TypeScript with JSX

### How Vite works with React

Vite provides the development server and build tooling. A React project commonly uses a JSX transformation tool, such as the one provided through the React plugin, to transform JSX/TSX into JavaScript the browser can execute.

TypeScript checking and JSX transformation are related but different operations. The transformation does not automatically guarantee that the code is type-safe.

---

## 3. Important JSX Rules

### Rule 1: Return one parent element

A component must return one root JSX element.

Incorrect:

```jsx
return (
  <h1>Hello</h1>
  <p>Welcome</p>
);
```

Correct:

```jsx
return (
  <div>
    <h1>Hello</h1>
    <p>Welcome</p>
  </div>
);
```

A Fragment can group elements without adding an extra DOM element:

```jsx
return (
  <>
    <h1>Hello</h1>
    <p>Welcome</p>
  </>
);
```

### Rule 2: Close every tag

```jsx
<img src="/logo.png" alt="Logo" />
<input type="text" />
```

### Rule 3: Use `className`

JSX uses `className` instead of HTML's `class`.

```jsx
<div className="card">Student information</div>
```

### Rule 4: Use camelCase for most DOM event and property names

```jsx
<button onClick={handleClick}>Click me</button>
```

Not:

```jsx
<button onclick={handleClick}>Click me</button>
```

### Rule 5: Use curly braces for JavaScript expressions

```jsx
const name = "Kamal";

return <h1>Hello, {name}</h1>;
```

Expressions can include calculations and function calls:

```jsx
<p>Total: {5 + 10}</p>
<p>Uppercase: {"react".toUpperCase()}</p>
```

Curly braces evaluate an expression; they are not a place to write arbitrary statements such as a regular `if` statement.

### Rule 6: Inline styles use JavaScript objects

```jsx
<p style={{ color: "blue", fontSize: "20px" }}>
  Welcome
</p>
```

The outer braces enter JavaScript expression mode. The inner braces create the style object.

CSS property names usually use camelCase in the object:

- `background-color` → `backgroundColor`
- `font-size` → `fontSize`

### Rule 7: Component names start with uppercase letters

```jsx
function StudentCard() {
  return <div>Student Card</div>;
}
```

Use `<StudentCard />` to render the component.

Lowercase tags such as `<div />` represent built-in HTML elements.

---

## 4. Functional Components

A functional component is a JavaScript or TypeScript function that returns React UI.

```tsx
function Welcome() {
  return <h1>Welcome to React</h1>;
}

export default Welcome;
```

Render it from another component:

```tsx
import Welcome from "./Welcome";

function App() {
  return (
    <main>
      <Welcome />
    </main>
  );
}

export default App;
```

### Component composition

Component composition means building a larger interface by combining smaller components.

```tsx
function Header() {
  return <header>Student Portal</header>;
}

function StudentProfile() {
  return <section>Student Profile</section>;
}

function App() {
  return (
    <>
      <Header />
      <StudentProfile />
    </>
  );
}
```

### Export and import

Named export:

```tsx
export function Header() {
  return <header>Student Portal</header>;
}
```

Named import:

```tsx
import { Header } from "./Header";
```

Default export:

```tsx
export default Header;
```

Default import:

```tsx
import Header from "./Header";
```

The import style must match the type of export.

---

## 5. Props

**Props (properties)** are used to pass information from a parent component to a child component.

Props allow one component to display different information without duplicating its implementation.

### Basic example

```tsx
type StudentCardProps = {
  name: string;
  age: number;
};

function StudentCard({ name, age }: StudentCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </article>
  );
}
```

Use the component:

```tsx
function App() {
  return (
    <>
      <StudentCard name="Kamal" age={21} />
      <StudentCard name="Anjana" age={20} />
    </>
  );
}
```

The same component renders different data depending on its props.

### Passing different data types

String:

```tsx
<StudentCard name="Kamal" age={21} />
```

Number:

```tsx
<Score value={95} />
```

Boolean:

```tsx
<Status isActive={true} />
```

Array:

```tsx
<FruitList fruits={["Apple", "Mango", "Banana"]} />
```

Object:

```tsx
<StudentProfile
  student={{ name: "Kamal", age: 21 }}
/>
```

Functions can also be passed as props to allow a child component to request an action from its parent.

### Required and optional props

```tsx
type UserProps = {
  name: string;
  age?: number;
};
```

The `?` means `age` is optional.

```tsx
function User({ name, age = 18 }: UserProps) {
  return (
    <p>
      {name} — {age}
    </p>
  );
}
```

If the caller does not supply `age`, the default value `18` is used.

### Props are read-only

A child component should not directly modify its props.

If a value needs to change, the component that owns the state should update it and pass the new value down through props.

### The `children` prop

`children` represents content placed between a component's opening and closing tags.

```tsx
type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return <section className="card">{children}</section>;
}
```

Usage:

```tsx
<Card>
  <h2>Student Details</h2>
  <p>Computer Engineering</p>
</Card>
```

`React.ReactNode` is a TypeScript type for content React can render, including elements, text, numbers, and collections of renderable content.

---

## 6. Props vs State

| Props | State |
|---|---|
| Passed into a component | Managed by a component using state tools |
| Controlled by the parent that supplies them | Updated through a state setter |
| Read-only from the receiving component's perspective | Can change over time |
| Used to configure a component | Used to represent changing component data |

Example:

```tsx
function Student({ name }: { name: string }) {
  return <h2>{name}</h2>;
}
```

Here, `name` is a prop.

```tsx
const [count, setCount] = useState(0);
```

Here, `count` is state.

A parent can own state and pass the current value to a child as a prop. The child can also receive a callback prop to request a state update.

---

## 7. Rendering Lists with `map()`

The JavaScript `map()` method transforms each array item into a new value and returns a new array.

In React, it is commonly used to render lists.

```tsx
const fruits = ["Apple", "Mango", "Banana"];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

### Why use `key`?

React uses keys to identify list items between renders. Stable keys help React determine which items were added, removed, or changed.

Preferred:

```tsx
{students.map((student) => (
  <StudentCard key={student.id} name={student.name} age={student.age} />
))}
```

Avoid using an array index as a key when items can be inserted, removed, or reordered. Avoid generating a new random key on every render.

Keys must be unique among siblings. They are used internally by React and are not automatically passed to the child as a prop.

---

## 8. Conditional Rendering

Conditional rendering means displaying UI according to a condition.

### Method 1: Ternary operator

Syntax:

```tsx
condition ? expressionIfTrue : expressionIfFalse
```

Example:

```tsx
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <p>
      {isLoggedIn ? "Welcome back!" : "Please log in."}
    </p>
  );
}
```

Use a ternary when one of two outputs should appear.

### Method 2: Logical AND (`&&`)

```tsx
function Notification({ hasMessage }: { hasMessage: boolean }) {
  return (
    <div>
      {hasMessage && <p>You have a new message.</p>}
    </div>
  );
}
```

When the condition is truthy, React renders the message. Otherwise, the message is not rendered.

**Important zero trap:**

```tsx
{fruits.length && <FruitList />}
```

If `fruits.length` is `0`, the expression evaluates to `0`, which React can render as visible text.

Safer:

```tsx
{fruits.length > 0 && <FruitList />}
```

Or use a ternary:

```tsx
{fruits.length > 0 ? <FruitList /> : <p>No fruits available.</p>}
```

### Method 3: Early return

```tsx
function Profile({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <p>Profile loaded.</p>;
}
```

Early returns are useful when a component has a clear loading, error, or empty state.

---

## 9. State and `useState()`

State is data a component remembers between renders.

When state changes through its setter, React schedules a render so the UI can reflect the updated state.

### Basic syntax

```tsx
import { useState } from "react";

const [count, setCount] = useState(0);
```

- `count`: current state value for this render.
- `setCount`: function used to request a state update.
- `0`: initial state.

### Counter example

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((previousCount) => previousCount + 1);
  }

  function decrement() {
    setCount((previousCount) => previousCount - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>

      <button type="button" onClick={decrement}>
        Decrement
      </button>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
}

export default Counter;
```

### Why not use a normal variable?

```tsx
let count = 0;
count++;
```

Changing a normal local variable does not tell React to render the component again. The variable also gets initialized again when the component function runs.

Use state when a value must persist between renders and its changes should update the UI.

### State is a render snapshot

A component render sees a particular snapshot of its state. Calling a setter does not immediately replace the state variable in the currently executing function.

For example:

```tsx
function increment() {
  setCount(count + 1);
  console.log(count);
}
```

The log can show the old value because `count` belongs to the current render.

### Functional state updates

When the next value depends on the previous value, use the updater form:

```tsx
setCount((previousCount) => previousCount + 1);
```

This is especially useful when multiple updates are queued.

Compare:

```tsx
setCount(count + 1);
```

with:

```tsx
setCount((previousCount) => previousCount + 1);
```

The second form calculates the next value from the previous state React supplies to the updater.

### State should be treated as immutable

Do not directly modify state and expect React to detect the change.

Incorrect:

```tsx
count++;
```

Correct:

```tsx
setCount((previousCount) => previousCount + 1);
```

---

## 10. Event Handling

React uses event props such as `onClick`, `onChange`, and `onSubmit`.

### Correct: pass a function

```tsx
<button onClick={handleClick}>Click</button>
```

### Incorrect: call the function during rendering

```tsx
<button onClick={handleClick()}>Click</button>
```

The second version calls the function while rendering instead of waiting for a click.

### Passing an argument

```tsx
<button onClick={() => removeFruit(fruit.id)}>
  Remove
</button>
```

The arrow function delays the call until the click occurs.

### Event object

React provides an event object to handlers when needed.

```tsx
<input
  onChange={(event) => {
    console.log(event.target.value);
  }}
/>
```

In TypeScript, React can infer the input event type from the JSX context.

---

## 11. Controlled Inputs and Forms

A controlled input has its displayed value controlled by React state.

```tsx
import { useState } from "react";

function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <label htmlFor="studentName">Student name:</label>

      <input
        id="studentName"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <p>Hello, {name || "Student"}!</p>
      <p>Characters: {name.length}</p>

      <button type="button" onClick={() => setName("")}>
        Reset
      </button>
    </div>
  );
}

export default NameInput;
```

### How it works

1. `useState("")` initializes the input value.
2. `value={name}` tells React what value to display.
3. `onChange` reads the new text.
4. `setName()` updates the state.
5. React renders the updated input and output.

### Form submission

```tsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    addFruit();
  }}
>
  <input value={fruitName} onChange={handleChange} />
  <button type="submit">Add</button>
</form>
```

`event.preventDefault()` prevents the browser's default form submission behavior, which otherwise commonly reloads or navigates the page.

Use `type="submit"` for the form's submit button and `type="button"` for ordinary buttons that should not submit the form.

---

## 12. Updating Arrays in State

React state arrays should be updated by creating a new array rather than mutating the existing one.

### Add an item: spread operator

```tsx
setFruits((previousFruits) => [
  ...previousFruits,
  newFruit,
]);
```

`...previousFruits` copies the existing array elements into a new array.

### Remove an item: `filter()`

```tsx
setFruits((previousFruits) =>
  previousFruits.filter((fruit) => fruit.id !== fruitId)
);
```

`filter()` returns a new array containing only elements that satisfy the condition.

### Update an item: `map()`

```tsx
setFruits((previousFruits) =>
  previousFruits.map((fruit) =>
    fruit.id === fruitId
      ? { ...fruit, name: "Orange" }
      : fruit
  )
);
```

This creates a new array and replaces the matching object with a new object.

### Find one item: `find()`

```tsx
const selectedFruit = fruits.find(
  (fruit) => fruit.id === fruitId
);
```

`find()` returns the first matching element, or `undefined` if no match exists.

### Common array methods

- `map()` — transform every element.
- `filter()` — keep elements that pass a condition.
- `find()` — return the first matching element.
- `some()` — check whether at least one element passes a condition.
- `includes()` — check whether an array contains a particular value.

### Why use IDs instead of names?

Two entries can have the same name. If removal is based on name, both may be removed.

```tsx
fruits.filter((fruit) => fruit.name !== "Apple")
```

This removes every item named Apple.

Using a unique ID removes only the intended item:

```tsx
fruits.filter((fruit) => fruit.id !== fruitId)
```

### Shallow copy warning

The spread operator creates a shallow copy. It does not automatically copy nested objects.

For nested state, copy each object or array along the path that you need to change.

---

## 13. Updating Object State

Suppose a component stores a student:

```tsx
type Student = {
  name: string;
  age: number;
};

const [student, setStudent] = useState<Student>({
  name: "Kamal",
  age: 21,
});
```

To update the name without discarding the age:

```tsx
setStudent((previousStudent) => ({
  ...previousStudent,
  name: "Anjana",
}));
```

The spread operator copies the existing properties, and the new `name` overwrites the old name.

Incorrect:

```tsx
setStudent({ name: "Anjana", age: 20 });
```

This is not inherently invalid, but it replaces the entire object with the supplied object. If other properties existed, they would be lost unless included.

---

## 14. Lifting State Up

Lifting state up means moving shared state to the closest common parent of the components that need it.

Imagine two components:
- `FruitInput` adds fruits.
- `FruitList` displays fruits.

If both need to access the same fruit collection, keeping independent state in both components can cause them to disagree.

Instead:

1. The parent owns the fruit state.
2. The parent passes the data to `FruitList` through props.
3. The parent passes an add callback to `FruitInput`.
4. `FruitInput` calls the callback when the user submits a fruit.
5. The parent updates state and React renders the updated list.

This creates one source of truth for the shared data.

---

## 15. Mini-Project: Favorite Fruits

### Requirements

Build a component that:
- Displays a list of favorite fruits.
- Allows the user to enter a fruit.
- Adds a non-empty fruit.
- Clears the input after successful addition.
- Shows the total number of fruits.
- Removes a fruit by its unique ID.
- Displays an empty-state message when the list is empty.
- Allows duplicate fruit names.

### Complete implementation

```tsx
import { useState } from "react";

type Fruit = {
  id: number;
  name: string;
};

function FavoriteFruits() {
  const [fruitName, setFruitName] = useState("");
  const [fruits, setFruits] = useState<Fruit[]>([
    { id: 1, name: "Apple" },
    { id: 2, name: "Mango" },
  ]);

  function addFruit() {
    const trimmedName = fruitName.trim();

    if (trimmedName === "") {
      return;
    }

    const newFruit: Fruit = {
      id: Date.now(),
      name: trimmedName,
    };

    setFruits((previousFruits) => [
      ...previousFruits,
      newFruit,
    ]);

    setFruitName("");
  }

  function removeFruit(fruitId: number) {
    setFruits((previousFruits) =>
      previousFruits.filter((fruit) => fruit.id !== fruitId)
    );
  }

  return (
    <section>
      <h2>My Favorite Fruits</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addFruit();
        }}
      >
        <label htmlFor="fruitName">Fruit name:</label>

        <input
          id="fruitName"
          value={fruitName}
          onChange={(event) => setFruitName(event.target.value)}
          placeholder="Enter a fruit"
        />

        <button type="submit">Add Fruit</button>
      </form>

      <p>Total fruits: {fruits.length}</p>

      {fruits.length === 0 ? (
        <p>No favorite fruits added yet.</p>
      ) : (
        <ul>
          {fruits.map((fruit) => (
            <li key={fruit.id}>
              {fruit.name}

              <button
                type="button"
                onClick={() => removeFruit(fruit.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FavoriteFruits;
```

**Note:** `Date.now()` is adequate for a small practice project, but timestamps can theoretically collide if items are created within the same millisecond. For applications requiring robust unique IDs, use a suitable ID generator.

---

## 16. Common Mistakes to Avoid

1. Using `class` instead of `className` in JSX.
2. Returning multiple sibling elements without a root or Fragment.
3. Using lowercase names for custom React components.
4. Calling an event handler during render instead of passing a function.
5. Modifying state arrays or objects directly.
6. Using unstable list keys.
7. Using array indexes as keys when list items can move or be removed.
8. Forgetting `event.preventDefault()` in a form when default submission behavior is unwanted.
9. Forgetting to clear controlled input state after successful submission.
10. Using `&&` with a number that might be zero.
11. Removing list items by a non-unique name instead of an ID.
12. Updating an object without preserving properties that must remain.
13. Assuming a state setter immediately changes the state variable in the current render.
14. Using separate state copies for data that must remain synchronized.

---

## 17. Quick Revision Questions

1. What is the difference between JSX and HTML?
2. What role does Vite play in a React project?
3. Why must JSX have one root element?
4. What is the difference between a component and an element?
5. What are props, and why should a child not modify them?
6. What is the difference between props and state?
7. Why should list elements have stable keys?
8. What is the difference between `map()`, `filter()`, and `find()`?
9. When should you use a ternary instead of `&&`?
10. Why can `{items.length && <List />}` display a zero?
11. Why does changing a normal local variable not automatically update the UI?
12. What is a controlled input?
13. Why is `event.preventDefault()` used in a form?
14. What is the difference between `setCount(count + 1)` and `setCount(previous => previous + 1)`?
15. Why should arrays and objects in state be updated immutably?
16. What does lifting state up mean?
17. Why is removing a list item by ID safer than removing it by name?
18. What is the purpose of the `children` prop?
19. What is the difference between `onClick={handleClick}` and `onClick={handleClick()}`?
20. Why is the spread operator considered a shallow-copy operation?

## 18. Core Syntax Reference

```tsx
// State
const [value, setValue] = useState(initialValue);

// Functional state update
setValue((previousValue) => nextValue);

// Click handler
<button type="button" onClick={handleClick}>Click</button>

// Controlled input
<input
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>

// Conditional rendering
{condition ? <A /> : <B />}

// Render a list
{items.map((item) => (
  <li key={item.id}>{item.name}</li>
))}

// Add to an array
setItems((previousItems) => [...previousItems, newItem]);

// Remove from an array
setItems((previousItems) =>
  previousItems.filter((item) => item.id !== itemId)
);

// Update an object
setStudent((previousStudent) => ({
  ...previousStudent,
  name: "New Name",
}));
```
