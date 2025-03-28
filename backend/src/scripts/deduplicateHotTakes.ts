import mongoose from 'mongoose';
import HotTake from '../models/HotTake';
import dotenv from 'dotenv';

dotenv.config();

async function deduplicateHotTakes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flags');
    console.log('Connected to MongoDB');

    // Get all hot takes
    const allHotTakes = await HotTake.find({});
    console.log(`Found ${allHotTakes.length} total hot takes`);

    // Create a map to track unique texts
    const uniqueTexts = new Map<string, mongoose.Types.ObjectId>();
    const duplicates: mongoose.Types.ObjectId[] = [];

    // Find duplicates
    allHotTakes.forEach(hotTake => {
      const normalizedText = hotTake.text.toLowerCase().trim();
      if (uniqueTexts.has(normalizedText)) {
        // Keep the older hot take and mark the newer one for deletion
        const existingId = uniqueTexts.get(normalizedText)!;
        const existingHotTake = allHotTakes.find(ht => ht._id.equals(existingId))!;
        
        if (new Date(hotTake.createdAt) < new Date(existingHotTake.createdAt)) {
          // If current hot take is older, keep it instead
          duplicates.push(existingId);
          uniqueTexts.set(normalizedText, hotTake._id);
        } else {
          duplicates.push(hotTake._id);
        }
      } else {
        uniqueTexts.set(normalizedText, hotTake._id);
      }
    });

    console.log(`Found ${duplicates.length} duplicate hot takes`);

    // Delete duplicates
    if (duplicates.length > 0) {
      await HotTake.deleteMany({ _id: { $in: duplicates } });
      console.log('Successfully deleted duplicate hot takes');
    }

    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error deduplicating hot takes:', error);
    process.exit(1);
  }
}

// Run the deduplication
deduplicateHotTakes(); 