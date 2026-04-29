import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Fab,
  IconButton,
  Stack,
  Typography,
  Dialog,
  Grid,
  Button,
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
import type { Stage, Task, TaskForm } from "../../types/task-board";
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

  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
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
    setOpenForm(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      priority: task.priority,
      deadline: task.deadline,
    });
    setOpenForm(true);
  };

  const submitTask = () => {
    if (!taskForm.title) return;

    if (editingTask) {
      dispatch(
        updateToDo({
          ...editingTask,
          ...taskForm,
        })
      );
    } else {
      dispatch(
        addToDo({
          id: Date.now().toString(),
          stage: 0,
          ...taskForm,
        })
      );
     
    }

    setOpenForm(false);
    setEditingTask(null);
  };

  const removeTask = (id: string) => {
    dispatch(deleteToDo(id));
  };

  const moveTask = (task: Task, dir: "back" | "forward") => {
    const newStage =
      dir === "back"
        ? Math.max(0, task.stage - 1)
        : Math.min(3, task.stage + 1);

    dispatch(moveToDo({ id: task.id, stage: newStage as Stage }));
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
    onDragEnd();
  };

  return (
    <Box minHeight="100vh" bgcolor="background.default" pb={10}>
      {/* HEADER */}
      <AppBar position="sticky" color="inherit">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
            variant="contained"
            aria-label="add"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowBack fontSize="small" />
          </Button>
            <Typography fontWeight="bold">Task Board</Typography>
          </Stack>
          <IconButton>
            <Search />
          </IconButton>
        </Stack>
      </AppBar>

      {/* ADD */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={openAddTask}
      >
        <Add />
      </Fab>

      <Grid container spacing={3}>
        {STAGES.map((stage) => (
          <Grid key={stage.value} sx={{ xs: 12, md: 4 }} py={2}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                {/* Stage Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                  width="20vw"
                >
                  <Typography fontWeight="bold">{stage.label}</Typography>
                  <IconButton size="small">
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Drop Area */}
                <Box
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDropStage(stage.value)}
                  sx={{
                    minHeight: 150,
                  }}
                >
                  {/* Tasks */}
                  <Stack spacing={1}>
                    {tasks
                      .filter((t: Task) => t.stage === stage.value)
                      .map((task: Task) => (
                        <Card
                          key={task.id}
                          draggable
                          onDragStart={() => onDragStart(task.id)}
                          onDragEnd={onDragEnd}
                          sx={{ cursor: "grab" }}
                        >
                          <CardContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              mb={1}
                            >
                              <Chip label={task.priority} size="small" />
                              <Typography variant="caption">
                                {task.deadline}
                              </Typography>
                            </Stack>

                            <Typography fontWeight="bold">
                              {task.title}
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <IconButton
                                size="small"
                                disabled={task.stage === 0}
                                onClick={() => moveTask(task, "back")}
                              >
                                <ArrowBack fontSize="small" />
                              </IconButton>

                              <Stack direction="row">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditTask(task)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => removeTask(task.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Stack>

                              <IconButton
                                size="small"
                                disabled={task.stage === 3}
                                onClick={() => moveTask(task, "forward")}
                              >
                                <ArrowForward fontSize="small" />
                              </IconButton>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TRASH */}
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
            borderRadius: "50%",
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

      {/* FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <Form
          title={editingTask ? "Edit Task" : "Add Task"}
          fields={taskFormConfig}
          values={taskForm}
          errors={{}}
          onChange={(name, value) =>
            setTaskForm({ ...taskForm, [name]: value })
          }
          onSubmit={submitTask}
          submitText={editingTask ? "Update Task" : "Create Task"}
          footerText=""
          footerActionText=""
          onFooterAction={() => {}}
        />
      </Dialog>
    </Box>
  );
};

export default TaskBoard;
