# Week 7 Day 5 — Technical Handnote

**Topics:** React Forms, Validation, Performance Optimization, Lazy Loading & Code Splitting

---

# 1. React Forms

## 1.1 Controlled Components

A controlled component is a form input whose value is managed by React state.

```tsx
import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

**How it works:**

1. React state stores the input value.
2. The `value` prop displays the current state.
3. `onChange` updates state when the user types.
4. React renders the updated value.

**Advantages:**
- Complete control over input values.
- Easy conditional rendering.
- Convenient validation.
- Suitable for custom form behavior.

## 1.2 Form Validation

Form validation checks whether user input satisfies predefined rules.

Common validation rules:

- Required fields.
- Valid email format.
- Minimum password length.
- Password confirmation.
- Valid input format.

### Manual Validation

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

function validate(name: string, email: string) {
  const newErrors: Record<string, string> = {};

  if (!name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!email.includes("@")) {
    newErrors.email = "Invalid email";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}
```

### Touched State

Touched state tracks whether a user has interacted with or left a field.

```tsx
const [touched, setTouched] = useState({
  name: false,
  email: false,
});
```

Errors can be displayed after a field is touched rather than immediately on page load.

### Accessibility

Important attributes:

| Attribute | Purpose |
|---|---|
| `htmlFor` | Connects a label to an input ID |
| `aria-invalid` | Indicates invalid input |
| `aria-describedby` | Associates input with its error message |
| `role="status"` | Identifies a status message |
| `aria-live="polite"` | Announces updates to assistive technology |

---

# 2. React Hook Form

React Hook Form is a library that simplifies form state management, validation, and submission.

It reduces the amount of manual form-handling code.

## 2.1 Installation

```bash
npm install react-hook-form yup @hookform/resolvers --legacy-peer-deps
```

## 2.2 Important Functions

| Function | Purpose |
|---|---|
| `useForm()` | Initializes form management |
| `register()` | Connects inputs to React Hook Form |
| `handleSubmit()` | Validates and handles form submission |
| `formState.errors` | Stores validation errors |
| `formState.isSubmitting` | Indicates submission is in progress |
| `reset()` | Resets form values |
| `trigger()` | Manually triggers validation |
| `getValues()` | Retrieves current form values |

## 2.3 Basic Example

```tsx
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
};

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", {
          required: "Name is required",
        })}
      />

      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register("email", {
          required: "Email is required",
        })}
      />

      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

# 3. Yup Schema Validation

Yup is a JavaScript schema validation library.

It allows us to define validation rules separately from the form UI.

## 3.1 Schema Example

```tsx
import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup.string().trim()
    .required("Name is required")
    .min(2, "Minimum 2 characters"),

  email: yup.string().trim()
    .required("Email is required")
    .email("Invalid email"),

  password: yup.string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .matches(/\d/, "Must contain a number"),

  confirmPassword: yup.string()
    .required("Please confirm password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
}).required();

export type SignupFormValues = yup.InferType<
  typeof signupSchema
>;
```

## 3.2 Important Yup Methods

| Method | Purpose |
|---|---|
| `yup.object()` | Defines an object schema |
| `yup.string()` | Defines a string field |
| `required()` | Makes a field mandatory |
| `min()` | Defines minimum length/value |
| `max()` | Defines maximum length/value |
| `email()` | Validates email format |
| `matches()` | Validates using a regular expression |
| `oneOf()` | Restricts accepted values |
| `yup.ref()` | References another schema field |
| `trim()` | Removes surrounding whitespace |
| `InferType` | Derives TypeScript type from schema |

## 3.3 Connecting Yup with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<SignupFormValues>({
  resolver: yupResolver(signupSchema),
});
```

**Remember:**

- React Hook Form manages the form.
- Yup defines validation rules.
- `yupResolver` connects the two.

---

# 4. Multi-Step Forms

A multi-step form divides a large form into smaller sections.

Example workflow:

1. Personal Information.
2. Account Security.
3. Review and Submit.

## 4.1 Managing Current Step

```tsx
const [currentStep, setCurrentStep] = useState(0);
```

