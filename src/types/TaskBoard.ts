// Stage should be readable (not numbers)
export type Stage = 0 | 1 | 2 | 3;

export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  userEmail: string;
  title: string;
  priority: Priority;
  deadline: string; // ideally ISO string
  stage: Stage;
  completed?: boolean;
}

export interface TaskState {
  list: Task[];
  loading: boolean;
  error?: string;
}

export interface TaskForm {
  title: string;
  priority: Priority;
  deadline: string;
}

export interface TaskFormErrors {
  title?: string;
  priority?: string;
  deadline?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  contact: string;
  password?: string;
}

export interface UserState {
  list: User[];
  loading: boolean;
  error?: string;
}