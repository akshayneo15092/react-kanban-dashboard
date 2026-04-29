import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Badge,
  Button,
} from "@mui/material";
import {
  Notifications,
  Assignment,
  CheckCircle,
  Schedule,
  Add,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Task, User } from "../../types/task-board";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  ) as User | null;

  const usersTasks: Task[] = JSON.parse(
    localStorage.getItem("tasks") || "[]"
  ).filter((task: Task) => task.userEmail === currentUser?.email);
  const completedLength = usersTasks.filter((u: Task) => u.stage === 3).length;
  const pendingLength = usersTasks.filter((u: Task) => u.stage !== 3).length;
  const upcomingTasks = usersTasks.slice(0, 5);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  };

  const getStatusChip = (stage: number) => {
    return stage === 3
      ? { label: "Completed", color: "success" }
      : { label: "Pending", color: "warning" };
  };
  const stats = [
    {
      label: "Total Tasks",
      value: usersTasks.length,
      icon: <Assignment color="primary" />,
      bgcolor: "#eef6ff",
    },
    {
      label: "Completed",
      value: completedLength,
      icon: <CheckCircle color="success" />,
      bgcolor: "#eefaf2",
    },
    {
      label: "Pending",
      value: pendingLength,
      icon: <Schedule color="warning" />,
      bgcolor: "#fff7e6",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7fb",
        pb: 10,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          px: { xs: 2, md: 4 },
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src="/avatar.png" sx={{ width: 44, height: 44 }}>
            {currentUser?.name?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Welcome back,
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUser?.name || "User"}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton aria-label="notifications">
            <Badge color="error" variant="dot">
              <Notifications />
            </Badge>
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 } }}>
        <Box
          mb={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Task summary for{" "}
              <Typography component="span" color="primary" fontWeight={700}>
                {new Date().toLocaleDateString()}
              </Typography>
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/taskboard")}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Create task
          </Button>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: stat.bgcolor,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={800}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={5}>
          <Typography variant="h6" fontWeight={800} mb={2}>
            Recent Tasks
          </Typography>
          {upcomingTasks.length === 0 ? (
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography fontWeight={700}>No tasks yet</Typography>
              <Typography color="text.secondary" mt={0.5} mb={2}>
                Create your first task to see it tracked here.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/taskboard")}
                sx={{ textTransform: "none" }}
              >
                Create task
              </Button>
            </Box>
          ) : (
          <Stack spacing={1.5}>
            {upcomingTasks.map((task: Task) => {
              const status = getStatusChip(task.stage);

              return (
                <Card
                  key={task.id}
                  variant="outlined"
                  sx={{ borderRadius: 2, bgcolor: "background.paper" }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Box flex={1}>
                      <Typography variant="subtitle2">{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Task from API
                      </Typography>
                    </Box>

                    <Chip
                      label={status.label}
                      color={status.color as any}
                      size="small"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;
