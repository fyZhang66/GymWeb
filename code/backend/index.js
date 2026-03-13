const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const PROGRAMS_FILE = path.join(DATA_DIR, 'programs.json');
const WEIGHT_ENTRIES_FILE = path.join(DATA_DIR, 'weight-entries.json');
const AVAILABLE_SLOTS_FILE = path.join(DATA_DIR, 'available-slots.json');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Helper functions for data management
const readJsonFile = async (filePath, defaultValue = []) => {
  try {
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeJson(filePath, data, { spaces: 2 });
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Initialize data files with sample data
const initializeData = async () => {
  // Initialize users
  const users = await readJsonFile(USERS_FILE, []);
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 'member1',
        email: 'member@gym.com',
        password: '123456789',
        name: 'John Member',
        role: 'member'
      },
      {
        id: 'coach1',
        email: 'coach@gym.com',
        password: '123456789',
        name: 'Coach Sarah',
        role: 'coach'
      }
    ];
    await writeJsonFile(USERS_FILE, defaultUsers);
  }

  // Initialize sessions
  const sessions = await readJsonFile(SESSIONS_FILE, []);
  if (sessions.length === 0) {
    const defaultSessions = [
      {
        id: '1',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        memberId: 'member1',
        memberName: 'John Member',
        coachId: 'coach1',
        status: 'booked',
        notes: 'Upper body strength training'
      },
      {
        id: '2',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00',
        memberId: 'member1',
        memberName: 'John Member',
        coachId: 'coach1',
        status: 'booked',
        notes: 'Cardio and flexibility'
      }
    ];
    await writeJsonFile(SESSIONS_FILE, defaultSessions);
  }

  // Initialize programs
  const programs = await readJsonFile(PROGRAMS_FILE, []);
  if (programs.length === 0) {
    const defaultPrograms = [
      {
        id: '1',
        memberId: 'member1',
        memberName: 'John Member',
        title: 'Beginner Strength Building Program',
        nutrition: [
          'Breakfast: Oatmeal with berries and protein powder',
          'Lunch: Grilled chicken with quinoa and vegetables',
          'Dinner: Salmon with sweet potato and broccoli',
          'Snacks: Greek yogurt with nuts, protein shake'
        ],
        guidance: 'Focus on proper form over heavy weights. Progressive overload is key. Get adequate rest between sessions.',
        weeklyPlan: [
          {
            day: 'Monday',
            exercises: ['Squats 3x8', 'Push-ups 3x10', 'Plank 3x30s']
          },
          {
            day: 'Wednesday',
            exercises: ['Deadlifts 3x6', 'Pull-ups 3x5', 'Lunges 3x10 each leg']
          },
          {
            day: 'Friday',
            exercises: ['Bench press 3x8', 'Rows 3x10', 'Shoulder press 3x8']
          }
        ],
        dailyTasks: [
          { task: 'Drink 8 glasses of water', completed: false },
          { task: 'Get 7-8 hours of sleep', completed: false },
          { task: 'Take daily vitamins', completed: false },
          { task: '10-minute morning stretch', completed: false }
        ],
        createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];
    await writeJsonFile(PROGRAMS_FILE, defaultPrograms);
  }

  // Initialize weight entries
  const weightEntries = await readJsonFile(WEIGHT_ENTRIES_FILE, []);
  if (weightEntries.length === 0) {
    const defaultWeightEntries = [
      {
        id: '1',
        memberId: 'member1',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight: 75.5,
        notes: 'Starting weight'
      },
      {
        id: '2',
        memberId: 'member1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight: 75.2,
        notes: 'Good progress'
      },
      {
        id: '3',
        memberId: 'member1',
        date: new Date().toISOString().split('T')[0],
        weight: 74.8,
        notes: 'Continuing to lose weight'
      }
    ];
    await writeJsonFile(WEIGHT_ENTRIES_FILE, defaultWeightEntries);
  }

  // Initialize available slots (empty by default)
  if (!(await fs.pathExists(AVAILABLE_SLOTS_FILE))) {
    await writeJsonFile(AVAILABLE_SLOTS_FILE, []);
  }
};

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(USERS_FILE, []);
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Sessions endpoints
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await readJsonFile(SESSIONS_FILE, []);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const sessions = await readJsonFile(SESSIONS_FILE, []);
    const newSession = {
      id: Date.now().toString(),
      ...req.body
    };
    sessions.push(newSession);
    await writeJsonFile(SESSIONS_FILE, sessions);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.put('/api/sessions/:id', async (req, res) => {
  try {
    const sessions = await readJsonFile(SESSIONS_FILE, []);
    const sessionIndex = sessions.findIndex(s => s.id === req.params.id);
    
    if (sessionIndex === -1) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...req.body };
    await writeJsonFile(SESSIONS_FILE, sessions);
    res.json(sessions[sessionIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Programs endpoints
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await readJsonFile(PROGRAMS_FILE, []);
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

app.post('/api/programs', async (req, res) => {
  try {
    const programs = await readJsonFile(PROGRAMS_FILE, []);
    const newProgram = {
      id: Date.now().toString(),
      ...req.body
    };
    programs.push(newProgram);
    await writeJsonFile(PROGRAMS_FILE, programs);
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create program' });
  }
});

app.put('/api/programs/:id', async (req, res) => {
  try {
    const programs = await readJsonFile(PROGRAMS_FILE, []);
    const programIndex = programs.findIndex(p => p.id === req.params.id);
    
    if (programIndex === -1) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    programs[programIndex] = { ...programs[programIndex], ...req.body };
    await writeJsonFile(PROGRAMS_FILE, programs);
    res.json(programs[programIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update program' });
  }
});

// Weight entries endpoints
app.get('/api/weight-entries', async (req, res) => {
  try {
    const weightEntries = await readJsonFile(WEIGHT_ENTRIES_FILE, []);
    res.json(weightEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weight entries' });
  }
});

app.post('/api/weight-entries', async (req, res) => {
  try {
    const weightEntries = await readJsonFile(WEIGHT_ENTRIES_FILE, []);
    const newEntry = {
      id: Date.now().toString(),
      ...req.body
    };
    weightEntries.push(newEntry);
    await writeJsonFile(WEIGHT_ENTRIES_FILE, weightEntries);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create weight entry' });
  }
});

// Available slots endpoints
app.get('/api/available-slots', async (req, res) => {
  try {
    const availableSlots = await readJsonFile(AVAILABLE_SLOTS_FILE, []);
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

app.post('/api/available-slots', async (req, res) => {
  try {
    const availableSlots = await readJsonFile(AVAILABLE_SLOTS_FILE, []);
    const newSlot = {
      id: Date.now().toString(),
      ...req.body
    };
    availableSlots.push(newSlot);
    await writeJsonFile(AVAILABLE_SLOTS_FILE, availableSlots);
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create available slot' });
  }
});

app.put('/api/available-slots/:id', async (req, res) => {
  try {
    const availableSlots = await readJsonFile(AVAILABLE_SLOTS_FILE, []);
    const slotIndex = availableSlots.findIndex(s => s.id === req.params.id);
    
    if (slotIndex === -1) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    availableSlots[slotIndex] = { ...availableSlots[slotIndex], ...req.body };
    await writeJsonFile(AVAILABLE_SLOTS_FILE, availableSlots);
    res.json(availableSlots[slotIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

app.delete('/api/available-slots/:id', async (req, res) => {
  try {
    const availableSlots = await readJsonFile(AVAILABLE_SLOTS_FILE, []);
    const slotIndex = availableSlots.findIndex(s => s.id === req.params.id);
    
    if (slotIndex === -1) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    const deletedSlot = availableSlots.splice(slotIndex, 1)[0];
    await writeJsonFile(AVAILABLE_SLOTS_FILE, availableSlots);
    res.json(deletedSlot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

// Book session endpoint
app.post('/api/book-session', async (req, res) => {
  try {
    const { slotId, memberId, memberName } = req.body;
    
    // Get available slots and sessions
    const availableSlots = await readJsonFile(AVAILABLE_SLOTS_FILE, []);
    const sessions = await readJsonFile(SESSIONS_FILE, []);
    
    // Find the slot
    const slotIndex = availableSlots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    const slot = availableSlots[slotIndex];
    if (slot.isBooked) {
      return res.status(400).json({ error: 'Slot already booked' });
    }
    
    // Mark slot as booked
    availableSlots[slotIndex].isBooked = true;
    await writeJsonFile(AVAILABLE_SLOTS_FILE, availableSlots);
    
    // Create session
    const newSession = {
      id: Date.now().toString(),
      date: slot.date,
      time: slot.time,
      memberId,
      memberName,
      coachId: 'coach1',
      status: 'booked',
      notes: 'Personal Training Session'
    };
    
    sessions.push(newSession);
    await writeJsonFile(SESSIONS_FILE, sessions);
    
    res.status(201).json({ session: newSession, slot: availableSlots[slotIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book session' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gym Web API is running' });
});

// Start server
const startServer = async () => {
  try {
    await initializeData();
    app.listen(PORT, () => {
      console.log(`🏋️ Gym Web API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📁 Data directory: ${DATA_DIR}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


