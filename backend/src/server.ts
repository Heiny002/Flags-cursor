import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initWhitelistedUser } from './utils/initWhitelistedUser';
import { resetHotTakeResponses } from './utils/resetHotTakeResponses';
import authRoutes from './routes/auth';
import hotTakesRoutes from './routes/hotTakes';
import profileRoutes from './routes/profiles';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hot-takes', hotTakesRoutes);
app.use('/api/profiles', profileRoutes);

// CRITICAL: Server startup sequence
// 1. Connect to MongoDB
// 2. Initialize whitelisted user
// 3. Reset HotTakeResponse collection
// 4. Start the server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Initialize whitelisted user for testing
    // CRITICAL: This user is used for testing and development
    try {
      await initWhitelistedUser();
      console.log('Whitelisted user recreated');
    } catch (error) {
      // If user already exists, that's fine
      console.log('Whitelisted user already exists');
    }

    // Reset HotTakeResponse collection
    // CRITICAL: This ensures the collection has the correct schema and indexes
    await resetHotTakeResponses();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the server from other devices using: http://<your-local-ip>:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 