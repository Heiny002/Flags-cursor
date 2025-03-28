import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initWhitelistedUser } from './utils/initWhitelistedUser';
import { resetHotTakeResponses } from './utils/resetHotTakeResponses';
import authRoutes from './routes/auth';
import hotTakesRoutes from './routes/hotTakes';
import profileRoutes from './routes/profiles';
import onboardingRoutes from './routes/onboarding';
import adminRoutes from './routes/admin';
import HotTakeResponse from './models/HotTakeResponse';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hot-takes', hotTakesRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flags');
    console.log('Connected to MongoDB');
    
    // Initialize whitelisted user only if it doesn't exist
    await initWhitelistedUser();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the server from other devices using: http://<your-local-ip>:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 