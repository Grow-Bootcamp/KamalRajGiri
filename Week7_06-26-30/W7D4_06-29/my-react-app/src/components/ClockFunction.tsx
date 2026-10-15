// import { count } from 'console';
import { useState, useEffect } from 'react'

function ClockFunction() {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        console.log("Effect setup: start the timer");
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            console.log("Effect cleanup: stop the timer");
            clearInterval(timerId);
        };
    },[]);
    return (
        <p>The time is {time.toLocaleTimeString()}</p>
    );
}
export default ClockFunction;