import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Box, Card, CardContent, Typography, Grid, Button, Paper } from '@mui/material';

const AdminOverview = ({ onNavigateTab, handleDownloadReport }) => {
  const [stats, setStats] = useState({ employees: 0, projects: 0, tasks: 0, completedTasks: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [empRes, projRes, taskRes] = await Promise.all([
        api.get('/ems/EmployeeDetail'),
        api.get('/ems/projects?size=100'),
        api.get('/ems/tasks?size=100')
      ]);

      const empCount = Array.isArray(empRes.data) ? empRes.data.length : (empRes.data.totalElements || 0);
      const projCount = projRes.data.totalElements || projRes.data.content?.length || 0;
      const taskList = taskRes.data.content || [];
      const completedCount = taskList.filter(t => t.status === 'COMPLETED').length;

      setStats({
        employees: empCount,
        projects: projCount,
        tasks: taskList.length,
        completedTasks: completedCount
      });
    } catch (e) {
      console.error('Error fetching admin overview stats', e);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Admin Dashboard Overview
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleDownloadReport}>
          Download Task Report (CSV)
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#e3f2fd' : '#1e3a5f', borderLeft: '6px solid #1976d2', cursor: 'pointer' }} onClick={() => onNavigateTab('employees')}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                TOTAL EMPLOYEES
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.employees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f3e5f5' : '#3c1a4d', borderLeft: '6px solid #9c27b0', cursor: 'pointer' }} onClick={() => onNavigateTab('projects')}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                TOTAL PROJECTS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {stats.projects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#fff3e0' : '#4d2c00', borderLeft: '6px solid #ed6c02', cursor: 'pointer' }} onClick={() => onNavigateTab('tasks')}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                TOTAL TASKS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                {stats.tasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#e8f5e9' : '#1b3e20', borderLeft: '6px solid #2e7d32', cursor: 'pointer' }} onClick={() => onNavigateTab('tasks')}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                COMPLETED TASKS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                {stats.completedTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Quick Management Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={() => onNavigateTab('employees')}>
            Manage Employees
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => onNavigateTab('projects')}>
            Manage Projects
          </Button>
          <Button variant="outlined" color="warning" onClick={() => onNavigateTab('tasks')}>
            Manage Tasks
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminOverview;
