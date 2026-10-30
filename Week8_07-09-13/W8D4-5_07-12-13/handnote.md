# Week 7 Day 1 – React Router, Nested Routing, Modals & Toast Notifications

## 1. Introduction to Routing

Routing is the process of deciding which component should be displayed based on the current URL.

Without routing, we might manually check the URL and conditionally render every screen ourselves. A router provides a structured way to map URLs to components.

For example:

- `/` → Home page
- `/about` → About page
- `/products` → Products page
- `/products/2` → Details of product with ID 2

### Traditional Multi-Page Websites vs React SPA

A traditional multi-page website often requests a new HTML document when navigating between pages.

In a typical React Single-Page Application (SPA), the browser loads the application and client-side navigation changes the URL and displayed React components without a full document reload.

**Important:** SPA does not mean that the application has only one screen. It can have dozens of routes while still using one main HTML document.

### Why Do We Need React Router?

React Router provides:

- URL-based navigation.
- Reusable route definitions.
- Dynamic route parameters.
- Nested routes.
- Navigation without a full page reload.
- Active navigation styling.
- Navigation through code.

## 2. Setting Up React Router

We use `BrowserRouter` to enable routing in the application.

```tsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### Important Components

| Component | Responsibility |
|---|---|
| `BrowserRouter` | Provides routing context and synchronizes navigation with browser history |
| `Routes` | Finds the best matching route |
| `Route` | Maps a URL pattern to a component |
| `Link` | Navigates between routes |
| `NavLink` | Navigates and provides active-route information |
| `Outlet` | Displays the matching nested child route |

Example:

```tsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
```

## 3. Link vs NavLink

Both `Link` and `NavLink` allow navigation without reloading the entire application.

### Link

Use `Link` for ordinary navigation.

```tsx
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>
```

### NavLink

Use `NavLink` when we need to know whether a navigation link is active.

```tsx
import { NavLink } from 'react-router-dom';

<NavLink
  to="/products"
  className={({ isActive }) =>
    isActive ? 'active' : ''
  }
>
  Products
</NavLink>
```

`isActive` is provided by React Router.

**When should we use them?**

- `Link`: General navigation.
- `NavLink`: Navigation menus where the active page should be highlighted.

## 4. Dynamic Route Parameters

Suppose we have 100 products.

Creating 100 individual routes would be unnecessary. Instead, we can create one reusable route using a dynamic parameter.

```tsx
<Route
  path="/products/:id"
  element={<ProductDetails />}
/>
```

Here, `:id` is a route parameter.

Examples:

- `/products/1`
- `/products/2`
- `/products/100`

All these URLs use the same `ProductDetails` component.

### Accessing Parameters with useParams()

```tsx
import { useParams } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();

  return <h2>Product ID: {id}</h2>;
}
```

`useParams()` returns an object containing the matched route parameters.

**Important:** Route parameters are strings, even when they represent numbers.

For example, `/products/2` gives us:

```tsx
{ id: "2" }
```

If we need a number, we must convert it.

## 5. TypeScript Product Data

We use TypeScript interfaces to define the structure of product data.

```tsx
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

Example product data:

```tsx
export const products: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 80000,
    description: 'A laptop for everyday development.'
  },
  {
    id: 2,
    name: 'Keyboard',
    price: 2500,
    description: 'A mechanical keyboard.'
  }
];
```

### Why Use an Interface?

An interface defines the expected structure of an object.

It helps us:

- Maintain consistent data structures.
- Detect incorrect property types.
- Improve code readability.
- Get better editor autocomplete.
- Avoid accidental data-shape mistakes.

### Finding a Product Using a Route Parameter

```tsx
function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return <h2>Product not found!</h2>;
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
```

### Understanding find()

`find()` searches an array and returns the first element that satisfies the condition.

```tsx
const product = products.find(
  (item) => item.id === Number(id)
);
```

If a matching product exists, it returns that product.

If no product matches, it returns `undefined`.

That is why we check:

```tsx
if (!product) {
  return <h2>Product not found!</h2>;
}
```

This prevents the application from trying to display properties of a missing product.

## 6. Static Routes and Dynamic Routes

Example:

```tsx
<Route path="/products/new" element={<NewProduct />} />
<Route path="/products/:id" element={<ProductDetails />} />
```

React Router ranks route matches by specificity.

Therefore, `/products/new` matches the static route rather than treating `new` as a product ID.

This is useful when an application has both fixed paths and parameter-based paths.

## 7. Navigation Using useNavigate()

Sometimes navigation needs to happen after an action rather than after clicking a link.

For this, React Router provides `useNavigate()`.

