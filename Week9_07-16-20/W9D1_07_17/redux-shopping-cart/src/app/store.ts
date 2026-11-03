import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  type CartState,
} from '../features/cart/cartSlice';

const CART_STORAGE_KEY = 'redux_cart_state';

// Validate actual runtime data before treating it as CartState.
const isValidCartState = (value: unknown): value is CartState => {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('items' in value) ||
    !Array.isArray(value.items)
  ) {
    return false;
  }

  return value.items.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'number' &&
      Number.isFinite(item.id) &&
      typeof item.name === 'string' &&
      typeof item.price === 'number' &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      typeof item.quantity === 'number' &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 1
  );
};

// Load and validate saved cart data safely.
const loadCart = (): CartState | undefined => {
  try {
    const serializedState = localStorage.getItem(CART_STORAGE_KEY);

    if (!serializedState) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(serializedState);

    if (isValidCartState(parsed)) {
      return parsed;
    }

    console.warn('Invalid cart data found in localStorage.');
    return undefined;
  } catch (error) {
    console.error(
      'Failed to load cart state from localStorage:',
      error
    );

    return undefined;
  }
};

// Initialize Redux with saved cart data.
const preloadedState = {
  cart: loadCart() ?? { items: [] },
};

// Configure Redux store.
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

// Persist cart updates automatically.
store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState().cart);

    localStorage.setItem(CART_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error(
      'Failed to save cart state to localStorage:',
      error
    );
  }
});

// Export inferred Redux types.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;