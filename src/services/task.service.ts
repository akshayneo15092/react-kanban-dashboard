import type { AppDispatch } from "../store/store";
import { apiRequest } from "./api";
import type { Task, Stage } from "../types/TaskBoard";

import {
  setLoading,
  fetchToDo,
  addToDo,
  updateToDo,
  deleteToDo,
  moveToDo,
  setError,
} from "../slices/TodoSlice";

// fetch
export const fetchTasks = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await apiRequest<Task[]>("/tasks");
    dispatch(fetchToDo(data));
  } catch {
    dispatch(setError("Failed to fetch"));
  } finally {
    dispatch(setLoading(false));
  }
};

// add
export const createTask =
  (task: Task) => async (dispatch: AppDispatch) => {
    const data = await apiRequest<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
    dispatch(addToDo(data));
  };

// update
export const editTask =
  (task: Task) => async (dispatch: AppDispatch) => {
    const data = await apiRequest<Task>(`/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    dispatch(updateToDo(data));
  };

// delete
export const removeTask =
  (id: string) => async (dispatch: AppDispatch) => {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    dispatch(deleteToDo(id));
  };

// move
export const changeStage =
  (task: Task, stage: Stage) =>
  async (dispatch: AppDispatch) => {
    const updated = { ...task, stage };
    dispatch(moveToDo({ id: task.id, stage }));
    try {
      await apiRequest<Task>(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
    } catch {
      dispatch(moveToDo({ id: task.id, stage: task.stage }));
    }
  };