import { useTodos } from "../../context/TodoContext";

export default function TodoSummary(){
    const {todos, dispatch} = useTodos();

    const total = todos.length;
    const completed = todos.filter((todo)=> todo.done).length;
    const pending = total - completed;

    const handleClearCompleted =() => {
        dispatch({type:'clearDone'});
    };

    return (
        <div className="todo-summary">
            <div className="summary-stats">
                <span>Total: {total}</span>
                <span>Completed: {completed} </span>
                <span>Pending: {pending} </span>
            </div>

            <button onClick={handleClearCompleted} disabled={completed === 0} >
                Clear Completed
            </button>
        </div>
    );
}