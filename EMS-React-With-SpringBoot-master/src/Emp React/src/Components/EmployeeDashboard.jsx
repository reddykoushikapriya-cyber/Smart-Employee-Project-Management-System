import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Box, Card, CardContent, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Chip } from '@mui/material';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);

  const fetchEmployeeTasks = async () => {
    try {
      // Fetch all tasks (in a real scenario, back-end filters by logged-in user)
      const res = await api.get('/ems/tasks?size=100');
      setTasks(res.data.content || []);
    } catch (err) {
      console.error('Error fetching employee tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (task, newStatus, newProgress) => {
    try {
      await api.put(`/ems/tasks/${task.id}`, {
        ...task,
        status: newStatus,
        progress: newProgress
      });
      fetchEmployeeTasks();
    } catch (err) {
      console.error('Error updating task status', err);
    }
  };

  const assignedTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const upcomingDeadlines = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Employee Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#e3f2fd' : '#1e3a5f', borderLeft: '6px solid #1976d2' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                ASSIGNED TASKS (IN PROGRESS / PENDING)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {assignedTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#e8f5e9' : '#1b3e20', borderLeft: '6px solid #2e7d32' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                COMPLETED TASKS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                {completedTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#fff3e0' : '#4d2c00', borderLeft: '6px solid #ed6c02' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                TOTAL TASKS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                {tasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assigned Tasks Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          My Active Assigned Tasks
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#333333' }}>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Deadline</b></TableCell>
                <TableCell><b>Progress</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No pending assigned tasks!</TableCell>
                </TableRow>
              ) : (
                assignedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{task.deadline}</TableCell>
                    <TableCell>{task.progress}%</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task, e.target.value, task.progress)}
                      >
                        <MenuItem value="PENDING">PENDING</MenuItem>
                        <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                        <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Upcoming Deadlines Section */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Upcoming Deadlines
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f5f5' : '#333333' }}>
                <TableCell><b>Task Title</b></TableCell>
                <TableCell><b>Deadline Date</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upcomingDeadlines.slice(0, 5).map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'primary' : 'warning'} 
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EmployeeDashboard;
