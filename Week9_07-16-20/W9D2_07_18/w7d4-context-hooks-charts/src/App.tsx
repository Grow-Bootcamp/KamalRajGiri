import { TodoProvider } from './context/TodoContext';
import Todos from './pages/Todos';
import Hooks from './pages/Hooks';
import Analytics from "./pages/Analytics";


import './App.css'

function App() {
  return (
<TodoProvider>
  <Todos />
  <Hooks />
  <Analytics />
</TodoProvider>
  );
}

export default App
