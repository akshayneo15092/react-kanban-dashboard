import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stage, Task, TaskState } from "../types/task-board";


export const initialState: TaskState = {
  list: JSON.parse(localStorage.getItem("tasks") || "[]"),
};
const todoSlice = createSlice({
  name: "tasklist",
  initialState,
  reducers: {
    addToDo(state, action: PayloadAction<Task>) {
      state.list.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.list));
    },

    updateToDo(state, action: PayloadAction<Task>) {
      const index = state.list.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem("tasks", JSON.stringify(state.list));
      }
    },

    deleteToDo(state, action: PayloadAction<string>) {
      state.list = state.list.filter(t => t.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.list));
    },

    moveToDo(
      state,
      action: PayloadAction<{ id: string; stage: Stage }>
    ) {
      const task = state.list.find(t => t.id === action.payload.id);
      if (task) {
        task.stage = action.payload.stage;
        localStorage.setItem("tasks", JSON.stringify(state.list));
      }
    },
  },
});

export const { addToDo, updateToDo, deleteToDo, moveToDo } =
  todoSlice.actions;

export default todoSlice.reducer;
