import {type Todo,type TodoAction } from '../types/todo';

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];

    case 'toggle':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );

    case 'delete':
      return state.filter((todo) => todo.id !== action.id);

    case 'clearDone':
      return state.filter((todo) => !todo.done);

    default:
      return state;
  }
}