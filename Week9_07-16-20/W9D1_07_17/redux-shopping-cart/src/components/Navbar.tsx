// src/components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const Navbar: React.FC = () => {
  const items = useAppSelector((state) => state.cart.items);
  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        marginBottom: '2rem',
      }}
    >
      <h2 style={{ margin: 0, color: '#333' }}>Redux Shopping Cart</h2>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {/* Products Navigation Link */}
        <NavLink
          to="/"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : '#333',
            fontWeight: isActive ? 'bold' : 'normal',
          })}
        >
          Products
        </NavLink>

        {/* Cart Navigation Link with Quantity Badge */}
        <NavLink
          to="/cart"
          style={({ isActive }) => ({
            position: 'relative',
            textDecoration: 'none',
            color: isActive ? '#007bff' : '#333',
            fontWeight: isActive ? 'bold' : 'normal',
          })}
        >
          🛒 Cart
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-16px',
              backgroundColor: '#ff4757',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              minWidth: '18px',
              textAlign: 'center',
            }}
          >
            {totalItems}
          </span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;