import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import questionRoutes from './routes/questions';
import profileRoutes from './routes/profiles';
import hotTakeRoutes from './routes/hotTakes';
import { initWhitelistedUser } from './utils/initWhitelistedUser';
import { resetHotTakeResponses } from './utils/resetHotTakeResponses';

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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Initialize whitelisted user
    await initWhitelistedUser();
    
    // Reset HotTakeResponse collection
    await resetHotTakeResponses();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the server from other devices using: http://<your-local-ip>:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 