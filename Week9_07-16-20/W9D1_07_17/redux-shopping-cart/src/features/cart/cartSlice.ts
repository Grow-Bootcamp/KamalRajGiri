import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types for Reducer Payloads
export type ProductToAdd = {
  id: number;
  name: string;
  price: number;
};

export type ChangeQuantityPayload = {
  id: number;
  quantity: number;
};

// 1. & 2. Cart Item & State Interfaces
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// 3. Initial State
const initialState: CartState = {
  items: [],
};

// 4. Create the Cart Slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 5a. Add to Cart: Adds a new item or increments quantity if it already exists
    addToCart: (state, action: PayloadAction<ProductToAdd>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Immer handles mutating push safely under the hood
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // 5b. Remove from Cart: Filters out an item by ID
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // 5c. Change Quantity: Ensures quantity cannot fall below 1
    changeQuantity: (state, action: PayloadAction<ChangeQuantityPayload>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Enforce minimum quantity of 1
        existingItem.quantity = Math.max(1, quantity);
      }
    },

    // 5d. Clear Cart: Resets items back to an empty array
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// 6. Export Action Creators and Reducer
export const { addToCart, removeFromCart, changeQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;