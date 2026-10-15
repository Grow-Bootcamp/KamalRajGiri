import { useState, useEffect } from "react";

function TitleCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Effect setup : Counter Start.");
        const timerId = setInterval(() => {
            setCount(previousCount => previousCount + 1);
        }, 1000);
        return () => {
            console.log("Effect cleanup : Counter Stop.");
            clearInterval(timerId);
        }
    }, []);
    return (
        <div>
            <h1>Counter : {count}</h1>
        </div>
    );
}

export default TitleCounter;