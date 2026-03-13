import React, { useMemo, useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  Schedule,
  FitnessCenter,
  TrendingUp,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  Today,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, programs, weightEntries } = useData();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Update current time every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const memberSessions = useMemo(() => {
    return sessions
      .filter(session => session.memberId === user?.id)
      .sort((a, b) => dayjs(`${a.date} ${a.time}`).valueOf() - dayjs(`${b.date} ${b.time}`).valueOf());
  }, [sessions, user?.id]);

  const upcomingSessions = useMemo(() => {
    return memberSessions.filter(session => 
      dayjs(`${session.date} ${session.time}`).isAfter(currentTime) && session.status === 'booked'
    );
  }, [memberSessions, currentTime]);

  const nextSession = upcomingSessions[0];
  
  const getCountdownInfo = (session: any) => {
    if (!session) return null;
    
    const sessionDateTime = dayjs(`${session.date} ${session.time}`);
    const diffInMinutes = sessionDateTime.diff(currentTime, 'minute');
    const diffInHours = sessionDateTime.diff(currentTime, 'hour');
    const diffInDays = sessionDateTime.diff(currentTime, 'day');
    
    if (diffInMinutes <= 0) return null;
    
    const isWithin24Hours = diffInHours <= 24;
    
    let timeText = '';
    if (diffInDays > 0) {
      timeText = `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      const remainingMinutes = diffInMinutes % 60;
      timeText = `${diffInHours}h ${remainingMinutes}m`;
    } else {
      timeText = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
    
    return {
      timeText,
      isWithin24Hours,
      diffInMinutes,
      diffInHours
    };
  };
  
  const countdownInfo = getCountdownInfo(nextSession);

  const memberProgram = programs.find(program => program.memberId === user?.id);
  
  const recentWeightEntries = useMemo(() => {
    return weightEntries
      .filter(entry => entry.memberId === user?.id)
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, 3);
  }, [weightEntries, user?.id]);

  const completedTasksCount = memberProgram?.dailyTasks.filter(task => task.completed).length || 0;
  const totalTasksCount = memberProgram?.dailyTasks.length || 1;
  const progressPercentage = (completedTasksCount / totalTasksCount) * 100;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Welcome back, {user?.name}! 💪
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Here's your fitness overview for today
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Session Reminder Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Sessions
                </Typography>
              </Box>

              {nextSession ? (
                <Box>
                  {countdownInfo?.isWithin24Hours && (
                    <Alert 
                      severity={countdownInfo.diffInHours <= 2 ? "warning" : "info"} 
                      sx={{ mb: 2, borderRadius: 2 }}
                      icon={<AccessTime />}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Session starting in {countdownInfo.timeText}!
                      </Typography>
                      {countdownInfo.diffInHours <= 1 && (
                        <Typography variant="caption" display="block">
                          Don't forget to prepare your workout gear 💪
                        </Typography>
                      )}
                    </Alert>
                  )}
                  
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Next Session
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(nextSession.date).format('dddd, MMMM D')} at {nextSession.time}
                    </Typography>
                    {nextSession.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Focus:</strong> {nextSession.notes}
                      </Typography>
                    )}
                    <Chip
                      label="Booked"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  {upcomingSessions.length > 1 && (
                    <Typography variant="body2" color="text.secondary">
                      + {upcomingSessions.length - 1} more upcoming sessions
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No upcoming sessions scheduled
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/booking')}
                    sx={{ mt: 1 }}
                  >
                    Book a Session
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Progress Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Today />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Today's Progress
                </Typography>
              </Box>

              {memberProgram ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Daily Tasks Completed
                    </Typography>
                    <Typography variant="body2">
                      {completedTasksCount}/{totalTasksCount}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                  />
                  
                  <List dense>
                    {memberProgram.dailyTasks.slice(0, 3).map((task, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {task.completed ? (
                            <CheckCircle color="success" fontSize="small" />
                          ) : (
                            <RadioButtonUnchecked color="disabled" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={task.task}
                          primaryTypographyProps={{
                            variant: 'body2',
                            style: { textDecoration: task.completed ? 'line-through' : 'none' },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/programs')}
                    sx={{ mt: 1 }}
                  >
                    View Full Program
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No training program assigned yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Training Program Overview */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <FitnessCenter />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Current Training Program
                </Typography>
              </Box>

              {memberProgram ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {memberProgram.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Started {dayjs(memberProgram.createdDate).format('MMMM D, YYYY')}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    This Week's Focus:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {memberProgram.weeklyPlan.slice(0, 2).map((day, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="500">
                          {day.day}:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                          {day.exercises.join(', ')}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate('/programs')}
                    sx={{ mt: 1 }}
                  >
                    View Complete Program
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    You don't have a training program yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your coach will assign one during your first session
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weight Progress */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Weight Progress
                </Typography>
              </Box>

              {recentWeightEntries.length > 0 ? (
                <Box>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {recentWeightEntries[0].weight}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      kg (latest)
                    </Typography>
                  </Box>

                  <List dense>
                    {recentWeightEntries.map((entry) => (
                      <ListItem key={entry.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${entry.weight} kg`}
                          secondary={dayjs(entry.date).format('MMM D')}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => navigate('/weight-tracking')}
                    sx={{ mt: 1 }}
                  >
                    Track Weight
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Start tracking your weight progress
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/weight-tracking')}
                    sx={{ mt: 1 }}
                  >
                    Add First Entry
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDashboard;

