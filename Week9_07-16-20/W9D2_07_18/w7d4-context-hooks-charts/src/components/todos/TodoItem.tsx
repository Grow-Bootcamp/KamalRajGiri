import { type Todo } from "../../types/todo";
import { useTodos } from "../../context/TodoContext";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useTodos();

  const handleToggle = () => {
    dispatch({
      type: "toggle",
      id: todo.id,
    });
  };

  const handleDelete = () => {
    dispatch({
      type: "delete",
      id: todo.id,
    });
  };

  return (
    <li className={`todo-item ${todo.done ? "completed" : ""}`}>
  <button
    type="button"
    className="todo-text"
    onClick={handleToggle}
>
    {todo.text}
</button>

      <div className="todo-actions">
        <button onClick={handleToggle}>
          {todo.done ? "Undo" : "Complete"}
        </button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}