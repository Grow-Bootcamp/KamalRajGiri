import { useMemo, useState } from "react";

export default function MemoExample(){
    const [count, setCount] = useState(0);
    const [name,setName] = useState("");

    const expensiveCalculation = (num:number) => {
        console.log('Calculating...');
        return num * num;
    };

    const square = useMemo(() => {
        return expensiveCalculation(count);
    },[count]);

    return(
        <div>
            <h1>useMemo</h1>
            <h2>Number: {count}</h2>
            <h2>Squared: {square} </h2>
            <button onClick={()=> setCount(count+1) }>Increase</button>
            <input value={name} onChange={(event) =>setName(event.target.value)} aria-placeholder="Enter your name "  />
            <p>Name: {name}</p>
        </div>
    )
}