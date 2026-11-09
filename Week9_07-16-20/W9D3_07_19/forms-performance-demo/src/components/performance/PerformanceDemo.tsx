import { memo, useCallback, useMemo, useState } from "react";

type ChildProps = {
  name: string;
  onAction: () => void;
};

// Memoized Child component
const Child = memo(function Child({ name, onAction }: ChildProps) {
  console.log("Child component rendered!");

  return (
    <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
      <p>Child Component (Name: {name})</p>
      <button onClick={onAction} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Trigger Action
      </button>
    </div>
  );
});

export default function PerformanceDemo() {
  const [count, setCount] = useState(0);

  // Stabilize the function reference across renders using useCallback
  const handleAction = useCallback(() => {
    console.log("Child action triggered");
  }, []);

  // Memoize the expensive or derived calculation using useMemo
  const squaredCount = useMemo(() => {
    console.log("Calculating squared count...");
    return count * count;
  }, [count]);

  return (
    <section className="form-container" style={{ padding: "2rem", maxWidth: "450px", margin: "2rem auto" }}>
      <h2>React Performance Demo</h2>

      <p><strong>Count:</strong> {count}</p>
      <p><strong>Squared Count:</strong> {squaredCount}</p>

      <button
        onClick={() => setCount((previous) => previous + 1)}
        style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "1rem" }}
      >
        Increment
      </button>

      {/* Render Child with memoized name prop and stabilized onAction callback */}
      <Child name="Performance Optimization Suite" onAction={handleAction} />
    </section>
  );
}