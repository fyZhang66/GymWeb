import React, { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  Schedule,
  FitnessCenter,
  TrendingUp,
  AccessTime,
  Event,
  Group,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { useNavigate } from 'react-router-dom';

const CoachDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions, programs, weightEntries } = useData();
  const navigate = useNavigate();

  const todaySessions = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return sessions
      .filter(session => session.date === today && session.status === 'booked')
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [sessions]);

  const upcomingSessions = useMemo(() => {
    const now = dayjs();
    return sessions
      .filter(session => 
        dayjs(`${session.date} ${session.time}`).isAfter(now) && 
        session.status === 'booked'
      )
      .sort((a, b) => dayjs(`${a.date} ${a.time}`).valueOf() - dayjs(`${b.date} ${b.time}`).valueOf())
      .slice(0, 5);
  }, [sessions]);

  const totalMembers = useMemo(() => {
    const memberIds = new Set(sessions.map(session => session.memberId));
    return memberIds.size;
  }, [sessions]);

  const completedSessionsThisWeek = useMemo(() => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs().endOf('week');
    return sessions.filter(session => {
      const sessionDate = dayjs(session.date);
      return sessionDate.isBetween(weekStart, weekEnd, null, '[]') && 
             session.status === 'completed';
    }).length;
  }, [sessions]);

  const activeProgramsCount = programs.length;

  const memberProgress = useMemo(() => {
    const memberData: { [memberId: string]: any } = {};
    
    sessions.forEach(session => {
      if (!memberData[session.memberId]) {
        memberData[session.memberId] = {
          id: session.memberId,
          name: session.memberName,
          totalSessions: 0,
          completedSessions: 0,
          lastSession: null,
        };
      }
      
      memberData[session.memberId].totalSessions++;
      if (session.status === 'completed') {
        memberData[session.memberId].completedSessions++;
      }
      
      if (!memberData[session.memberId].lastSession || 
          dayjs(session.date).isAfter(dayjs(memberData[session.memberId].lastSession))) {
        memberData[session.memberId].lastSession = session.date;
      }
    });

    // Add weight tracking data
    Object.values(memberData).forEach((member: any) => {
      const memberWeightEntries = weightEntries
        .filter(entry => entry.memberId === member.id)
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
      
      member.weightEntries = memberWeightEntries.length;
      if (memberWeightEntries.length >= 2) {
        const latest = memberWeightEntries[memberWeightEntries.length - 1];
        const first = memberWeightEntries[0];
        member.weightChange = latest.weight - first.weight;
      }
    });

    return Object.values(memberData);
  }, [sessions, weightEntries]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Coach Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}! Here's your training overview
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Group />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {totalMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <Schedule />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {completedSessionsThisWeek}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sessions This Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <FitnessCenter />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {activeProgramsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Programs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {todaySessions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Today's Schedule
                </Typography>
              </Box>

              {todaySessions.length > 0 ? (
                <List>
                  {todaySessions.map((session) => (
                    <ListItem key={session.id} sx={{ px: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Box>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="500">
                              {session.time}
                            </Typography>
                            <Typography variant="body2">
                              - {session.memberName}
                            </Typography>
                          </Box>
                        }
                        secondary={session.notes || 'Personal Training Session'}
                      />
                      <Chip 
                        label="Today" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Schedule sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No sessions scheduled for today
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enjoy your day off!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Event />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Upcoming Sessions
                </Typography>
              </Box>

              {upcomingSessions.length > 0 ? (
                <List>
                  {upcomingSessions.slice(0, 4).map((session) => (
                    <ListItem key={session.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="500">
                              {dayjs(session.date).format('MMM D')} at {session.time}
                            </Typography>
                            {dayjs(`${session.date} ${session.time}`).diff(dayjs(), 'hour') <= 24 && (
                              <Chip 
                                label="Soon" 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {session.memberName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {session.notes || 'Personal Training Session'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Event sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No upcoming sessions
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/manage-availability')}
                    sx={{ mt: 1 }}
                  >
                    Add Availability
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Member Progress */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Member Progress Overview
                  </Typography>
                </Box>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/program-management')}
                >
                  Manage Programs
                </Button>
              </Box>

              {memberProgress.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Member</strong></TableCell>
                        <TableCell><strong>Sessions</strong></TableCell>
                        <TableCell><strong>Completion Rate</strong></TableCell>
                        <TableCell><strong>Weight Tracking</strong></TableCell>
                        <TableCell><strong>Last Session</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberProgress.map((member: any) => {
                        const completionRate = member.totalSessions > 0 ? 
                          (member.completedSessions / member.totalSessions) * 100 : 0;
                        
                        return (
                          <TableRow key={member.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {member.name.charAt(0)}
                                </Avatar>
                                {member.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {member.completedSessions}/{member.totalSessions}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={completionRate}
                                  sx={{ width: 100, height: 6, borderRadius: 3 }}
                                />
                                <Typography variant="body2">
                                  {Math.round(completionRate)}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {member.weightEntries} entries
                                </Typography>
                                {member.weightChange && (
                                  <Chip
                                    label={`${member.weightChange > 0 ? '+' : ''}${member.weightChange.toFixed(1)} kg`}
                                    size="small"
                                    color={member.weightChange < 0 ? 'success' : 'warning'}
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {member.lastSession ? 
                                dayjs(member.lastSession).format('MMM D, YYYY') : 
                                'No sessions'
                              }
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Person sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No member data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoachDashboard;

