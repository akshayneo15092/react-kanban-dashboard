import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserState } from "../types/task-board";

const initialState: UserState = {
  list:JSON.parse(localStorage.getItem("users") || "[]"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.list.push(action.payload);
      localStorage.setItem("users", JSON.stringify(state.list));
    },
  },
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
