import mongoose from 'mongoose';
import { IHotTake } from '../models/HotTake';
import HotTake from '../models/HotTake';
import User from '../models/User';
import { mainArray } from './initializeHotTakes';

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flags';

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing hot takes and users
    await HotTake.deleteMany({});
    await User.deleteMany({ email: 'anonymous@example.com' });
    console.log('Cleared existing hot takes and anonymous user');

    // Create anonymous user
    const anonymousUser = await User.create({
      email: 'anonymous@example.com',
      password: 'anonymous', // This will be hashed by the pre-save hook
      name: 'Anonymous',
      hasCompletedInitialQuestionnaire: true
    });
    console.log('Created anonymous user:', anonymousUser._id);

    // Format hot takes to match schema
    const formattedHotTakes = mainArray.map(hotTake => {
      const formatted = {
        text: hotTake.text,
        categories: hotTake.categories,
        author: hotTake.author.name === 'Anonymous' ? anonymousUser._id : hotTake.author.id,
        isActive: hotTake.isActive,
        responses: [],
        createdAt: hotTake.createdAt,
        isInitial: hotTake.isInitial
      };
      console.log('Formatting hot take:', {
        text: formatted.text.substring(0, 50),
        author: formatted.author,
        isAnonymous: hotTake.author.name === 'Anonymous'
      });
      return formatted;
    });

    // Insert all hot takes
    const insertedHotTakes = await HotTake.insertMany(formattedHotTakes);
    console.log(`Successfully inserted ${insertedHotTakes.length} hot takes`);

    // Verify the data
    const totalHotTakes = await HotTake.countDocuments();
    const hotTakesWithAnonymous = await HotTake.countDocuments({ author: anonymousUser._id });
    console.log('Verification:', {
      totalHotTakes,
      hotTakesWithAnonymous,
      anonymousUserId: anonymousUser._id
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization function
initializeDatabase(); 