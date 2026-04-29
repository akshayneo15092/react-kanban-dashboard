import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserState } from "../types/TaskBoard";

const initialState: UserState = {
  list: [],
  loading: false,
  error: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    fetchUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, fetchUsers, addUser, setError } = userSlice.actions;

export default userSlice.reducer;
