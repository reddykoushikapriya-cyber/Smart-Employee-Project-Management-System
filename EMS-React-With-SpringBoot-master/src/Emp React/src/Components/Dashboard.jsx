import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Box, Tabs, Tab, Button, TextField } from '@mui/material';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetail from './EmployeeDetail';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import ProjectList from './ProjectList';
import TaskList from './TaskList';
import AdminOverview from './AdminOverview';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = ({setLogin, Login, defaultTab = 'overview'}) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(defaultTab);
  
  const [empSearch, setEmpSearch] = useState('');
  const [empPage, setEmpPage] = useState(0);

  const userRole = localStorage.getItem('role') || 'EMPLOYEE';
  const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

  useEffect(() => {
    if (currentTab === 'employees' && isAdmin) {
      fetchEmployees();
    }
  }, [currentTab, isAdmin, empSearch, empPage]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get(`/ems/search?query=${empSearch}&page=${empPage}&size=10`);
      setEmployees(response.data.content || []);
    } catch (error) {
      console.error('Error fetching employees:', error.response ? error.response.data : error.message);
    }
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  const handleAddOrUpdateEmployee = async (employee) => {
    try {
      if (employee && employee.id) {
        await api.put(`/ems/UpdateEmployee/${employee.id}`, employee);
      } else {
        await api.post('/ems/AddEmployee', employee);
        if (employee.password && employee.email) {
          try {
            await api.post('/ems/register', {
              email: employee.email,
              password: employee.password,
              role: 'employee'
            });
          } catch (regErr) {
            console.log('User registration notice:', regErr);
          }
        }
      }
      fetchEmployees();
      setIsEditing(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error adding/updating employee:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await api.delete(`/ems/DeleteEmployee/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error.response ? error.response.data : error.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleDownloadReport = async () => {
    try {
      const response = await api.get('/ems/reports/tasks/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'task_report.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading report', error);
    }
  };

  return (
    <div>
      <PrimarySearchAppBar setLogin={setLogin} Login={Login} />
      
      {!isAdmin ? (
        /* Distinct Employee Dashboard View */
        <EmployeeDashboard />
      ) : (
        /* Distinct Admin Dashboard View */
        <div>
          <Box sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange} centered>
              <Tab label="Overview" value="overview" />
              <Tab label="Employees" value="employees" />
              <Tab label="Projects" value="projects" />
              <Tab label="Tasks" value="tasks" />
            </Tabs>
          </Box>

          {currentTab === 'overview' && (
            <Box sx={{ p: 2 }}>
              <AdminOverview 
                onNavigateTab={(tab) => setCurrentTab(tab)} 
                handleDownloadReport={handleDownloadReport} 
              />
            </Box>
          )}

          {currentTab === 'employees' && (
            <Box sx={{ p: 3 }}>
              <h2 className='text-2xl mb-4 font-bold'>Manage Employees</h2>
              <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                <TextField 
                  label="Search Employees" 
                  variant="outlined" 
                  size="small" 
                  value={empSearch} 
                  onChange={(e) => setEmpSearch(e.target.value)} 
                />
                <Button variant="outlined" onClick={() => setEmpPage(Math.max(0, empPage - 1))}>Prev</Button>
                <Button variant="outlined" onClick={() => setEmpPage(empPage + 1)}>Next</Button>
                <Button variant="contained" onClick={() => { setSelectedEmployee(null); setIsEditing(true); }}>Add Employee</Button>
              </Box>
              <EmployeeList
                employees={employees}
                onSelectEmployee={handleSelectEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                isAdmin={isAdmin}
              />
              {isEditing && (
                <EmployeeForm
                  employee={selectedEmployee}
                  onAddOrUpdateEmployee={handleAddOrUpdateEmployee}
                  setIsEditing={setIsEditing}
                  isAdmin={isAdmin}
                />
              )}
              {selectedEmployee && !isEditing && (
                <EmployeeDetail employee={selectedEmployee} />
              )}
            </Box>
          )}

          {currentTab === 'projects' && (
            <Box sx={{ p: 3 }}>
               <ProjectList isAdmin={isAdmin} />
            </Box>
          )}

          {currentTab === 'tasks' && (
            <Box sx={{ p: 3 }}>
               <Button variant="contained" color="secondary" onClick={handleDownloadReport} sx={{ mb: 2 }}>
                  Download Task Report (CSV)
               </Button>
               <TaskList isAdmin={isAdmin} />
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
