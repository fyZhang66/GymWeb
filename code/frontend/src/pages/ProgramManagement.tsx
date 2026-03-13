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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Avatar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FitnessCenter,
  Restaurant,
  Assignment,
  ExpandMore,
  Person,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import dayjs from 'dayjs';

interface ProgramFormData {
  memberId: string;
  memberName: string;
  title: string;
  guidance: string;
  nutrition: string[];
  weeklyPlan: { day: string; exercises: string[] }[];
  dailyTasks: { task: string; completed: boolean }[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ProgramManagement: React.FC = () => {
  useAuth();
  const { programs, sessions, addProgram, updateProgram } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState<ProgramFormData>({
    memberId: '',
    memberName: '',
    title: '',
    guidance: '',
    nutrition: [''],
    weeklyPlan: DAYS_OF_WEEK.map(day => ({ day, exercises: [''] })),
    dailyTasks: [{ task: '', completed: false }],
  });

  const members = useMemo(() => {
    const memberMap = new Map();
    
    // Add members from sessions
    sessions.forEach(session => {
      if (!memberMap.has(session.memberId)) {
        memberMap.set(session.memberId, {
          id: session.memberId,
          name: session.memberName,
        });
      }
    });
    
    // Add default test members if no members from sessions
    const defaultMembers = [
      { id: 'member1', name: 'John Member' },
      { id: 'member2', name: 'Jane Smith' },
      { id: 'member3', name: 'Mike Johnson' },
      { id: 'member4', name: 'Sarah Wilson' },
    ];
    
    defaultMembers.forEach(member => {
      if (!memberMap.has(member.id)) {
        memberMap.set(member.id, member);
      }
    });
    
    return Array.from(memberMap.values());
  }, [sessions]);

  const resetForm = () => {
    setFormData({
      memberId: '',
      memberName: '',
      title: '',
      guidance: '',
      nutrition: [''],
      weeklyPlan: DAYS_OF_WEEK.map(day => ({ day, exercises: [''] })),
      dailyTasks: [{ task: '', completed: false }],
    });
    setEditingProgram(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (program: any) => {
    setFormData({
      memberId: program.memberId,
      memberName: program.memberName,
      title: program.title,
      guidance: program.guidance,
      nutrition: [...program.nutrition],
      weeklyPlan: program.weeklyPlan.map((day: any) => ({
        day: day.day,
        exercises: [...day.exercises],
      })),
      dailyTasks: program.dailyTasks.map((task: any) => ({
        task: task.task,
        completed: task.completed,
      })),
    });
    setEditingProgram(program.id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleMemberSelect = (memberId: string, memberName: string) => {
    setFormData(prev => ({
      ...prev,
      memberId,
      memberName,
    }));
  };

  const addNutritionItem = () => {
    setFormData(prev => ({
      ...prev,
      nutrition: [...prev.nutrition, ''],
    }));
  };

  const updateNutritionItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      nutrition: prev.nutrition.map((item, i) => i === index ? value : item),
    }));
  };

  const removeNutritionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      nutrition: prev.nutrition.filter((_, i) => i !== index),
    }));
  };

  const addExercise = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      weeklyPlan: prev.weeklyPlan.map((day, i) => 
        i === dayIndex 
          ? { ...day, exercises: [...day.exercises, ''] }
          : day
      ),
    }));
  };

  const updateExercise = (dayIndex: number, exerciseIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      weeklyPlan: prev.weeklyPlan.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              exercises: day.exercises.map((exercise, j) => 
                j === exerciseIndex ? value : exercise
              ),
            }
          : day
      ),
    }));
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    setFormData(prev => ({
      ...prev,
      weeklyPlan: prev.weeklyPlan.map((day, i) => 
        i === dayIndex 
          ? {
              ...day,
              exercises: day.exercises.filter((_, j) => j !== exerciseIndex),
            }
          : day
      ),
    }));
  };

  const addDailyTask = () => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: [...prev.dailyTasks, { task: '', completed: false }],
    }));
  };

  const updateDailyTask = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((task, i) => 
        i === index ? { ...task, task: value } : task
      ),
    }));
  };

  const removeDailyTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!formData.memberId || !formData.title || !formData.guidance) {
      return;
    }

    const programData = {
      memberId: formData.memberId,
      memberName: formData.memberName,
      title: formData.title,
      guidance: formData.guidance,
      nutrition: formData.nutrition.filter(item => item.trim()),
      weeklyPlan: formData.weeklyPlan
        .map(day => ({
          day: day.day,
          exercises: day.exercises.filter(exercise => exercise.trim()),
        }))
        .filter(day => day.exercises.length > 0),
      dailyTasks: formData.dailyTasks
        .filter(task => task.task.trim())
        .map(task => ({ task: task.task, completed: false })),
      createdDate: editingProgram ? programs.find(p => p.id === editingProgram)?.createdDate || dayjs().format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    };

    if (editingProgram) {
      updateProgram(editingProgram, programData);
      setSuccessMessage('Program updated successfully!');
    } else {
      addProgram(programData);
      setSuccessMessage('Program created successfully!');
    }

    closeDialog();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Program Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage training programs for your members
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
        {programs.length > 0 ? (
          programs.map((program) => (
            <Grid size={{ xs: 12 }} key={program.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {program.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {program.memberName} • Created {dayjs(program.createdDate).format('MMM D, YYYY')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton 
                        onClick={() => openEditDialog(program)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {program.guidance}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<Restaurant />} 
                      label={`${program.nutrition.length} nutrition items`} 
                      color="success" 
                      variant="outlined" 
                      size="small"
                    />
                    <Chip 
                      icon={<FitnessCenter />} 
                      label={`${program.weeklyPlan.length} workout days`} 
                      color="secondary" 
                      variant="outlined" 
                      size="small"
                    />
                    <Chip 
                      icon={<Assignment />} 
                      label={`${program.dailyTasks.length} daily tasks`} 
                      color="primary" 
                      variant="outlined" 
                      size="small"
                    />
                  </Box>

                  {/* Program Details Accordion */}
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" fontWeight="500">
                        View Program Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Daily Tasks:
                          </Typography>
                          <List dense>
                            {program.dailyTasks.map((task, index) => (
                              <ListItem key={index} sx={{ py: 0 }}>
                                <ListItemText 
                                  primary={task.task}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Weekly Plan:
                          </Typography>
                          {program.weeklyPlan.slice(0, 3).map((day, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" fontWeight="500">
                                {day.day}:
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {day.exercises.join(', ')}
                              </Typography>
                            </Box>
                          ))}
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Nutrition:
                          </Typography>
                          {program.nutrition.slice(0, 3).map((item, index) => (
                            <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              • {item}
                            </Typography>
                          ))}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <FitnessCenter sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Training Programs Created
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Create your first training program for a member
                </Typography>
                <Button
                  variant="contained"
                  onClick={openCreateDialog}
                  sx={{ mt: 2 }}
                  startIcon={<Add />}
                >
                  Create Program
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create program"
        onClick={openCreateDialog}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>

      {/* Create/Edit Program Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          {editingProgram ? 'Edit Training Program' : 'Create New Training Program'}
        </DialogTitle>
        <DialogContent sx={{ overflow: 'auto' }}>
          <Box sx={{ pt: 2 }}>
            {/* Member Selection */}
            {!editingProgram && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Select Member:
                </Typography>
                <Grid container spacing={1}>
                  {members.map((member) => (
                    <Grid key={member.id}>
                      <Chip
                        label={member.name}
                        variant={formData.memberId === member.id ? 'filled' : 'outlined'}
                        color={formData.memberId === member.id ? 'primary' : 'default'}
                        onClick={() => handleMemberSelect(member.id, member.name)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Basic Information */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Program Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Program Guidance & Instructions"
                  multiline
                  rows={3}
                  value={formData.guidance}
                  onChange={(e) => setFormData(prev => ({ ...prev, guidance: e.target.value }))}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Daily Tasks */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Daily Tasks & Habits:
              </Typography>
              {formData.dailyTasks.map((task, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Task ${index + 1}`}
                    value={task.task}
                    onChange={(e) => updateDailyTask(index, e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <IconButton onClick={() => removeDailyTask(index)} disabled={formData.dailyTasks.length === 1}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={addDailyTask} startIcon={<Add />} size="small">
                Add Task
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Nutrition */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Nutrition Guidelines:
              </Typography>
              {formData.nutrition.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Nutrition Item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateNutritionItem(index, e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <IconButton onClick={() => removeNutritionItem(index)} disabled={formData.nutrition.length === 1}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={addNutritionItem} startIcon={<Add />} size="small">
                Add Nutrition Item
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Weekly Plan */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Weekly Training Plan:
              </Typography>
              {formData.weeklyPlan.map((day, dayIndex) => (
                <Accordion key={dayIndex} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">
                      {day.day} ({day.exercises.filter(ex => ex.trim()).length} exercises)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <Box key={exerciseIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          label={`Exercise ${exerciseIndex + 1}`}
                          value={exercise}
                          onChange={(e) => updateExercise(dayIndex, exerciseIndex, e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                        <IconButton 
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                          disabled={day.exercises.length === 1}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                    <Button onClick={() => addExercise(dayIndex)} startIcon={<Add />} size="small">
                      Add Exercise
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            startIcon={<Save />}
            disabled={!formData.memberId || !formData.title || !formData.guidance}
          >
            {editingProgram ? 'Update Program' : 'Create Program'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgramManagement;

