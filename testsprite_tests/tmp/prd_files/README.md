# 🏋️ FitnessPro - Gym Web Application

A comprehensive web application for gym management that enables members to book training sessions, track their progress, and follow personalized training programs while providing coaches with tools to manage their clients and schedules.

## 🌟 Features

### For Members
- 📅 **Session Booking**: Book training sessions with available coaches
- 📊 **Personal Dashboard**: View upcoming sessions and training progress
- 🏃 **Training Programs**: Access personalized workout plans, nutrition guides, and daily tasks
- ⚖️ **Weight Tracking**: Record and visualize weight progress with interactive charts
- 🔔 **Session Reminders**: Visual indicators for upcoming training sessions

### For Coaches
- 👥 **Member Management**: Overview of all members and their progress
- 📋 **Program Creation**: Create and edit comprehensive training programs
- 🕐 **Availability Management**: Set available time slots for booking
- 📈 **Progress Tracking**: Monitor member weight progress and session completion

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern, responsive design
- **React Router** for client-side routing
- **Recharts** for data visualization
- **Day.js** for date handling
- **Vite** for fast development

### Backend
- **Node.js** with Express
- **Local JSON storage** for data persistence
- **RESTful API** design
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone and Setup
```bash
# Navigate to the project directory
cd gym-web/code
```

### 2. Start the Backend
```bash
# Go to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```
The backend will run on `http://localhost:3001`

### 3. Start the Frontend
```bash
# In a new terminal, go to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will run on `http://localhost:5173`

### 4. Access the Application
Open your browser and go to `http://localhost:5173`

## 🔐 Test Accounts

### Member Account
- **Email:** member@gym.com
- **Password:** 123456789
- **Access:** Session booking, training programs, weight tracking

### Coach Account
- **Email:** coach@gym.com  
- **Password:** 123456789
- **Access:** Member management, program creation, availability management

## 📱 Application Screenshots

### Member Dashboard
- Overview of upcoming sessions with countdown timers
- Daily task progress tracking
- Current training program summary
- Weight progress visualization

### Session Booking
- Calendar view of available time slots
- Easy booking with confirmation dialogs
- View of upcoming booked sessions

### Training Programs
- Comprehensive program viewer with tabs for:
  - Daily tasks with completion tracking
  - Weekly workout schedules
  - Nutrition guidelines

### Weight Tracking
- Interactive weight progress charts
- Historical weight data table
- Easy weight entry with date selection

### Coach Dashboard
- Member progress overview
- Session management
- Program assignment tracking

## 🏗️ Project Structure

```
gym-web/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts for state management
│   │   ├── pages/          # Application pages/routes
│   │   ├── services/       # API service layer
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js Express backend
│   ├── data/               # JSON data storage (auto-generated)
│   ├── index.js            # Main server file
│   ├── package.json
│   └── README.md
└── README.md               # This file
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create session
- `POST /api/book-session` - Book a session

### Training Programs
- `GET /api/programs` - Get all programs
- `POST /api/programs` - Create program
- `PUT /api/programs/:id` - Update program

### Weight Tracking
- `GET /api/weight-entries` - Get weight entries
- `POST /api/weight-entries` - Add weight entry

### Availability
- `GET /api/available-slots` - Get available slots
- `POST /api/available-slots` - Add available slot
- `DELETE /api/available-slots/:id` - Remove slot

## 💾 Data Storage

All data is stored locally in JSON files within the `backend/data/` directory:
- User accounts and authentication
- Training sessions and bookings
- Training programs and progress
- Weight tracking entries
- Coach availability slots

Sample data is automatically created on first run.

## 🎨 Design Features

- **Modern Material Design** with custom theming
- **Fully responsive** layout for desktop and mobile
- **Intuitive navigation** with role-based menus
- **Interactive charts** for progress visualization
- **Smooth animations** and transitions
- **Accessibility compliant** components

## 🧪 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm start           # Start server
npm run dev         # Start with auto-reload (if nodemon installed)
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is for demonstration purposes. See the license file for details.

## 🤝 Contributing

This is a sample application built according to the PRD specifications. For modifications or enhancements, please refer to the original requirements document.

---

**Built with ❤️ for fitness enthusiasts and personal trainers**




