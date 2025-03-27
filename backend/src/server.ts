import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initWhitelistedUser } from './utils/initWhitelistedUser';
import { resetHotTakeResponses } from './utils/resetHotTakeResponses';
import authRoutes from './routes/auth';
import hotTakesRoutes from './routes/hotTakes';
import profileRoutes from './routes/profiles';
import HotTakeResponse from './models/HotTakeResponse';

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

// Reset HotTakeResponse collection on server start
async function resetHotTakeResponseCollection() {
  try {
    // Drop the existing collection
    await mongoose.connection.collection('hottakeresponses').drop();
    console.log('Dropped existing hottakeresponses collection');
    
    // The collection will be recreated with the correct schema when the first document is inserted
    console.log('Recreated hottakeresponses collection with correct schema');
    
    // Create unique index on hotTakeId and userId
    await HotTakeResponse.collection.createIndex(
      { hotTakeId: 1, userId: 1 },
      { unique: true }
    );
    console.log('Created unique index on hotTakeId and userId');
    
    console.log('Successfully reset HotTakeResponse collection');
  } catch (error) {
    if (error instanceof Error && error.message.includes('ns does not exist')) {
      console.log('HotTakeResponse collection does not exist yet, skipping reset');
    } else {
      console.error('Error resetting HotTakeResponse collection:', error);
    }
  }
}

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app');
    console.log('Connected to MongoDB');
    
    // Initialize whitelisted user
    await initWhitelistedUser();
    
    // Reset HotTakeResponse collection
    await resetHotTakeResponseCollection();
    
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