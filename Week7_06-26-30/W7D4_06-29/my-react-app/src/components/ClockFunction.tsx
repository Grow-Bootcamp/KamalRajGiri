import { useState, useEffect } from 'react'
type ClockFunctionProps = {
    onLog: (message:string)=> void;
}


function ClockFunction({onLog}: ClockFunctionProps) {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        onLog("Function clock effect setup");
        console.log("Effect setup: start the timer");
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
            onLog("Function clock effect cleanup");
            console.log("Effect cleanup: stop the timer");
        };
    },[onLog]);
    return (
        <p>The time is {time.toLocaleTimeString()}</p>
    );
}
export default ClockFunction;