```tsx
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/products')}>
      View Products
    </button>
  );
}
```

We can also navigate through browser history:

```tsx
navigate(-1);
```

This takes the user to the previous history entry when one exists.

Difference:

- `navigate('/products')` → Navigate to a specific URL.
- `navigate(-1)` → Go back in browser history.

## 8. Nested Routing

Nested routing allows multiple related routes to share a common parent layout.

For example, different pages can share the same navigation bar.

### Layout Component

```tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

### What Is Outlet?

`Outlet` is the placeholder where React Router renders the matching child route.

Without `Outlet`, the shared layout can still appear, but the nested child route's content will not be displayed in that location.

### Nested Route Configuration

```tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="products" element={<Products />} />
    <Route
      path="products/:id"
      element={<ProductDetails />}
    />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
```

### What Is an Index Route?

An index route is the default child route displayed at the parent's URL.

```tsx
<Route index element={<Home />} />
```

It renders `Home` at `/` in this route configuration.

### Benefits of Nested Routing

- Shared layouts.
- Less duplicated code.
- Better organization.
- Parent layout can remain mounted while child route content changes.

## 9. Wildcard Route and 404 Page

A wildcard route handles URLs that do not match any defined route.

```tsx
<Route path="*" element={<NotFound />} />
```

Example:

If someone visits `/unknown-page`, the application displays the NotFound component.

This provides a useful fallback instead of leaving the user on an unhandled page.

## 10. Modal Components

A modal is a pop-up interface displayed above the current page.

Common uses include:

- Confirmation messages.
- Delete confirmations.
- Forms.
- Important information.

In our project, we created a reusable modal component.

### Modal Props

```tsx
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
```

Understanding the props:

| Prop | Meaning |
|---|---|
| `isOpen` | Controls whether the modal is visible |
| `onClose` | Callback function used to close the modal |
| `children` | Content passed between the component's opening and closing tags |

### What Is ReactNode?

`ReactNode` is a React type representing renderable content.

It allows us to pass JSX, text, elements, and other supported React content into a component.

Example:

```tsx
<Modal isOpen={true} onClose={handleClose}>
  <h2>Confirm deletion</h2>
  <p>Are you sure?</p>
</Modal>
```

The content between the opening and closing `Modal` tags becomes its `children`.

### Conditional Rendering

```tsx
if (!isOpen) {
  return null;
}
```

When `isOpen` is false, the component returns nothing.

When it is true, the modal is rendered.

### Event Bubbling

When an event occurs on a child element, it can bubble up to its parent elements.

For example, clicking inside a modal can also trigger the overlay's click handler unless propagation is stopped.

We prevent this using:

```tsx
<div
  className="modal-content"
  onClick={(event) => event.stopPropagation()}
>
  {children}
</div>
```

`stopPropagation()` prevents the click event from continuing to parent elements.

This allows:

- Clicking the overlay → Close the modal.
- Clicking inside the modal → Keep it open.

### Escape-Key Handling with useEffect

We also implemented Escape-key handling.

```tsx
useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [isOpen, onClose]);
```

Understanding this:

1. `useEffect` handles a side effect.
2. We register a keyboard event listener when the modal is open.
3. When Escape is pressed, `onClose()` is called.
4. The cleanup function removes the listener.
5. The effect runs again when its dependencies change.

**Why is cleanup important?**

Without cleanup, event listeners can remain registered longer than intended. This can cause unwanted behavior and unnecessary listeners.

**Why use `[isOpen, onClose]`?**

The effect needs the current visibility state and the latest close callback.

## 11. Toast Notifications

A toast is a small notification that appears temporarily and disappears automatically.

We used the `react-toastify` library.

### Installation

```bash
npm install react-toastify
```

### Importing Toastify CSS

```tsx
import 'react-toastify/dist/ReactToastify.css';
```

### Adding ToastContainer

```tsx
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      {/* Application routes */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  );
}
```

`ToastContainer` provides the location and configuration for displaying toast notifications.

### Displaying Notifications

```tsx
import { toast } from 'react-toastify';

toast.success('Product deleted successfully!');
toast.error('Something went wrong!');
toast.info('Information message');
```

Common notification methods:

| Method | Purpose |
|---|---|
| `toast.success()` | Success message |
| `toast.error()` | Error message |
| `toast.info()` | Informational message |
| `toast.warning()` | Warning message |

### Modal vs Toast

| Modal | Toast |
|---|---|
| Pop-up interface | Small temporary notification |
| Often requires user action | Usually disappears automatically |
| Useful for confirmation | Useful for feedback |
| Can block interaction with the page | Usually does not block the page |

In our project:

- The modal asks the user to confirm product deletion.
- The toast informs the user after the deletion succeeds.

They have different responsibilities.

## 12. Product Deletion with useState

We implemented product deletion using local React state.

```tsx
const [productList, setProductList] = useState<Product[]>(products);

