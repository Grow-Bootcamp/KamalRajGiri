# Week 7 Day 5 — Forms, Validation & Performance Optimization 

**Topic:** React Forms, Validation, Multi-Step Forms, Performance Optimization, Lazy Loading, and Code Splitting

## Project Goal

This day focused on improving my React form-handling skills and understanding how to build production-ready, user-friendly forms. I also learned how to optimize rendering performance and split code to improve app efficiency and loading behavior.

## Key Learnings

### 1. Controlled Forms and Validation

A controlled component keeps its value in React state and updates it through `onChange` events.

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

This approach gives complete control over input values and makes validation easier. I learned how to validate required fields, email addresses, minimum password length, and matching confirm-password values. I also used `touched` state to show validation errors only after a user interacts with a field.

### 2. Accessibility in Forms

Good form validation should also be accessible. I studied key attributes such as:

- `htmlFor` to connect labels with input elements
- `aria-invalid` to mark invalid inputs
- `aria-describedby` to link error messages to fields
- `role="status"` for status updates
- `aria-live="polite"` for screen-reader announcement of validation results

These attributes improve usability for assistive technologies and make errors easier to understand.

### 3. React Hook Form

React Hook Form simplifies form handling by reducing repetitive code and managing form state efficiently.

Important APIs:

- `useForm()` — initializes form state
- `register()` — attaches fields to the form
- `handleSubmit()` — validates and submits the form
- `formState.errors` — stores validation errors
- `trigger()` — manually triggers validation
- `reset()` — clears form values
- `getValues()` — reads current values

This makes forms much easier to manage compared with manual state logic.

### 4. Yup Schema Validation

Yup is used to define reusable validation rules in a clean schema-based format.

Example:

```tsx
import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup.string().trim().required("Name is required").min(2, "Minimum 2 characters"),
  email: yup.string().trim().required("Email is required").email("Invalid email"),
  password: yup.string().required("Password is required").min(8, "Minimum 8 characters"),
  confirmPassword: yup.string()
    .required("Please confirm password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
}).required();
```

I also learned how to connect Yup with React Hook Form using `yupResolver`, which allows the form library and validation schema to work together effectively.

### 5. Multi-Step Forms

A multi-step form breaks a large submission workflow into smaller sections for better UX and easier validation.

The project used a three-step workflow:

1. Personal Information
2. Account Security
3. Review and Submit

I learned how to:

- manage the current step using state
- validate each step before moving forward
- preserve data across steps using `shouldUnregister: false`
- navigate between steps with previous/next actions
- reset form data after successful submission

This makes complex forms easier to complete and reduces user overload.

### 6. Performance Optimization

React performance optimization is important when a UI grows large or re-renders frequently. I learned and practiced the following:

- `React.memo` to prevent unnecessary re-renders of child components
- `useCallback` to memoize functions and keep references stable
- `useMemo` to cache computed values
- referential equality and shallow prop comparison to understand when components re-render

Using these patterns helps reduce wasted work and improves responsiveness.

### 7. Lazy Loading and Code Splitting

Lazy loading allows a component to be loaded only when needed, reducing the initial bundle size and improving initial load performance.

I learned how to use:

- `React.lazy()` for dynamic component loading
- `Suspense` for fallback UI while the component loads
- `import()` for code splitting

This is especially useful for heavy or optional features such as analytics dashboards or other secondary modules.

## Practical Work Completed

- Built a controlled form with manual validation
- Implemented React Hook Form with Yup validation
- Created a multi-step registration form with state retention
- Added validation before step transitions
- Created a performance demo using memoization
- Applied lazy loading for a conditional Analytics component
- Prepared and presented a summary of the week’s learning to the mentor

## Challenges and Solutions

### Challenge 1: Form submission triggered unexpectedly

During testing, the form was submitting when the user navigated between steps. The fix was to explicitly control submission behavior using `useRef` and allow submission only when the final registration button was clicked.

### Challenge 2: Understanding re-renders in memoized components

At first, it was confusing why a child component still re-rendered even after wrapping it with `React.memo`. I solved this by understanding referential equality and making function props stable with `useCallback`.

### Challenge 3: Lazy loading behavior

I had to understand how dynamic imports, `React.lazy()`, and `Suspense` work together. Once I implemented a conditionally rendered analytics component, the loading behavior became clearer.

## Testing and Verification

I verified the work through:

- successful TypeScript checks
- successful production build
- browser testing of form validation and multi-step flow
- testing of memoized rendering behavior
- verification of lazy-loaded component behavior

## Reflection

This session gave me practical experience with real-world React form patterns and performance concerns. I now understand the difference between manually managing form state and using libraries like React Hook Form with Yup. I also learned that performance optimization is not just theoretical; it is a practical habit that improves user experience in real applications.

The most useful takeaway was connecting UI behavior, validation logic, and code performance together in one working project. This made the concepts feel more practical and easier to apply in future React applications.

## Conclusion

This learning session covered the essential parts of React form development, validation, and app optimization. I completed the day’s work, documented the key concepts, and strengthened my understanding of how to build forms that are both functional and efficient.