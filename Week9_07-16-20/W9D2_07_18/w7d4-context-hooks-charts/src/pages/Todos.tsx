import AddTodo from "../components/todos/AddTodo";
import TodoSummary from "../components/todos/TodoSummary";
import TodoList from "../components/todos/TodoList";

export default function Todos() {
  return (
    <main className="todos-page">
      <h1>My Todo App</h1>

      <AddTodo />

      <TodoSummary />

      <TodoList />

    </main>
  );
}