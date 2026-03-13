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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Fab,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Add, TrendingUp, TrendingDown, MonitorWeight, Event } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs, { Dayjs } from 'dayjs';

const WeightTracking: React.FC = () => {
  const { user } = useAuth();
  const { weightEntries, addWeightEntry } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const memberWeightEntries = useMemo(() => {
    return weightEntries
      .filter(entry => entry.memberId === user?.id)
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  }, [weightEntries, user?.id]);

  const chartData = useMemo(() => {
    return memberWeightEntries.map(entry => ({
      date: dayjs(entry.date).format('MMM D'),
      weight: entry.weight,
      fullDate: entry.date,
    }));
  }, [memberWeightEntries]);

  const weightTrend = useMemo(() => {
    if (memberWeightEntries.length < 2) return null;
    const latest = memberWeightEntries[memberWeightEntries.length - 1];
    const previous = memberWeightEntries[memberWeightEntries.length - 2];
    return latest.weight - previous.weight;
  }, [memberWeightEntries]);

  const handleAddWeight = () => {
    if (!weight || !selectedDate || !user) return;

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      return;
    }

    addWeightEntry({
      memberId: user.id,
      date: selectedDate.format('YYYY-MM-DD'),
      weight: weightValue,
      notes: notes.trim() || undefined,
    });

    setSuccessMessage('Weight entry added successfully!');
    setDialogOpen(false);
    setWeight('');
    setNotes('');
    setSelectedDate(dayjs());
    
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setWeight('');
    setNotes('');
    setSelectedDate(dayjs());
  };

  const latestWeight = memberWeightEntries[memberWeightEntries.length - 1];
  const firstWeight = memberWeightEntries[0];
  const totalWeightChange = latestWeight && firstWeight ? latestWeight.weight - firstWeight.weight : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Weight Tracking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your weight progress over time
          </Typography>
        </Box>
      </Box>

      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonitorWeight sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {latestWeight ? `${latestWeight.weight} kg` : 'No data'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Weight
              </Typography>
              {latestWeight && (
                <Typography variant="caption" color="text.secondary">
                  Last updated {dayjs(latestWeight.date).format('MMM D, YYYY')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {weightTrend !== null && (
                <>
                  {weightTrend >= 0 ? (
                    <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  )}
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    color={weightTrend >= 0 ? 'warning.main' : 'success.main'}
                  >
                    {weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Change
                  </Typography>
                </>
              )}
              {weightTrend === null && (
                <>
                  <TrendingUp sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="grey.400">
                    -
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Need more data
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {totalWeightChange !== 0 ? (
                <>
                  {totalWeightChange >= 0 ? (
                    <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  )}
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    color={totalWeightChange >= 0 ? 'info.main' : 'success.main'}
                  >
                    {totalWeightChange > 0 ? '+' : ''}{totalWeightChange.toFixed(1)} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Change
                  </Typography>
                </>
              ) : (
                <>
                  <TrendingUp sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="grey.400">
                    -
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No change yet
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weight Chart */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Weight Progress Chart
              </Typography>
              {chartData.length >= 2 ? (
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={['dataMin - 2', 'dataMax + 2']}
                        label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        labelFormatter={(label) => `Date: ${label}`}
                        formatter={(value: number) => [`${value} kg`, 'Weight']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#1976d2" 
                        strokeWidth={3}
                        dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <MonitorWeight sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Not enough data for chart
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add at least 2 weight entries to see your progress chart
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weight History Table */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Weight History
              </Typography>
              {memberWeightEntries.length > 0 ? (
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Weight (kg)</strong></TableCell>
                        <TableCell><strong>Change</strong></TableCell>
                        <TableCell><strong>Notes</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memberWeightEntries.slice().reverse().map((entry, index) => {
                        const previousEntry = memberWeightEntries[memberWeightEntries.length - index - 2];
                        const change = previousEntry ? entry.weight - previousEntry.weight : 0;
                        
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Event sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                                {dayjs(entry.date).format('MMM D, YYYY')}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {entry.weight} kg
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {index < memberWeightEntries.length - 1 && (
                                <Chip
                                  label={`${change > 0 ? '+' : ''}${change.toFixed(1)} kg`}
                                  color={change < 0 ? 'success' : change > 0 ? 'warning' : 'default'}
                                  size="small"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {entry.notes || '-'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <MonitorWeight sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No weight entries yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start tracking your weight to monitor your progress
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add weight entry"
        onClick={openDialog}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>

      {/* Add Weight Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Weight Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                    },
                  }}
                  maxDate={dayjs()}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  variant="outlined"
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 500,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., After workout, morning weight, etc."
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAddWeight} 
            variant="contained"
            disabled={!weight || !selectedDate}
          >
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeightTracking;

