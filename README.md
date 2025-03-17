# Dating App with Detailed Profiling

A modern dating application that matches users based on detailed questionnaire responses and personality profiles.

## Features

- User authentication and profile management
- Comprehensive questionnaire system
- Admin interface for managing questions
- Profile matching algorithm
- Mobile-first responsive design

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm run dev
   ```

## Project Structure

```
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 