import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import { createTheme } from '@mui/material/styles';
import api from '../utils/api';
import Header from './Header';
import bg from '../assets/6.jpg';
import { useThemeContext } from '../ThemeContext';

export default function SignIn({ Login, setLogin }) {
  const { mode } = useThemeContext();
  // step: 'welcome' | 'portal_selection' | 'login'
  const [step, setStep] = useState('welcome');
  const [selectedPortal, setSelectedPortal] = useState('admin'); // 'admin' | 'employee'
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handlePortalSelect = (portal) => {
    setSelectedPortal(portal);
    setIsSignUp(false);
    setStep('login');
    setError('');
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      if (isSignUp) {
        // Register the new admin
        await api.post('/ems/register', { email, password, role: 'admin' });
        // Automatically login after successful signup
      }

      const response = await api.post('/ems/login', { email, password });
      const token = response.data.token;
      const role = response.data.role;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setLogin(true);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(isSignUp ? 'Error during sign up (email might be registered)' : 'Invalid credentials or user not found');
    }
  };

  return (
    <div 
      style={{
        padding: '0',
        margin: '0',
        backgroundImage: mode === 'dark' ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})` : `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header />

        <Container component="main" maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
          <CssBaseline />

          {/* STEP 1: WELCOME SCREEN */}
          {step === 'welcome' && (
            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
                borderRadius: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                Welcome to EMS Portal
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                Smart Employee & Project Management System. Manage employees, projects, and tasks with role-based access control.
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{ px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                onClick={() => setStep('portal_selection')}
              >
                Go to Dashboard / Select Portal
              </Button>
            </Paper>
          )}

          {/* STEP 2: PORTAL SELECTION (ADMIN vs EMPLOYEE) */}
          {step === 'portal_selection' && (
            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
                borderRadius: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Select Your Portal
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      bgcolor: (theme) => theme.palette.mode === 'light' ? '#e3f2fd' : '#1e3a5f', 
                      border: '2px solid #1976d2',
                      borderRadius: 3,
                      transition: '0.3s',
                      '&:hover': { transform: 'scale(1.03)' }
                    }}
                  >
                    <CardActionArea onClick={() => handlePortalSelect('admin')} sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar sx={{ m: '0 auto', bgcolor: '#1976d2', width: 56, height: 56, mb: 2 }}>
                        🛡️
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Admin Portal
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Access full system controls, employees, projects, and reports.
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      bgcolor: (theme) => theme.palette.mode === 'light' ? '#e8f5e9' : '#1b3e20', 
                      border: '2px solid #2e7d32',
                      borderRadius: 3,
                      transition: '0.3s',
                      '&:hover': { transform: 'scale(1.03)' }
                    }}
                  >
                    <CardActionArea onClick={() => handlePortalSelect('employee')} sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar sx={{ m: '0 auto', bgcolor: '#2e7d32', width: 56, height: 56, mb: 2 }}>
                        👨‍💼
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Employee Portal
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        View assigned tasks, update progress, and check deadlines.
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>

              <Button sx={{ mt: 3 }} onClick={() => setStep('welcome')}>
                ← Back to Welcome
              </Button>
            </Paper>
          )}

          {/* STEP 3: LOGIN FORM */}
          {step === 'login' && (
            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
                borderRadius: 3,
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: selectedPortal === 'admin' ? 'primary.main' : 'success.main' }}>
                <LockOutlinedIcon />
              </Avatar>

              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                {selectedPortal === 'admin' 
                  ? (isSignUp ? 'Admin Portal Sign Up' : 'Admin Portal Login') 
                  : 'Employee Portal Login'}
              </Typography>

              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}

              <Box component="form" onSubmit={handleAuth} noValidate sx={{ mt: 2, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={selectedPortal === 'admin' ? 'Admin Email' : 'Employee Email / Name'}
                  name="email"
                  autoComplete="email"
                  autoFocus
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={selectedPortal === 'admin' ? 'Admin Password' : 'Assigned Password'}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color={selectedPortal === 'admin' ? 'primary' : 'success'}
                  sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
                >
                  {isSignUp ? 'Sign Up as Admin' : `Log In to ${selectedPortal === 'admin' ? 'Admin' : 'Employee'} Portal`}
                </Button>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button size="small" onClick={() => setStep('portal_selection')}>
                    ← Change Portal
                  </Button>
                  
                  {selectedPortal === 'admin' && (
                    <Button size="small" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                      {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          )}
        </Container>
    </div>
  );
}
