# React Forms & Performance Demo

A React and TypeScript learning project demonstrating form validation, multi-step registration, component rendering optimization, and code splitting.

## Overview

This project explores different approaches to building forms and improving React application performance. It compares manual form validation with React Hook Form and Yup, implements a multi-step registration workflow, and demonstrates React rendering optimization techniques.

It also demonstrates lazy loading and code splitting using React's `lazy()` and `Suspense`.

## Features

### 1. Form Validation
- Controlled forms using React state.
- Manual form validation.
- Field-level error messages.
- Touched-field validation.
- Accessible labels and validation feedback.

### 2. React Hook Form & Yup
- Form management using React Hook Form.
- Schema-based validation using Yup.
- Integration through `@hookform/resolvers`.
- Password confirmation validation.
- Submission state management.

### 3. Multi-Step Registration
- Personal information step.
- Account security step.
- Review and submission step.
- Step-specific validation.
- Retention of form values between steps.
- Success feedback and form reset.

### 4. React Performance Optimization
- `React.memo` for memoizing components.
- `useCallback` for stabilizing function references.
- `useMemo` for caching calculated values.
- React Developer Tools Profiler for observing component renders.
- Referential equality and prop comparison.

### 5. Lazy Loading & Code Splitting
- Dynamic imports using `import()`.
- Component-level lazy loading using `React.lazy()`.
- Loading fallback using `Suspense`.
- Conditional rendering of the Analytics component.
- Separate JavaScript chunks through Vite's build process.

## Technologies Used

- React
- TypeScript
- Vite
- React Hook Form
- Yup
- @hookform/resolvers
- React Toastify
- React Developer Tools

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository and navigate to this project directory.

Install dependencies:

```bash
npm install --legacy-peer-deps
```

### Development

Start the development server:

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
│   ├── forms/
│   └── performance/
├── pages/
│   ├── Forms.tsx
│   ├── MultiStepForm.tsx
│   ├── TestDemo.tsx
│   └── Analytics.tsx
├── schemas/
├── App.tsx
├── App.css
└── main.tsx
```

*The structure above highlights the main application areas. Additional files may exist within these directories.*

## Learning Outcomes

By completing this project, the following concepts were practiced:

- Controlled and uncontrolled form management.
- Form validation and error handling.
- Schema-based validation.
- Multi-step form workflows.
- React component rendering behavior.
- Referential equality and memoization.
- React Developer Tools Profiler.
- Dynamic imports and lazy loading.
- Suspense fallback rendering.
- JavaScript code splitting.

## Verification

The project was verified through:

- TypeScript type checking.
- ESLint checks.
- Vite production build.
- Manual browser testing of form workflows.
- Multi-step navigation and validation.
- React performance demonstrations.
- Analytics lazy-loading behavior.

## Purpose

This project was developed as part of the MERN Stack Bootcamp to strengthen practical understanding of React forms, validation strategies, hooks, rendering optimization, and application performance.