Move forward:

```tsx
setCurrentStep((previous) => previous + 1);
```

Move backward:

```tsx
setCurrentStep((previous) => Math.max(previous - 1, 0));
```

## 4.2 Step-Specific Validation

React Hook Form provides `trigger()` to validate selected fields.

```tsx
const isValid = await trigger(["name", "email"], {
  shouldFocus: true,
});

if (isValid) {
  setCurrentStep((previous) => previous + 1);
}
```

For the security step:

```tsx
const isValid = await trigger([
  "password",
  "confirmPassword",
]);
```

## 4.3 Retaining Form Values

```tsx
useForm<SignupFormValues>({
  resolver: yupResolver(signupSchema),
  shouldUnregister: false,
});
```

**Why is `shouldUnregister: false` important?**

When a step changes, its input components may unmount. Keeping `shouldUnregister: false` allows their values to remain in the form state.

## 4.4 Preventing Unintended Submission

HTML form buttons have different types:

| Button type | Behavior |
|---|---|
| `type="button"` | Does not submit the form |
| `type="submit"` | Submits the form |
| `type="reset"` | Resets form controls |

Always specify button types explicitly inside forms.

For more controlled submission workflows, validate the active step and authorize final submission separately.

---

# 5. React Performance Optimization

React applications can render components more often than necessary.

Performance optimization techniques help avoid unnecessary rendering or expensive calculations.

## 5.1 Why Components Render

A component can render when:

1. Its own state changes.
2. Its parent renders.
3. A context value it consumes changes.
4. An external store subscription updates.

A parent render does not automatically mean every child must perform a new render. Memoization can sometimes skip child rendering.

## 5.2 React.memo

`React.memo()` memoizes a component based on its props.

```tsx
import { memo } from "react";

const Child = memo(function Child({ name }: { name: string }) {
  console.log("Child rendered");

  return <p>{name}</p>;
});
```

By default, React shallowly compares previous and next props using `Object.is`.

If the props remain unchanged, React can skip a parent-triggered child render.

**Important:** React.memo does not prevent rendering caused by the component's own state or consumed context changes.

## 5.3 Referential Equality

Referential equality checks whether two values refer to the same object or function.

```tsx
const first = () => console.log("Hello");
const second = () => console.log("Hello");

console.log(first === second); // false
```

Even though both functions perform the same operation, they have different references.

For objects:

```tsx
const first = { name: "Alex" };
const second = { name: "Alex" };

console.log(first === second); // false
```

For primitives:

```tsx
console.log("Alex" === "Alex"); // true
```

This matters because memoized components compare their props.

## 5.4 useCallback

`useCallback()` caches a function reference between renders until its dependencies change.

```tsx
import { useCallback } from "react";

const handleAction = useCallback(() => {
  console.log("Action triggered");
}, []);
```

Useful when passing callbacks to memoized child components.

## 5.5 useMemo

`useMemo()` caches the result of a calculation.

```tsx
import { useMemo } from "react";

const squaredCount = useMemo(() => {
  return count * count;
}, [count]);
```

The calculation runs again when a dependency changes.

### Dependency Array

```tsx
useMemo(() => calculateTotal(products), [products]);
```

If `products` changes, React recalculates the result.

### Difference Between Three Techniques

| Technique | What it memoizes |
|---|---|
| `React.memo` | Component rendering based on props |
| `useCallback` | Function reference |
| `useMemo` | Calculated value |

**Remember:** Memoization is an optimization, not something that must be used everywhere. Unnecessary memoization can make code more complicated.

---

# 6. React Developer Tools Profiler

React Developer Tools is a browser extension for inspecting React applications.

Its Profiler helps analyze rendering behavior.

### What can it show?

- Which components rendered.
- How many commits occurred.
- How long rendering took.
- Which components rendered during a particular commit.
- Whether an optimization reduced rendering work.

### Profiling workflow

1. Open browser Developer Tools.
2. Select the Profiler tab.
3. Start recording.
4. Interact with the application.
5. Stop recording.
6. Inspect commits and the component flamegraph.

