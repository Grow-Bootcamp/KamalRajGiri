import React from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';

// 1. Define Product Type
export interface Product {
  id: number;
  name: string;
  price: number;
}

// 2. Sample Products Array
const sampleProducts: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 99.99 },
  { id: 2, name: 'Mechanical Keyboard', price: 149.99 },
  { id: 3, name: 'Gaming Mouse', price: 59.99 },
];

// 3. Products Component
export const Products: React.FC = () => {
  // 4. Initialize dispatch hook
  const dispatch = useAppDispatch();

  // 7. & 8. Handle dispatching action and showing toast notification
  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {sampleProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              width: '200px',
            }}
          >
            {/* 5. Display name and price */}
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>

            {/* 6. Add to Cart button */}
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;