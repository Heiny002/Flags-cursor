import mongoose from 'mongoose';
import HotTakeResponse from '../models/HotTakeResponse';

/**
 * CRITICAL: This utility resets the HotTakeResponse collection
 * This should only be called during server startup or when explicitly needed
 * as it will delete all existing responses
 */
export async function resetHotTakeResponses() {
  try {
    // Drop the existing collection to ensure a clean slate
    await mongoose.connection.collection('hottakeresponses').drop();
    console.log('Dropped existing hottakeresponses collection');

    // Recreate the collection with the correct schema
    // CRITICAL: This ensures the collection has the proper structure and indexes
    await HotTakeResponse.createCollection();
    console.log('Recreated hottakeresponses collection with correct schema');

    // Create the unique index on hotTake and user fields
    // CRITICAL: This index ensures one response per user per hot take
    await HotTakeResponse.collection.createIndex(
      { hotTake: 1, user: 1 },
      { unique: true }
    );
    console.log('Created unique index on hotTake and user fields');

    console.log('Successfully reset HotTakeResponse collection');
  } catch (error) {
    // If the collection doesn't exist, that's fine - we'll create it
    if ((error as any).code === 26) {
      console.log('Collection did not exist, creating new one');
      await HotTakeResponse.createCollection();
      await HotTakeResponse.collection.createIndex(
        { hotTake: 1, user: 1 },
        { unique: true }
      );
    } else {
      console.error('Error resetting HotTakeResponse collection:', error);
      throw error;
    }
  }
} 