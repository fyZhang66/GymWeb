import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  Assignment,
  CheckCircle,
  Today,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`program-tabpanel-${index}`}
      aria-labelledby={`program-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TrainingPrograms: React.FC = () => {
  const { user } = useAuth();
  const { programs, updateProgram } = useData();
  const [tabValue, setTabValue] = useState(0);

  const memberProgram = useMemo(() => {
    return programs.find(program => program.memberId === user?.id);
  }, [programs, user?.id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTaskToggle = (taskIndex: number) => {
    if (!memberProgram) return;

    const updatedTasks = [...memberProgram.dailyTasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      completed: !updatedTasks[taskIndex].completed,
    };

    updateProgram(memberProgram.id, { dailyTasks: updatedTasks });
  };

  const completedTasksCount = memberProgram?.dailyTasks.filter(task => task.completed).length || 0;
  const totalTasksCount = memberProgram?.dailyTasks.length || 1;

  if (!memberProgram) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Training Programs
        </Typography>
        
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Training Program Assigned
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Your coach will create a personalized training program for you after your first session.
            </Typography>
            <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
              Book your first session to get started with your fitness journey!
            </Alert>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Training Programs
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your personalized fitness and nutrition plan
      </Typography>

      {/* Program Overview Card */}
      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {memberProgram.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Started {dayjs(memberProgram.createdDate).format('MMMM D, YYYY')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary.main">
                {completedTasksCount}/{totalTasksCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Daily Tasks Complete
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {memberProgram.guidance}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<Today />} label="Daily Tasks" color="primary" variant="outlined" />
            <Chip icon={<FitnessCenter />} label="Weekly Plan" color="secondary" variant="outlined" />
            <Chip icon={<Restaurant />} label="Nutrition Guide" color="success" variant="outlined" />
          </Box>
        </CardContent>
      </Card>

      {/* Program Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Assignment />}
            label="Daily Tasks"
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab
            icon={<FitnessCenter />}
            label="Weekly Plan"
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab
            icon={<Restaurant />}
            label="Nutrition"
            iconPosition="start"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        </Tabs>

        {/* Daily Tasks Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Daily Tasks & Habits
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Complete these tasks daily to stay on track with your fitness goals
            </Typography>

            <List>
              {memberProgram.dailyTasks.map((task, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleTaskToggle(index)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: task.completed ? 'success.50' : 'transparent',
                    '&:hover': {
                      bgcolor: task.completed ? 'success.100' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskToggle(index)}
                      color="success"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.task}
                    primaryTypographyProps={{
                      style: {
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#666' : 'inherit',
                      },
                    }}
                  />
                  {task.completed && (
                    <CheckCircle color="success" fontSize="small" />
                  )}
                </ListItemButton>
              ))}
            </List>

            {completedTasksCount === totalTasksCount && (
              <Alert severity="success" sx={{ mt: 2 }} icon={<TrendingUp />}>
                Great job! You've completed all your daily tasks today. Keep up the excellent work!
              </Alert>
            )}
          </Box>
        </TabPanel>

        {/* Weekly Plan Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Weekly Training Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Follow this plan throughout the week for optimal results
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {memberProgram.weeklyPlan.map((day, index) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                  <Card 
                    variant="outlined"
                    sx={{
                      height: '100%',
                      bgcolor: dayjs().format('dddd') === day.day ? 'primary.50' : 'background.paper',
                      border: dayjs().format('dddd') === day.day ? '2px solid' : '1px solid',
                      borderColor: dayjs().format('dddd') === day.day ? 'primary.main' : 'divider',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight="bold">
                          {day.day}
                        </Typography>
                        {dayjs().format('dddd') === day.day && (
                          <Chip 
                            label="Today" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>
                      <List dense>
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <ListItem key={exerciseIndex} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <FitnessCenter fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={exercise}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* Nutrition Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Nutrition Guidelines
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Follow these nutrition recommendations to support your training goals
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {memberProgram.nutrition.map((meal, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Restaurant sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="subtitle1" fontWeight="500">
                          {meal.split(':')[0]}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {meal.split(':').slice(1).join(':').trim()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Tip:</strong> Stay hydrated throughout the day and try to eat balanced meals 
                2-3 hours before your training sessions for optimal performance.
              </Typography>
            </Alert>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default TrainingPrograms;

