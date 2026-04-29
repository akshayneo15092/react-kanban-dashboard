import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/UserSlice"
import todoReducer from "../slices/TodoSlice"

export const store = configureStore({
   reducer:{
     user: userReducer,
     tasklist:todoReducer
   }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
