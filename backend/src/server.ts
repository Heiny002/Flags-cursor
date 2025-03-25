import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import questionRoutes from './routes/questions';
import profileRoutes from './routes/profiles';
import hotTakeRoutes from './routes/hotTakes';
import { initWhitelistedUser } from './utils/initWhitelistedUser';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/hot-takes', hotTakeRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Initialize whitelisted user after successful database connection
    await initWhitelistedUser();
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server from other devices using: http://<your-local-ip>:${PORT}`);
}); 