import React, { useState, useTransition } from "react";
import {
  AppBar,
  Box,
  CardContent,
  Chip,
  Divider,
  Fab,
  IconButton,
  InputAdornment,
  Paper,
  Alert,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  Search,
  MoreHoriz,
  ArrowBack,
  ArrowForward,
  Edit,
  Delete,
  Add,
 
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Form from "../../components/dynamic-form";
import {
  addToDo,
  deleteToDo,
  updateToDo,
  moveToDo,
} from "../../slices/todo-slice";
import type {
  Stage,
  Task,
  TaskForm,
  TaskFormErrors,
  User,
} from "../../types/task-board";
import { useNavigate } from "react-router-dom";

const STAGES: { label: string; value: Stage }[] = [
  { label: "Backlog", value: 0 },
  { label: "To Do", value: 1 },
  { label: "Ongoing", value: 2 },
  { label: "Done", value: 3 },
];

const taskFormConfig = [
  { name: "title", label: "Task Name" },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    options: ["Low", "Medium", "High"],
  },
  {
    name: "deadline",
    label: "Deadline",
    type: "date",
  },
];

const TaskBoard: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: any) => state.tasklist.list);
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  ) as User | null;
  const userTasks = tasks.filter(
    (task: Task) => task.userEmail === currentUser?.email
  );

  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchPending, startSearchTransition] = useTransition();
  const [taskErrors, setTaskErrors] = useState<TaskFormErrors>({});
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });
  const [showTrash, setShowTrash] = useState(false);
  const navigate = useNavigate();
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    priority: "Low",
    deadline: "",
  });

  const openAddTask = () => {
    setEditingTask(null);
    setTaskForm({ title: "", priority: "Low", deadline: "" });
    setTaskErrors({});
    setOpenForm(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      priority: task.priority,
      deadline: task.deadline,
    });
    setTaskErrors({});
    setOpenForm(true);
  };

  const submitTask = () => {
    const newErrors: TaskFormErrors = {};
    const normalizedTitle = taskForm.title.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!normalizedTitle) {
      newErrors.title = "Task name is required";
    } else if (normalizedTitle.length < 3) {
      newErrors.title = "Task name must be at least 3 characters";
    } else if (
      userTasks.some(
        (task: Task) =>
          task.title.trim().toLowerCase() === normalizedTitle &&
          task.id !== editingTask?.id
      )
    ) {
      newErrors.title = "A task with this name already exists";
    }

    if (!taskForm.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!taskForm.deadline) {
      newErrors.deadline = "Deadline is required";
    } else if (new Date(taskForm.deadline) < today) {
      newErrors.deadline = "Deadline cannot be in the past";
    }

    setTaskErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({
        open: true,
        message: "Please fix the highlighted task fields.",
        severity: "error",
      });
      return;
    }

    if (editingTask) {
      dispatch(
        updateToDo({
          ...editingTask,
          ...taskForm,
          title: taskForm.title.trim(),
        })
      );
      setToast({
        open: true,
        message: "Task updated successfully.",
        severity: "success",
      });
    } else {
      dispatch(
        addToDo({
          id: Date.now().toString(),
          userEmail: currentUser?.email || "",
          stage: 0,
          ...taskForm,
          title: taskForm.title.trim(),
        })
      );
      setToast({
        open: true,
        message: "Task created successfully.",
        severity: "success",
      });
     
    }

    setOpenForm(false);
    setEditingTask(null);
    setTaskErrors({});
  };

  const removeTask = (id: string) => {
    dispatch(deleteToDo(id));
    setToast({
      open: true,
      message: "Task deleted successfully.",
      severity: "success",
    });
  };

  const moveTask = (task: Task, dir: "back" | "forward") => {
    const newStage =
      dir === "back"
        ? Math.max(0, task.stage - 1)
        : Math.min(3, task.stage + 1);

    dispatch(moveToDo({ id: task.id, stage: newStage as Stage }));
    setToast({
      open: true,
      message: `Task moved to ${STAGES.find((stage) => stage.value === newStage)?.label}.`,
      severity: "info",
    });
  };

  const onDragStart = (id: string) => {
    setDraggedTaskId(id);
    setShowTrash(true);
  };

  const onDragEnd = () => {
    setDraggedTaskId(null);
    setShowTrash(false);
  };

  const onDropStage = (stage: Stage) => {
    if (!draggedTaskId) return;
    dispatch(moveToDo({ id: draggedTaskId, stage }));
    setToast({
      open: true,
      message: `Task moved to ${STAGES.find((item) => item.value === stage)?.label}.`,
      severity: "info",
    });
    onDragEnd();
  };
  const filteredTasks = userTasks.filter((task: Task) =>
    task.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <Box minHeight="100vh" bgcolor="#f4f7fb" pb={10}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          px={{ xs: 2, md: 4 }}
          py={1.5}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBack fontSize="small" />}
              onClick={() => navigate("/dashboard")}
              sx={{ textTransform: "none" }}
            >
              Dashboard
            </Button>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Task Board
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Drag tasks between stages or use the arrow controls.
              </Typography>
            </Box>
          </Stack>
          <TextField
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              startSearchTransition(() => {
                setSearchQuery(value);
              });
            }}
            placeholder="Search tasks"
            size="small"
            sx={{ width: { xs: 150, sm: 260 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        {isSearchPending && <LinearProgress />}
      </AppBar>

      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}
        onClick={openAddTask}
      >
        <Add />
      </Fab>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(280px, 1fr))",
            lg: "repeat(4, minmax(240px, 1fr))",
          },
          gap: 2.5,
          p: { xs: 2, md: 3 },
        }}
      >
        {STAGES.map((stage) => (
          <Paper
            key={stage.value}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              minHeight: 420,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight={800}>{stage.label}</Typography>
                  <Chip
                    label={
                      filteredTasks.filter((t: Task) => t.stage === stage.value)
                        .length
                    }
                    size="small"
                  />
                </Stack>
                <Tooltip title="Stage options">
                  <IconButton size="small" aria-label={`${stage.label} options`}>
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Box
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropStage(stage.value)}
                sx={{
                  minHeight: 320,
                  borderRadius: 1.5,
                  bgcolor: "#f8fafc",
                  p: 1,
                }}
              >
                <Stack spacing={1}>
                  {filteredTasks.filter((t: Task) => t.stage === stage.value)
                    .length === 0 && (
                    <Box
                      sx={{
                        p: 2,
                        minHeight: 110,
                        border: 1,
                        borderStyle: "dashed",
                        borderColor: "divider",
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      <Typography variant="body2">
                        {searchQuery ? "No matching tasks" : "Drop tasks here"}
                      </Typography>
                    </Box>
                  )}
                  {filteredTasks
                    .filter((t: Task) => t.stage === stage.value)
                    .map((task: Task) => (
                      <Paper
                        key={task.id}
                        draggable
                        elevation={0}
                        onDragStart={() => onDragStart(task.id)}
                        onDragEnd={onDragEnd}
                        sx={{
                          cursor: "grab",
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1.5,
                          bgcolor: "background.paper",
                        }}
                      >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            mb={1}
                            gap={1}
                          >
                            <Chip label={task.priority} size="small" />
                            <Typography variant="caption" color="text.secondary">
                              {task.deadline || "No date"}
                            </Typography>
                          </Stack>

                          <Typography fontWeight={800} textAlign="left">
                            {task.title}
                          </Typography>

                          <Divider sx={{ my: 1.5 }} />

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Tooltip title="Move back">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={task.stage === 0}
                                  onClick={() => moveTask(task, "back")}
                                >
                                  <ArrowBack fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Stack direction="row">
                              <Tooltip title="Edit task">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditTask(task)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete task">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeTask(task.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>

                            <Tooltip title="Move forward">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={task.stage === 3}
                                  onClick={() => moveTask(task, "forward")}
                                >
                                  <ArrowForward fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </CardContent>
                      </Paper>
                    ))}
                </Stack>
              </Box>
            </CardContent>
          </Paper>
        ))}
      </Box>

      {showTrash && (
        <Box
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedTaskId) removeTask(draggedTaskId);
            onDragEnd();
          }}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            bgcolor: "error.main",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            zIndex: 2000,
          }}
        >
          <Delete />
        </Box>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <Form
          title={editingTask ? "Edit Task" : "Add Task"}
          fields={taskFormConfig}
          values={taskForm}
          errors={taskErrors}
          onChange={(name, value) => {
            setTaskForm({ ...taskForm, [name]: value });
            setTaskErrors({ ...taskErrors, [name]: undefined });
          }}
          onSubmit={submitTask}
          submitText={editingTask ? "Update Task" : "Create Task"}
          footerText=""
          footerActionText=""
          onFooterAction={() => {}}
        />
      </Dialog>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskBoard;
