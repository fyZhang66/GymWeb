import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
} from '@mui/material';
import {
  Schedule,
  CheckCircle,
  AccessTime,
  Event,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';

const BookingSessions: React.FC = () => {
  const { user } = useAuth();
  const { sessions, availableSlots, bookSession } = useData();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const memberSessions = useMemo(() => {
    return sessions
      .filter(session => session.memberId === user?.id)
      .sort((a, b) => dayjs(`${a.date} ${a.time}`).valueOf() - dayjs(`${b.date} ${b.time}`).valueOf());
  }, [sessions, user?.id]);

  const upcomingSessions = useMemo(() => {
    const now = dayjs();
    return memberSessions.filter(session => 
      dayjs(`${session.date} ${session.time}`).isAfter(now) && session.status === 'booked'
    );
  }, [memberSessions]);

  const availableSlotsGrouped = useMemo(() => {
    const now = dayjs();
    const validSlots = availableSlots
      .filter(slot => !slot.isBooked && dayjs(`${slot.date} ${slot.time}`).isAfter(now))
      .sort((a, b) => dayjs(`${a.date} ${a.time}`).valueOf() - dayjs(`${b.date} ${b.time}`).valueOf());

    const grouped: { [date: string]: typeof validSlots } = {};
    validSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });

    return grouped;
  }, [availableSlots]);

  const handleBookSession = () => {
    if (selectedSlot && user) {
      bookSession(selectedSlot, user.id, user.name);
      setSuccessMessage('Session booked successfully!');
      setConfirmDialogOpen(false);
      setSelectedSlot(null);
      setNotes('');
      
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const openConfirmDialog = (slotId: string) => {
    setSelectedSlot(slotId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedSlot(null);
    setNotes('');
  };

  const selectedSlotDetails = selectedSlot ? 
    availableSlots.find(slot => slot.id === selectedSlot) : null;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Book Training Sessions
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Schedule your upcoming training sessions with Coach Sarah
      </Typography>

      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Your Upcoming Sessions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Your Upcoming Sessions
                </Typography>
              </Box>

              {upcomingSessions.length > 0 ? (
                <List>
                  {upcomingSessions.map((session, index) => (
                    <React.Fragment key={session.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="500">
                                {dayjs(session.date).format('ddd, MMM D')} at {session.time}
                              </Typography>
                              <Chip 
                                label={session.status} 
                                color="success" 
                                size="small"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Coach Sarah • {session.notes || 'Personal Training Session'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                In {dayjs(`${session.date} ${session.time}`).diff(dayjs(), 'day')} days
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < upcomingSessions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Schedule sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No upcoming sessions booked
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Book a session from the available times
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Available Sessions */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Available Time Slots
                </Typography>
              </Box>

              {Object.keys(availableSlotsGrouped).length > 0 ? (
                <Box>
                  {Object.entries(availableSlotsGrouped).map(([date, slots]) => (
                    <Box key={date} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                        {dayjs(date).format('dddd, MMMM D, YYYY')}
                      </Typography>
                      <Grid container spacing={1}>
                        {slots.map((slot) => (
                          <Grid key={slot.id}>
                            <Button
                              variant="outlined"
                              onClick={() => openConfirmDialog(slot.id)}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                minWidth: 100,
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                },
                              }}
                            >
                              {slot.time}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AccessTime sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No available time slots
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for new availability
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Confirmation Dialog */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
            Confirm Booking
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSlotDetails && (
            <Box>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                You are about to book a training session
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Session Details:
                </Typography>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Date:</strong> {dayjs(selectedSlotDetails.date).format('dddd, MMMM D, YYYY')}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Time:</strong> {selectedSlotDetails.time}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Coach:</strong> Coach Sarah
                  </Typography>
                  <Typography variant="body1">
                    <strong>Duration:</strong> 60 minutes
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Session Goals/Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Focus on upper body strength, work on flexibility..."
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleBookSession} 
            variant="contained"
            startIcon={<CheckCircle />}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingSessions;

