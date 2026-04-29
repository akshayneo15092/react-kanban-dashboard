import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user-slice"
import todoReducer from "../slices/todo-slice"
export const store = configureStore({
   reducer:{
     user: userReducer,
     tasklist:todoReducer
   }
})
