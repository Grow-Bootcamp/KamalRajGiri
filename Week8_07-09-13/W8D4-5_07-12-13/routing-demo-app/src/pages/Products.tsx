import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { products } from "../data/products";
import type { Product } from "../data/products";
import Modal from "../components/Modal";

function Products() {
 
  const [productList, setProductList] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  const handleDelete = () => {
    if (!selectedProduct) return;

    setProductList((prevList) => 
      prevList.filter((product) => product.id !== selectedProduct.id)
    );

    toast.success('Product deleted successfully!');

    setSelectedProduct(null);
  };

  return (
    <section style={{ padding: '1rem' }}>
      <h1>Products</h1>

     {productList.length > 0 ? (
       <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
        {productList.map((product) => (
          <li key={product.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to={`/products/${product.id}`}>
              {product.name}
            </Link>
            <span>-</span>
            <span>${product.price}</span>
            
            <button 
              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
              onClick={() => setSelectedProduct(product)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
     ): (
      <p style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
          No products available.
        </p>
     )}

      <Modal isOpen={selectedProduct !== null} onClose={() => setSelectedProduct(null)}>
        <h2 id="modal-title">Confirmation Required</h2>
        <p>
          Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
            onClick={handleDelete}
          >
            Confirm
          </button>
          <button 
            style={{ backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
            onClick={() => setSelectedProduct(null)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default Products;