import { useState } from 'react'
import './App.css'
// import ClockClass from './components/ClockClass'
import ClockFunction from './components/ClockFunction';

function App() {
  const [showClock, setShowClock] = useState(true);
 return (<main>
  <h1>Class Component Lyfecycle</h1>
  <h2>Clock Class</h2>
  {/* <button onClick={()=> setShowClock(!showClock)}>{showClock ? "Hide Clock" : "Show Clock"}</button> */}
  {/* {showClock && <ClockClass />} */}
  <h2>Clock Function</h2>

  <button onClick={()=> setShowClock(!showClock)}>{showClock ? "Hide Clock" : "Show Clock"}</button>
  {showClock && <ClockFunction />}
 </main>
 );
}

export default App
