// src/App.tsx
// import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from './components/Navbar';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';

export function App() {
  return (
      <BrowserRouter>
        <div style={{ fontFamily: 'Arial, sans-serif', paddingBottom: '3rem' }}>
          {/* Navbar rendered inside BrowserRouter so NavLinks function properly */}
          <Navbar />

          <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
            <Routes>
              {/* Products Route */}
              <Route path="/" element={<Products />} />

              {/* Cart Route */}
              <Route path="/cart" element={<Cart />} />

              {/* Wildcard Route for 404 Not Found */}
              <Route
                path="*"
                element={
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>404 - Page Not Found</h2>
                    <p>The page you are looking for does not exist.</p>
                    <NavLink
                      to="/"
                      style={{ color: '#007bff', textDecoration: 'underline' }}
                    >
                      Go back to Products
                    </NavLink>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Toast Notifications Container */}
          <ToastContainer position="bottom-right" autoClose={2500} />
        </div>
      </BrowserRouter>
  );
}

export default App;