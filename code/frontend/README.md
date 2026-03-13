# Gym Web Frontend

A modern React TypeScript application for gym member and coach management with session booking, training programs, and weight tracking.

## Features

### For Members
- **Dashboard**: Overview of upcoming sessions, training progress, and daily tasks
- **Session Booking**: Book training sessions with the coach
- **Training Programs**: View personalized training plans, nutrition guides, and daily tasks
- **Weight Tracking**: Record and visualize weight progress over time

### For Coaches
- **Coach Dashboard**: Manage member bookings and view progress overview
- **Program Management**: Create and edit training programs for members
- **Availability Management**: Set available time slots for booking

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for modern, responsive design
- **React Router** for navigation
- **Recharts** for weight progress visualization
- **Day.js** for date handling
- **Axios** for API communication
- **Vite** for fast development and building

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser to:** http://localhost:5173

## Test Accounts

### Member Account
- **Email:** member@gym.com
- **Password:** 123456789

### Coach Account
- **Email:** coach@gym.com
- **Password:** 123456789

## Project Structure

```
src/
├── components/
│   └── Layout.tsx          # Main app layout with navigation
├── contexts/
│   ├── AuthContext.tsx     # Authentication context
│   └── DataContext.tsx     # Data management context
├── pages/
│   ├── Login.tsx           # Login page
│   ├── MemberDashboard.tsx # Member overview
│   ├── BookingSessions.tsx # Session booking
│   ├── TrainingPrograms.tsx# Training program viewer
│   ├── WeightTracking.tsx  # Weight tracking
│   ├── CoachDashboard.tsx  # Coach overview
│   ├── ProgramManagement.tsx# Program creation/editing
│   └── ManageAvailability.tsx# Availability management
├── services/
│   └── api.ts              # API service layer
└── App.tsx                 # Main app component
```

## Key Features

### Authentication
- Role-based routing (member/coach)
- Persistent login sessions
- Protected routes

### Responsive Design
- Mobile-friendly interface
- Adaptive navigation
- Modern Material Design

### Real-time Updates
- Local state management
- Optimistic UI updates
- Data persistence

## Development

- Run `npm run dev` for development
- Run `npm run build` for production build
- Run `npm run preview` to preview production build

## Backend Integration

The frontend integrates with the Node.js backend API running on `http://localhost:3001`.

Make sure the backend server is running before using the application.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)