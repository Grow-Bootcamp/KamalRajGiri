
import {useCallback, useState } from "react";
import "./App.css";
import ClockClass from "./components/ClockClass";
import ClockFunction from "./components/ClockFunction";
import TitleCounter from "./components/TitleCounter";
import UserList from "./components/UserList";
import LifecycleLog from "./components/LifeCycleLog";

function App() {
  const [showClassClock, setShowClassClock] = useState(true);
  const [showFunctionClock, setShowFunctionClock] = useState(true);
  const [showCounter, setShowCounter] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);

const addLog = useCallback((message:string)=>{
  const timeStamp = new Date().toLocaleTimeString();

  setMessages((previous)=> [`${timeStamp} - ${message}`, ...previous].slice(0,20));
},[])
  return (
    <main>
      <h1>React Lifecycle Monitor</h1>

      <section>
        <h2>Class Clock</h2>
        <button onClick={() => 
          setShowClassClock((previous) => !previous)
        }>
          {showClassClock ? "Hide Class Clock" : "Show Class Clock"}
        </button>
        {showClassClock && <ClockClass onLog={addLog} />}
      </section>

      <section>
        <h2>Functional Clock</h2>
        <button onClick={() => 
          setShowFunctionClock((previous)=> !previous)
        }>
          {showFunctionClock ? "Hide Function Clock" : "Show Function Clock"}
        </button>
        {showFunctionClock && <ClockFunction onLog={addLog} />}
      </section>

      <section>
        <h2>Title Counter</h2>
        <button onClick={() => setShowCounter((previous) => !previous)}>
          {showCounter ? "Hide Counter" : "Show Counter"}
        </button>
        {showCounter && <TitleCounter />}
      </section>

      <section>
        <h2>User Directory</h2>
        <UserList />
      </section>

      <LifecycleLog messages={messages} />
    </main>
  );
}

export default App;