const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null);
```

### Understanding the State

`productList` stores the products currently displayed by the Products component.

`selectedProduct` stores the product selected for deletion.

When `selectedProduct` is `null`, no product is selected for deletion.

### Opening the Confirmation Modal

```tsx
const handleDeleteClick = (product: Product) => {
  setSelectedProduct(product);
};
```

### Confirming Deletion

```tsx
const handleConfirmDelete = () => {
  if (!selectedProduct) return;

  setProductList((previousList) =>
    previousList.filter(
      (product) => product.id !== selectedProduct.id
    )
  );

  setSelectedProduct(null);
  toast.success('Product deleted successfully!');
};
```

### Why Use filter()?

`filter()` creates a new array containing only the elements that satisfy a condition.

Here, we keep every product except the selected product.

It does not mutate the original array.

### Why Use a Functional State Updater?

```tsx
setProductList((previousList) => {
  return previousList.filter(
    (product) => product.id !== selectedProduct.id
  );
});
```

The updater receives the latest previous state.

This is useful when the next state depends on the previous state.

### Why Not Use splice()?

`splice()` changes the original array.

React state should be updated immutably by creating a new array or object rather than directly mutating existing state.

### Empty-State Rendering

```tsx
{productList.length === 0 ? (
  <p>No products available.</p>
) : (
  productList.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))
)}
```

This displays a message when no products remain.

## 13. Important State Management Observation

Our deletion implementation uses local component state:

```tsx
const [productList, setProductList] = useState<Product[]>(products);
```

This means the deletion updates the Products component's local list.

However, the ProductDetails component still reads from the original imported `products` array.

Therefore:

- A deleted product may still appear on its details route.
- Returning to Products after the component remounts can restore the original list.

This is a limitation of keeping related data in separate places.

**Future learning connection:** We can address shared state using Context API or another suitable state-management approach. We intentionally kept the current implementation within the scope of this assignment.

## 14. Important React and TypeScript Concepts

| Concept | Purpose |
|---|---|
| `useState` | Stores data that changes over time |
| `useEffect` | Handles side effects |
| `useParams` | Reads dynamic route parameters |
| `useNavigate` | Navigates programmatically |
| `ReactNode` | Types renderable React content |
| `interface` | Defines object structure |
| `find()` | Finds the first matching array element |
| `filter()` | Creates a filtered array |
| `map()` | Renders or transforms array elements |
| `stopPropagation()` | Stops event bubbling |
| Cleanup function | Removes or reverses an effect's external setup |
| Conditional rendering | Displays UI based on a condition |

## 15. Common Mistakes and Corrections

1. **Treating route parameters as numbers**

   `useParams()` returns strings. Convert them using `Number(id)` when comparing with numeric IDs.

2. **Forgetting the Outlet**

   A nested child route needs an `Outlet` in its parent layout to display its content.

3. **Using Link when active styling is required**

   Use `NavLink` when the active route needs special styling.

4. **Forgetting the missing-product check**

   `find()` can return `undefined`. Check the result before accessing its properties.

5. **Forgetting stopPropagation()**

   A click inside a modal may bubble to the overlay and close it.

6. **Not cleaning up event listeners**

   Remove event listeners in the `useEffect` cleanup function.

7. **Mutating React state directly**

   Prefer `filter()`, `map()`, or other immutable update patterns.

8. **Confusing modal and toast responsibilities**

   A modal is used for interaction or confirmation; a toast provides temporary feedback.

## 16. Final Learning Summary

In Week 7 Day 1, we learned how to build a structured React application using React Router.

We implemented:

- Client-side routing with BrowserRouter, Routes, and Route.
- Navigation using Link and NavLink.
- Dynamic routes using route parameters.
- Product lookup using TypeScript data and `find()`.
- Programmatic navigation using `useNavigate()`.
- Nested routing using Layout and Outlet.
- Index routes and wildcard 404 handling.
- A reusable modal using typed props and ReactNode.
- Overlay-click dismissal and event propagation control.
- Escape-key handling using useEffect and cleanup.
- Toast notifications using react-toastify.
- Product deletion using useState and immutable array updates.

**Main takeaway:** React Router organizes navigation, React state controls changing UI data, reusable components reduce duplication, and effects allow components to interact with external browser features such as keyboard events.