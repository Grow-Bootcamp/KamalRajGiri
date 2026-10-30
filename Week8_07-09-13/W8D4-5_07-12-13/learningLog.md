# Week 7 Day 1 - Learning Log

**Topic:** React Router, Nested Routing, Modals, and Toast Notifications

## Work Completed

### 1. React Router

- Configured `BrowserRouter`, `Routes`, and `Route` for client-side navigation.
- Implemented navigation with `NavLink` in the shared navigation bar and `Link` for product links.
- Created static routes for the home, about, and products pages.
- Created the dynamic `/products/:id` route for product details.
- Used `useParams()` to read the product ID from the URL.
- Validated the route parameter before converting it to a number and looking up the product.
- Added a product-not-found state with a `useNavigate(-1)` back action.
- Added a wildcard route for unknown URLs.

### 2. Nested Routing

- Created a reusable `Layout` component containing the navigation bar and `main` content area.
- Used `Outlet` to render the active child route inside the shared layout.
- Added an index route so the home page renders at `/`.
- Kept shared navigation mounted while child page content changes.

### 3. Reusable Modal

- Created a reusable `Modal` component with typed props.
- Used `ReactNode` to support flexible modal content.
- Rendered the modal conditionally from the `isOpen` prop.
- Added overlay-click dismissal.
- Used `stopPropagation()` so clicks inside the modal do not close it.
- Added Escape-key dismissal with `useEffect`.
- Removed the keyboard event listener during effect cleanup.
- Added dialog semantics with `role="dialog"`, `aria-modal`, and `aria-labelledby`.

### 4. Toast Notifications

- Installed and configured `react-toastify`.
- Imported the Toastify stylesheet and added a `ToastContainer`.
- Configured the container to display notifications in the top-right and close them automatically.
- Implemented success, error, and informational toast examples.
- Added a success toast after a product is deleted.

### 5. Product Deletion

- Managed the rendered product list with typed `useState<Product[]>` state.
- Opened a confirmation modal for the selected product.
- Added cancel and confirm actions.
- Used `filter()` to remove the selected product without mutating the previous array.
- Displayed an empty-state message when the local product list is empty.

### 6. TypeScript and Verification

- Defined the product shape with a TypeScript `Product` type.
- Added typed modal props and typed route parameters.
- Used the existing TypeScript configuration and Vite project setup.
- Verified the project with a TypeScript check and production build.

## Key Learnings

- Client-side routing maps URLs to React components without a full document reload.
- `Link` is suitable for ordinary navigation, while `NavLink` exposes active-route state.
- Dynamic route parameters are strings and should be validated before numeric conversion.
- `find()` can locate a product, but the missing-product case must be handled explicitly.
- `Outlet` is the insertion point for nested route content inside a shared layout.
- Reusable components become easier to maintain when their props and children are typed.
- Event bubbling explains why `stopPropagation()` is needed inside an overlay-based modal.
- Browser event listeners must be cleaned up when an effect is removed or rerun.
- Immutable updates with `filter()` keep React state changes predictable.

## Verification Results

- TypeScript check: Passed.
- Vite production build: Passed.
- Routing, nested layout rendering, modal behavior, toast notifications, and local product deletion: Implemented.

## Observation

Product deletion currently updates state local to the `Products` component. The imported `products` array remains unchanged, so a deleted product can still be found through the product-details route or appear again after the `Products` component remounts. Shared state management or a backend data source would be a suitable future improvement.

## Status

Week 7 Day 1 implementation and verification completed. The learning log documents the routing, modal, toast, and product-management work in `routing-demo-app`.


