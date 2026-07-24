import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const ProjectList = ({ isAdmin }) => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'PENDING', priority: 'MEDIUM', deadline: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [page, search]);

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/ems/projects?query=${search}&page=${page}&size=10`);
      setProjects(response.data.content || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/ems/projects', newProject);
      setIsCreating(false);
      setNewProject({ name: '', description: '', status: 'PENDING', priority: 'MEDIUM', deadline: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ems/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        {isAdmin && <Button variant="contained" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'Create Project'}
        </Button>}
      </div>

      <TextField
        label="Search Projects"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isCreating && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <h3 className="text-xl mb-2">New Project</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Name" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} />
            <TextField label="Description" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select value={newProject.status} onChange={(e) => setNewProject({...newProject, status: e.target.value})}>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Priority</InputLabel>
              <Select value={newProject.priority} onChange={(e) => setNewProject({...newProject, priority: e.target.value})}>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
            <TextField type="date" label="Deadline" InputLabelProps={{ shrink: true }} value={newProject.deadline} onChange={(e) => setNewProject({...newProject, deadline: e.target.value})} />
          </div>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreate}>Save Project</Button>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.priority}</TableCell>
                <TableCell>{project.deadline}</TableCell>
                <TableCell>
                  {isAdmin && <Button color="error" onClick={() => handleDelete(project.id)}>Delete</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProjectList;
