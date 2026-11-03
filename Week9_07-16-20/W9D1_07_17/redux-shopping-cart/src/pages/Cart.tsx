import React from 'react';
import { toast } from 'react-toastify';

import { useAppSelector, useAppDispatch } from '../app/hooks';

import {
  changeQuantity,
  removeFromCart,
  clearCart,
} from '../features/cart/cartSlice';

import './Cart.css';

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  // Derived value: calculate total from cart items
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>

              <td>Rs. {item.price.toFixed(2)}</td>

              <td>
                <div className="quantity-controls">
                  <button
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() =>
                      dispatch(
                        changeQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() =>
                      dispatch(
                        changeQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </td>

              <td>
                Rs. {(item.price * item.quantity).toFixed(2)}
              </td>

              <td>
                <button
                  className="remove-button"
                  onClick={() => {
                    dispatch(removeFromCart(item.id));
                    toast.info(`${item.name} removed from cart.`);
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-total">
        <h3>Total: Rs. {total.toFixed(2)}</h3>
      </div>

      <div className="cart-actions">
        <button
          className="clear-button"
          onClick={() => {
            dispatch(clearCart());
            toast.warn('Shopping cart cleared.');
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;