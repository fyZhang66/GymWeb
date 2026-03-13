import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import CoachDashboard from './pages/CoachDashboard';
import BookingSessions from './pages/BookingSessions';
import TrainingPrograms from './pages/TrainingPrograms';
import WeightTracking from './pages/WeightTracking';
import ProgramManagement from './pages/ProgramManagement';
import ManageAvailability from './pages/ManageAvailability';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ff6f00',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1976d2',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'member' ? '/dashboard' : '/coach-dashboard'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'member' ? '/dashboard' : '/coach-dashboard'} replace />} />
      
      {/* Member Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['member']}>
          <Layout><MemberDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking" element={
        <ProtectedRoute allowedRoles={['member']}>
          <Layout><BookingSessions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/programs" element={
        <ProtectedRoute allowedRoles={['member']}>
          <Layout><TrainingPrograms /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/weight-tracking" element={
        <ProtectedRoute allowedRoles={['member']}>
          <Layout><WeightTracking /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Coach Routes */}
      <Route path="/coach-dashboard" element={
        <ProtectedRoute allowedRoles={['coach']}>
          <Layout><CoachDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/program-management" element={
        <ProtectedRoute allowedRoles={['coach']}>
          <Layout><ProgramManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/manage-availability" element={
        <ProtectedRoute allowedRoles={['coach']}>
          <Layout><ManageAvailability /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to={user ? (user.role === 'member' ? '/dashboard' : '/coach-dashboard') : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <DataProvider>
            <Router>
              <div style={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
                <AppRoutes />
              </div>
            </Router>
          </DataProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;