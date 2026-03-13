import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  Grid,
  Chip,
} from '@mui/material';
import { FitnessCenter, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (role: 'member' | 'coach') => {
    if (role === 'member') {
      setEmail('member@gym.com');
      setPassword('123456789');
    } else {
      setEmail('coach@gym.com');
      setPassword('123456789');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'white',
                color: 'primary.main',
                mx: 'auto',
                mb: 2,
              }}
            >
              <FitnessCenter fontSize="large" />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              FitnessPro
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Your Personal Training Management System
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" gutterBottom textAlign="center" fontWeight="500">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                Sign in to your account to continue
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={<Lock />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  mb: 3,
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Test Accounts
                </Typography>
                <Grid container spacing={1} justifyContent="center">
                  <Grid>
                    <Chip
                      label="Member Account"
                      variant="outlined"
                      onClick={() => handleTestLogin('member')}
                      sx={{
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'action.hover' },
                        cursor: 'pointer',
                      }}
                    />
                  </Grid>
                  <Grid>
                    <Chip
                      label="Coach Account"
                      variant="outlined"
                      onClick={() => handleTestLogin('coach')}
                      sx={{
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'action.hover' },
                        cursor: 'pointer',
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Member: member@gym.com / 123456789
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Coach: coach@gym.com / 123456789
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;

