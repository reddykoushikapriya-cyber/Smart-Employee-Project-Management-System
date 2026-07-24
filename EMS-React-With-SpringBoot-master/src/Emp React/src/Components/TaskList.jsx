import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const TaskList = ({ isAdmin }) => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'PENDING', progress: 0, remarks: '', deadline: '', projectId: '', assigneeId: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (isAdmin && isCreating) {
      fetchProjectsAndEmployees();
    }
  }, [page, search, isCreating]);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/ems/tasks?query=${search}&page=${page}&size=10`);
      setTasks(response.data.content || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchProjectsAndEmployees = async () => {
     try {
       const projRes = await api.get('/ems/projects?size=100');
       setProjects(projRes.data.content || []);
       const empRes = await api.get('/ems/EmployeeDetail');
       setEmployees(empRes.data || []);
     } catch (e) {
       console.error(e);
     }
  };

  const handleCreate = async () => {
    try {
      await api.post('/ems/tasks', newTask);
      setIsCreating(false);
      setNewTask({ title: '', description: '', status: 'PENDING', progress: 0, remarks: '', deadline: '', projectId: '', assigneeId: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const handleUpdateStatus = async (task, newStatus, newProgress) => {
    try {
      await api.put(`/ems/tasks/${task.id}`, {
          ...task,
          status: newStatus,
          progress: newProgress
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ems/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        {isAdmin && <Button variant="contained" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'Create Task'}
        </Button>}
      </div>

      <TextField
        label="Search Tasks"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isCreating && isAdmin && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <h3 className="text-xl mb-2">New Task</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
            <TextField label="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
            <TextField type="date" label="Deadline" InputLabelProps={{ shrink: true }} value={newTask.deadline} onChange={(e) => setNewTask({...newTask, deadline: e.target.value})} />
            
            <FormControl>
              <InputLabel>Project</InputLabel>
              <Select value={newTask.projectId} onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}>
                {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Assignee</InputLabel>
              <Select value={newTask.assigneeId} onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}>
                {employees.map(e => <MenuItem key={e.id} value={e.id}>{e.firstname} {e.lastname}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreate}>Save Task</Button>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Select value={task.status} size="small" onChange={(e) => handleUpdateStatus(task, e.target.value, task.progress)}>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                   <TextField type="number" size="small" value={task.progress} onChange={(e) => handleUpdateStatus(task, task.status, e.target.value)} sx={{width: 80}} /> %
                </TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>{task.assignee ? task.assignee.firstname : 'Unassigned'}</TableCell>
                <TableCell>
                  {isAdmin && <Button color="error" onClick={() => handleDelete(task.id)}>Delete</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaskList;
