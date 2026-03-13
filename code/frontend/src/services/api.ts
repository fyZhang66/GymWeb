import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'coach';
}

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

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },
};

// Sessions API
export const sessionsAPI = {
  getAll: async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  create: async (session: Omit<Session, 'id'>): Promise<Session> => {
    const response = await api.post('/sessions', session);
    return response.data;
  },

  update: async (id: string, updates: Partial<Session>): Promise<Session> => {
    const response = await api.put(`/sessions/${id}`, updates);
    return response.data;
  },

  bookSession: async (slotId: string, memberId: string, memberName: string): Promise<{ session: Session; slot: AvailableSlot }> => {
    const response = await api.post('/book-session', { slotId, memberId, memberName });
    return response.data;
  },
};

// Programs API
export const programsAPI = {
  getAll: async (): Promise<TrainingProgram[]> => {
    const response = await api.get('/programs');
    return response.data;
  },

  create: async (program: Omit<TrainingProgram, 'id'>): Promise<TrainingProgram> => {
    const response = await api.post('/programs', program);
    return response.data;
  },

  update: async (id: string, updates: Partial<TrainingProgram>): Promise<TrainingProgram> => {
    const response = await api.put(`/programs/${id}`, updates);
    return response.data;
  },
};

// Weight Entries API
export const weightEntriesAPI = {
  getAll: async (): Promise<WeightEntry[]> => {
    const response = await api.get('/weight-entries');
    return response.data;
  },

  create: async (entry: Omit<WeightEntry, 'id'>): Promise<WeightEntry> => {
    const response = await api.post('/weight-entries', entry);
    return response.data;
  },
};

// Available Slots API
export const availableSlotsAPI = {
  getAll: async (): Promise<AvailableSlot[]> => {
    const response = await api.get('/available-slots');
    return response.data;
  },

  create: async (slot: Omit<AvailableSlot, 'id'>): Promise<AvailableSlot> => {
    const response = await api.post('/available-slots', slot);
    return response.data;
  },

  update: async (id: string, updates: Partial<AvailableSlot>): Promise<AvailableSlot> => {
    const response = await api.put(`/available-slots/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/available-slots/${id}`);
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;




