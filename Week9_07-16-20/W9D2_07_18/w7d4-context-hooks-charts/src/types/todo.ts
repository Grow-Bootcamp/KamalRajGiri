export interface Todo {
    id:string;
    text: string;
    done: boolean;
}

export type TodoAction = | {type : 'add'; id:string; text: string}  | {type : 'toggle'; id:string;}  | {type : 'delete'; id:string;}  | {type : 'clearDone'};