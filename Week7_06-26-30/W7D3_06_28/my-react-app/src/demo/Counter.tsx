
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((previousCount) => previousCount + 1);
  }

  function decrement() {
    setCount((previousCount) => previousCount - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div className="counter">
      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>

      <button type="button" onClick={decrement}>
        Decrement
      </button>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default Counter;