**Remember:** A component rendering is not automatically a performance problem. Profiling helps identify whether the rendering is actually expensive or unnecessary.

---

# 7. Lazy Loading and Code Splitting

## 7.1 Code Splitting

Code splitting divides an application's JavaScript into smaller bundles or chunks.

Without code splitting, the initial bundle may include code for many application features.

With code splitting, the browser can load additional chunks when they are needed.

**Benefits:**

- Smaller initial JavaScript bundle.
- Less unnecessary code downloaded initially.
- Improved initial loading opportunities.
- Better loading strategies for large applications.

## 7.2 Dynamic Import

```tsx
import("./pages/Analytics");
```

`import()` dynamically loads a JavaScript module and returns a Promise.

Unlike static imports, it allows the module to be loaded on demand.

## 7.3 React.lazy

```tsx
import { lazy } from "react";

const Analytics = lazy(
  () => import("./pages/Analytics")
);
```

`React.lazy()` creates a component that loads its module dynamically when it is first rendered.

The imported module must provide a default export for this pattern.

## 7.4 Suspense

`Suspense` displays fallback content while a lazy component is loading.

```tsx
import { lazy, Suspense } from "react";

const Analytics = lazy(
  () => import("./pages/Analytics")
);

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Analytics />
    </Suspense>
  );
}
```

## 7.5 Conditional Lazy Loading

```tsx
import { lazy, Suspense, useState } from "react";

const Analytics = lazy(
  () => import("./pages/Analytics")
);

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowAnalytics((previous) => !previous)}
      >
        Show Analytics
      </button>

      {showAnalytics && (
        <Suspense fallback={<p>Loading analytics...</p>}>
          <Analytics />
        </Suspense>
      )}
    </>
  );
}
```

Initially, Analytics is not rendered. When the user requests it, React renders the lazy component and its dynamic import begins.

## 7.6 Important Differences

| Feature | Responsibility |
|---|---|
| `import()` | Dynamically imports a module |
| `React.lazy()` | Creates a lazy-loaded component |
| `Suspense` | Displays fallback UI while waiting |
| Code splitting | Separates code into smaller chunks |

**Important:** Suspense does not itself split code. Also, Suspense does not handle import failures; an Error Boundary can provide error handling.

---

# 8. Final Revision — Important Questions

### Forms and Validation

1. What is a controlled component?
2. What is the difference between manual validation and schema validation?
3. Why do we use React Hook Form?
4. What is Yup?
5. What does `yupResolver` do?
6. What is the purpose of `register()`?
7. What is the difference between `handleSubmit()` and `trigger()`?
8. Why do we use `shouldUnregister: false` in multi-step forms?

### Performance Optimization

9. Why do React components render?
10. What does `React.memo()` do?
11. What is referential equality?
12. Why can an inline function cause a memoized child to render?
13. What is the difference between `useCallback` and `useMemo`?
14. Does React.memo prevent rendering caused by a component's own state changes?
15. Why should we use React DevTools Profiler?

### Lazy Loading and Code Splitting

16. What is code splitting?
17. What is dynamic import?
18. What does `React.lazy()` do?
19. Why do we use Suspense?
20. What is a fallback UI?
21. What happens if a lazy component is rendered immediately?
22. What is the difference between lazy loading and code splitting?
23. Why might we lazy-load entire route pages?

---

# 9. Quick Syntax Reference

| Requirement | Syntax |
|---|---|
| Initialize a form | `useForm()` |
| Register an input | `register("name")` |
| Handle submission | `handleSubmit(onSubmit)` |
| Trigger validation | `trigger(["name", "email"])` |
| Reset form | `reset()` |
| Get current values | `getValues()` |
| Define Yup schema | `yup.object({...})` |
| Connect Yup | `yupResolver(schema)` |
| Memoize component | `memo(Component)` |
| Memoize function | `useCallback(fn, deps)` |
| Memoize value | `useMemo(fn, deps)` |
| Dynamic import | `import("./module")` |
| Lazy-load component | `lazy(() => import("./Page"))` |
| Loading fallback | `<Suspense fallback={...}>` |

---

**End of Week 7 Day 5 Handnote**