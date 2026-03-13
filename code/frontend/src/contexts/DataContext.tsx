import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

export interface Session {
  id: string;
  date: string;
  time: string;
  memberId: string;
  memberName: string;
  coachId: string;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  notes?: string;
}

export interface TrainingProgram {
  id: string;
  memberId: string;
  memberName: string;
  title: string;
  nutrition: string[];
  guidance: string;
  weeklyPlan: {
    day: string;
    exercises: string[];
  }[];
  dailyTasks: {
    task: string;
    completed: boolean;
  }[];
  createdDate: string;
}

export interface WeightEntry {
  id: string;
  memberId: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
}

interface DataContextType {
  sessions: Session[];
  programs: TrainingProgram[];
  weightEntries: WeightEntry[];
  availableSlots: AvailableSlot[];
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  addProgram: (program: Omit<TrainingProgram, 'id'>) => void;
  updateProgram: (id: string, updates: Partial<TrainingProgram>) => void;
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  addAvailableSlot: (slot: Omit<AvailableSlot, 'id'>) => void;
  updateAvailableSlot: (id: string, updates: Partial<AvailableSlot>) => void;
  removeAvailableSlot: (id: string) => void;
  bookSession: (slotId: string, memberId: string, memberName: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Sample data
const initialSessions: Session[] = [
  {
    id: '1',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    memberId: 'member1',
    memberName: 'John Member',
    coachId: 'coach1',
    status: 'booked',
    notes: 'Upper body strength training',
  },
  {
    id: '2',
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    time: '14:00',
    memberId: 'member1',
    memberName: 'John Member',
    coachId: 'coach1',
    status: 'booked',
    notes: 'Cardio and flexibility',
  },
];

const initialPrograms: TrainingProgram[] = [
  {
    id: '1',
    memberId: 'member1',
    memberName: 'John Member',
    title: 'Beginner Strength Building Program',
    nutrition: [
      'Breakfast: Oatmeal with berries and protein powder',
      'Lunch: Grilled chicken with quinoa and vegetables',
      'Dinner: Salmon with sweet potato and broccoli',
      'Snacks: Greek yogurt with nuts, protein shake',
    ],
    guidance: 'Focus on proper form over heavy weights. Progressive overload is key. Get adequate rest between sessions.',
    weeklyPlan: [
      {
        day: 'Monday',
        exercises: ['Squats 3x8', 'Push-ups 3x10', 'Plank 3x30s'],
      },
      {
        day: 'Wednesday',
        exercises: ['Deadlifts 3x6', 'Pull-ups 3x5', 'Lunges 3x10 each leg'],
      },
      {
        day: 'Friday',
        exercises: ['Bench press 3x8', 'Rows 3x10', 'Shoulder press 3x8'],
      },
    ],
    dailyTasks: [
      { task: 'Drink 8 glasses of water', completed: false },
      { task: 'Get 7-8 hours of sleep', completed: false },
      { task: 'Take daily vitamins', completed: false },
      { task: '10-minute morning stretch', completed: false },
    ],
    createdDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  },
];

const initialWeightEntries: WeightEntry[] = [
  {
    id: '1',
    memberId: 'member1',
    date: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
    weight: 75.5,
    notes: 'Starting weight',
  },
  {
    id: '2',
    memberId: 'member1',
    date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    weight: 75.2,
    notes: 'Good progress',
  },
  {
    id: '3',
    memberId: 'member1',
    date: dayjs().format('YYYY-MM-DD'),
    weight: 74.8,
    notes: 'Continuing to lose weight',
  },
];

const initialAvailableSlots: AvailableSlot[] = [
  {
    id: 'slot1',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '09:00',
    isBooked: false,
  },
  {
    id: 'slot2',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    isBooked: false,
  },
  {
    id: 'slot3',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '14:00',
    isBooked: false,
  },
  {
    id: 'slot4',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    time: '09:00',
    isBooked: false,
  },
  {
    id: 'slot5',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    time: '11:00',
    isBooked: false,
  },
  {
    id: 'slot6',
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    isBooked: false,
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = localStorage.getItem('gym-app-sessions');
    return stored ? JSON.parse(stored) : initialSessions;
  });

  const [programs, setPrograms] = useState<TrainingProgram[]>(() => {
    const stored = localStorage.getItem('gym-app-programs');
    return stored ? JSON.parse(stored) : initialPrograms;
  });

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    const stored = localStorage.getItem('gym-app-weight-entries');
    return stored ? JSON.parse(stored) : initialWeightEntries;
  });

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>(() => {
    const stored = localStorage.getItem('gym-app-available-slots');
    return stored ? JSON.parse(stored) : initialAvailableSlots;
  });

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('gym-app-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('gym-app-programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('gym-app-weight-entries', JSON.stringify(weightEntries));
  }, [weightEntries]);

  useEffect(() => {
    localStorage.setItem('gym-app-available-slots', JSON.stringify(availableSlots));
  }, [availableSlots]);

  const addSession = (session: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
    };
    setSessions(prev => [...prev, newSession]);
  };

  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...updates } : session
    ));
  };

  const addProgram = (program: Omit<TrainingProgram, 'id'>) => {
    const newProgram: TrainingProgram = {
      ...program,
      id: Date.now().toString(),
    };
    setPrograms(prev => [...prev, newProgram]);
  };

  const updateProgram = (id: string, updates: Partial<TrainingProgram>) => {
    setPrograms(prev => prev.map(program => 
      program.id === id ? { ...program, ...updates } : program
    ));
  };

  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry: WeightEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setWeightEntries(prev => [...prev, newEntry]);
  };

  const addAvailableSlot = (slot: Omit<AvailableSlot, 'id'>) => {
    const newSlot: AvailableSlot = {
      ...slot,
      id: Date.now().toString(),
    };
    setAvailableSlots(prev => [...prev, newSlot]);
  };

  const updateAvailableSlot = (id: string, updates: Partial<AvailableSlot>) => {
    setAvailableSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
  };

  const removeAvailableSlot = (id: string) => {
    setAvailableSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const bookSession = (slotId: string, memberId: string, memberName: string) => {
    const slot = availableSlots.find(s => s.id === slotId);
    if (slot && !slot.isBooked) {
      // Mark slot as booked
      setAvailableSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, isBooked: true } : s
      ));

      // Add session
      addSession({
        date: slot.date,
        time: slot.time,
        memberId,
        memberName,
        coachId: 'coach1',
        status: 'booked',
      });
    }
  };

  const value = {
    sessions,
    programs,
    weightEntries,
    availableSlots,
    addSession,
    updateSession,
    addProgram,
    updateProgram,
    addWeightEntry,
    addAvailableSlot,
    updateAvailableSlot,
    removeAvailableSlot,
    bookSession,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

