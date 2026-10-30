import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails'
import NotFound from './pages/NotFound';
import Layout from './pages/Layout';
import Modal from './components/Modal';


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
        <ToastContainer position='top-right' autoClose={3000} />
        <div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => toast.success('Operation successful!')}>
            Success
          </button>

          <button onClick={() => toast.error('Something went wrong!')}>
            Error
          </button>

          <button onClick={() => toast.info('Here is some information.')}>
            Info
          </button>
        </div>
      </div>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <button style={{ backgroundColor: 'green', color: 'white', border: '1px solid green', borderRadius: '5px', padding: '5px' }} onClick={() => setIsModalOpen(true)}>  OpenModal</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 id='modal-title'>Confirmation Required</h2>
        <p>Are you sure you want to perform this action?</p>
        <button style={{ color: 'white', backgroundColor: 'Red', borderRadius: '9px', border: '1px solid red', padding: '5px 8px' }} onClick={() => setIsModalOpen(false)}>Close</button>

      </Modal>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;