import { createContext , useContext, useReducer,type Dispatch, type ReactNode } from "react";
import type { Todo, TodoAction } from "../types/todo";
import { todoReducer } from "./todoReducer";

export interface TodoContextValue {
todos: Todo[];
dispatch: Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextValue | null> (null);

const initialTodos: Todo[] = [];

interface TodoProviderProps {
    children: ReactNode;
}
export function TodoProvider({ children }: TodoProviderProps) {
    const [todos, dispatch] = useReducer(todoReducer, initialTodos);

    return (
        <TodoContext.Provider value={{ todos, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodos() {
    const context = useContext(TodoContext);

    if (context === null) {
        throw new Error("useTodos must be used within a TodoProvider");
    }

    return context;
}