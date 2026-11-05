import { useState, type FormEvent } from "react";
import {useTodos} from "../../context/TodoContext";

export default function AddTodo(){
    const [text, setText] = useState('');
    const {dispatch} = useTodos();
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedText = text.trim();
        if(!trimmedText) return ;
        dispatch({
            type: "add",
            id: crypto.randomUUID(),
            text: trimmedText,
        });

        setText('');
    };
    return(<form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter a new todo..." value={text} onChange={(event) => setText(event.target.value) } /> 

        <button type="submit">Add</button>
    </form>);
}