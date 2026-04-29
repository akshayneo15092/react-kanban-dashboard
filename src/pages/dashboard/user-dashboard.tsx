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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { Task } from "../../types/task-board";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const users = useSelector((state: any) => state.user.list);
  console.log(users.map((n: any) => console.log("name", n.name)));

  const usersTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  const completedLength = usersTasks.filter((u: Task) => u.stage === 3).length;
  const pendingLength = usersTasks.filter((u: Task) => u.stage !== 3).length;
  const getStatusChip = (stage: number) => {
    return stage === 3
      ? { label: "Completed", color: "success" }
      : { label: "Pending", color: "warning" };
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        pb: 10,
        width: "90vw",
      }}
    >
      {/* Top Bar */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src="/avatar.png" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Welcome back,
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {users.map((n: any) => n.name)}
            </Typography>
          </Box>
        </Stack>
        <IconButton>
          <Badge color="error" variant="dot">
            <Notifications />
          </Badge>
        </IconButton>
      </Box>

      {/* Main Content */}

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Greeting */}
        <Box mb={4}>
          <Button
            variant="contained"
            aria-label="add"
            onClick={() => navigate("/taskboard")}
          >
            Create a task
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography color="text.secondary">
            Here is your daily task summary for{" "}
            <Typography component="span" color="primary" fontWeight="medium">
              {new Date().toLocaleDateString()}
            </Typography>
            .
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          {/* Total Tasks */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 2, p: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-evenly" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Assignment color="primary" />
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {usersTasks.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 2, p: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-evenly" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "success.light",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle color="success" />
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {completedLength}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 2, p: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-evenly" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "warning.light",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Schedule color="warning" />
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {pendingLength}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Tasks */}
        <Box mt={5}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Recent Tasks
          </Typography>
          <Stack spacing={2}>
            {usersTasks.map((task: Task) => {
              const status = getStatusChip(task.stage);

              return (
                <Card key={task.id} variant="outlined" sx={{ borderRadius: 2 }}>
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
        </Box>
      </Container>

      {/* Floating Action Button */}
    </Box>
  );
};

export default DashboardPage;
