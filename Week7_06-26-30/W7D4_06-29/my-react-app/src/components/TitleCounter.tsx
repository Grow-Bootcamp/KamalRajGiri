import { useState, useEffect } from "react";

function TitleCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);
    return (
        <button onClick={()=> setCount(count + 1)}>
            Count: {count}
        </button>
    );
}

export default TitleCounter;