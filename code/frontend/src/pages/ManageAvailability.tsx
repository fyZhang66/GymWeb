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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Alert,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule,
  AccessTime,
  Event,
  Save,
  Cancel,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs, { Dayjs } from 'dayjs';

type TimeSelectionMethod = 'preset' | 'custom';

const PRESET_TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const ManageAvailability: React.FC = () => {
  useAuth();
  const { availableSlots, addAvailableSlot, updateAvailableSlot, removeAvailableSlot, sessions } = useData();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [timeSelectionMethod, setTimeSelectionMethod] = useState<TimeSelectionMethod>('preset');
  const [selectedPresetTime, setSelectedPresetTime] = useState('');
  const [customTime, setCustomTime] = useState<Dayjs | null>(null);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  const sortedSlots = useMemo(() => {
    return [...availableSlots]
      .sort((a, b) => {
        const dateCompare = dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
  }, [availableSlots]);

  const groupedSlots = useMemo(() => {
    const groups: { [date: string]: typeof availableSlots } = {};
    sortedSlots.forEach(slot => {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    });
    return groups;
  }, [sortedSlots]);

  const handleAddSlot = () => {
    setEditingSlot(null);
    setSelectedDate(dayjs().add(1, 'day'));
    setTimeSelectionMethod('preset');
    setSelectedPresetTime('');
    setCustomTime(null);
    setError('');
    setDialogOpen(true);
  };

  const handleEditSlot = (slot: any) => {
    setEditingSlot(slot.id);
    setSelectedDate(dayjs(slot.date));
    
    // Check if the time is a preset time
    if (PRESET_TIMES.includes(slot.time)) {
      setTimeSelectionMethod('preset');
      setSelectedPresetTime(slot.time);
      setCustomTime(null);
    } else {
      setTimeSelectionMethod('custom');
      setSelectedPresetTime('');
      setCustomTime(dayjs(`2000-01-01 ${slot.time}`));
    }
    
    setError('');
    setDialogOpen(true);
  };

  const handleDeleteSlot = (slotId: string) => {
    // Check if slot is booked
    const slot = availableSlots.find(s => s.id === slotId);
    if (slot?.isBooked) {
      setError('Cannot delete a booked time slot. Please cancel the booking first.');
      return;
    }
    
    setSlotToDelete(slotId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (slotToDelete) {
      removeAvailableSlot(slotToDelete);
      setSlotToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleTimeSelectionMethodChange = (event: SelectChangeEvent<TimeSelectionMethod>) => {
    const method = event.target.value as TimeSelectionMethod;
    setTimeSelectionMethod(method);
    
    // Reset time selections when switching methods
    if (method === 'preset') {
      setCustomTime(null);
      setSelectedPresetTime('');
    } else {
      setSelectedPresetTime('');
      setCustomTime(null);
    }
  };

  const handleSaveSlot = () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    let timeValue = '';
    if (timeSelectionMethod === 'preset') {
      if (!selectedPresetTime) {
        setError('Please select a preset time');
        return;
      }
      timeValue = selectedPresetTime;
    } else {
      if (!customTime) {
        setError('Please select a custom time');
        return;
      }
      timeValue = customTime.format('HH:mm');
    }

    const dateStr = selectedDate.format('YYYY-MM-DD');
    
    // Check for conflicts
    const existingSlot = availableSlots.find(slot => 
      slot.date === dateStr && 
      slot.time === timeValue && 
      slot.id !== editingSlot
    );
    
    if (existingSlot) {
      setError('A time slot already exists for this date and time');
      return;
    }

    if (editingSlot) {
      // Update existing slot
      updateAvailableSlot(editingSlot, {
        date: dateStr,
        time: timeValue,
      });
    } else {
      // Add new slot
      addAvailableSlot({
        date: dateStr,
        time: timeValue,
        isBooked: false,
      });
    }

    setDialogOpen(false);
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSlot(null);
    setError('');
  };

  const getSlotStatus = (slot: any) => {
    if (slot.isBooked) {
      const session = sessions.find(s => 
        s.date === slot.date && 
        s.time === slot.time && 
        s.status === 'booked'
      );
      return session ? `Booked by ${session.memberName}` : 'Booked';
    }
    return 'Available';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Manage Availability
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSlot}
        >
          Add Time Slot
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {Object.keys(groupedSlots).length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Schedule sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Available Time Slots
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Create your first available time slot for members to book
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddSlot}
              sx={{ mt: 2 }}
            >
              Add Time Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(groupedSlots).map(([date, slots]) => (
            <Grid key={date} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Event />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {dayjs(date).format('dddd, MMM D')}
                    </Typography>
                  </Box>
                  
                  <List dense>
                    {slots.map((slot) => (
                      <ListItem key={slot.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTime sx={{ fontSize: 16 }} />
                              <Typography variant="body1" fontWeight="medium">
                                {slot.time}
                              </Typography>
                              <Chip
                                label={slot.isBooked ? 'Booked' : 'Available'}
                                size="small"
                                color={slot.isBooked ? 'error' : 'success'}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={getSlotStatus(slot)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditSlot(slot)}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteSlot(slot.id)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Slot Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Edit Time Slot' : 'Add Available Time Slot'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                },
              }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Time Selection Method</InputLabel>
              <Select
                value={timeSelectionMethod}
                onChange={handleTimeSelectionMethodChange}
                label="Time Selection Method"
              >
                <MenuItem value="preset">Preset Times</MenuItem>
                <MenuItem value="custom">Custom Time Picker</MenuItem>
              </Select>
            </FormControl>

            {timeSelectionMethod === 'preset' ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Time</InputLabel>
                <Select
                  value={selectedPresetTime}
                  onChange={(e) => setSelectedPresetTime(e.target.value)}
                  label="Select Time"
                >
                  {PRESET_TIMES.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TimePicker
                label="Custom Time"
                value={customTime}
                onChange={setCustomTime}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveSlot} variant="contained" startIcon={<Save />}>
            {editingSlot ? 'Update' : 'Add'} Slot
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this time slot? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddSlot}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ManageAvailability;