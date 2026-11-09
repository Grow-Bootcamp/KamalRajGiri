import { useMemo, useState } from "react";

export default function ProductDashboard() {
  const [count, setCount] = useState(0);

  const products = [
    { id: 1, name: "Laptop", price: 80000 },
    { id: 2, name: "Phone", price: 40000 },
    { id: 3, name: "Keyboard", price: 3000 },
  ];

  const totalPrice = useMemo(() => {
    console.log("Calculating total price...");

    return products.reduce(
      (total, product) => total + product.price,
      0
    );
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Total product price: {totalPrice}</p>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}