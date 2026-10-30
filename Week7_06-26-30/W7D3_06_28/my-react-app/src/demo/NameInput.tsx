import { useState } from "react";

function NameInput(){
    const [name, setName]= useState("");
    // const [submittedName, setSubmittedName] = useState("");
    function reset(){
        setName("");
        // setSubmittedName("");
    }
    return (
        <div>
            <label htmlFor="studentName">Student name:</label>

      <input
        id="studentName"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {/* <input
        id="studentName"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event)=>{
            if(event.key === "Enter"){
                setSubmittedName(name);
            }
        }}
      /> */}


      <p>Hello, {name || "Student"}!</p>
      {/* <p>Hello, {submittedName || "Student"}!</p> */}
      <p>Characters: {name.length}</p>
      <button type="button" onClick={reset}>Reset</button>
        </div>
    );
}

export default NameInput;