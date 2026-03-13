# Gym Web Backend API

A Node.js/Express REST API for the Gym Web application that handles session booking, training program management, and weight tracking.

## Features

- **Authentication**: Simple login system with hardcoded test accounts
- **Session Management**: Book and manage training sessions
- **Training Programs**: CRUD operations for training programs
- **Weight Tracking**: Record and track body weight progress
- **Available Slots**: Manage coach availability for booking

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Server will run on:** http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/:id` - Update a session
- `POST /api/book-session` - Book a training session

### Training Programs
- `GET /api/programs` - Get all training programs
- `POST /api/programs` - Create a new program
- `PUT /api/programs/:id` - Update a program

### Weight Entries
- `GET /api/weight-entries` - Get all weight entries
- `POST /api/weight-entries` - Add a new weight entry

### Available Slots
- `GET /api/available-slots` - Get all available time slots
- `POST /api/available-slots` - Add a new available slot
- `PUT /api/available-slots/:id` - Update a slot
- `DELETE /api/available-slots/:id` - Remove a slot

### Health Check
- `GET /api/health` - Server health status

## Test Accounts

### Member Account
- **Email:** member@gym.com
- **Password:** 123456789
- **Role:** member

### Coach Account
- **Email:** coach@gym.com
- **Password:** 123456789
- **Role:** coach

## Data Storage

All data is stored locally in JSON files within the `data/` directory:
- `users.json` - User accounts
- `sessions.json` - Training sessions
- `programs.json` - Training programs
- `weight-entries.json` - Weight tracking data
- `available-slots.json` - Available time slots

The server automatically creates sample data on first run.

## CORS Configuration

The API is configured to accept requests from any origin for development purposes.

## Development

- The server runs on port 3001 by default
- Set `PORT` environment variable to change the port
- Data persists between server restarts via JSON files
- No external database required


