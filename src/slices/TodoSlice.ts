import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskState, Stage } from "../types/TaskBoard";

const initialState: TaskState = {
  list: [],
  loading: false,
  error: undefined,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    fetchToDo: (state, action: PayloadAction<Task[]>) => {
      state.list = action.payload;
    },

    addToDo: (state, action: PayloadAction<Task>) => {
      state.list.push(action.payload);
    },

    updateToDo: (state, action: PayloadAction<Task>) => {
      const i = state.list.findIndex(t => t.id === action.payload.id);
      if (i !== -1) state.list[i] = action.payload;
    },

    deleteToDo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(t => t.id !== action.payload);
    },

    moveToDo: (
      state,
      action: PayloadAction<{ id: string; stage: Stage }>
    ) => {
      const task = state.list.find(t => t.id === action.payload.id);
      if (task) {
        task.stage = action.payload.stage;
      }
    },

    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  fetchToDo,
  addToDo,
  updateToDo,
  deleteToDo,
  moveToDo,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;