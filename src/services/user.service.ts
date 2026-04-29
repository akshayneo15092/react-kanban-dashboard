import type { AppDispatch } from "../store/store";
import { apiRequest } from "./api";
import type { User } from "../types/TaskBoard";
import { setLoading, fetchUsers, addUser, setError } from "../slices/UserSlice";

// fetch
export const getUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await apiRequest<User[]>("/users");
    dispatch(fetchUsers(data));
  } catch {
    dispatch(setError("Failed to fetch users"));
  } finally {
    dispatch(setLoading(false));
  }
};

// register
export const createUser =
  (user: User) => async (dispatch: AppDispatch) => {
    try {
      const data = await apiRequest<User>("/users", {
        method: "POST",
        body: JSON.stringify(user),
      });
      dispatch(addUser(data));
    } catch {
      dispatch(setError("Failed to create user"));
      throw new Error("Failed to create user");
    }
  };
