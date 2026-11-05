import { useState, useCallback, memo } from "react";

interface ChildProps {
    onClick: () => void;
}

const Child = memo(function Child({ onClick }: ChildProps) {
    console.log("Child rendered");

    return <button onClick={onClick}>Child Button</button>;
});

export default function Parent() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("");

    const handleClick = useCallback(() => {
        console.log("Button clicked");
    }, []);

    return (
        <div>
            <h1>useCallback</h1>
            <h2>Count: {count}</h2>

            <button onClick={() => setCount(count + 1)}>
                Increase
            </button>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />
            <p>Name: {name}</p>

            <Child onClick={handleClick} />
        </div>
    );
}