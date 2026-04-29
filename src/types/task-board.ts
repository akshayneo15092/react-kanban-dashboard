export type Stage = 0 | 1 | 2 | 3;

export interface Task {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  deadline: string;
  stage: Stage;
  todo?:string;
  completed?:boolean | any;
}

export interface TaskState {
  list: Task[];
}
export interface TaskForm {
  title: string;
  priority: "Low" | "Medium" | "High";
  deadline: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  contact: string;
  password: string; 
  deadline?:string
}

export interface UserState {
  list: User[];
}