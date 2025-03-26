import mongoose from 'mongoose';
import HotTakeResponse from '../models/HotTakeResponse';

export async function resetHotTakeResponses() {
  try {
    // Drop the existing collection
    await mongoose.connection.collection('hottakeresponses').drop();
    console.log('Dropped existing hottakeresponses collection');

    // Recreate the collection with the correct schema
    await HotTakeResponse.createCollection();
    console.log('Recreated hottakeresponses collection with correct schema');

    // Create the unique index
    await HotTakeResponse.collection.createIndex(
      { hotTake: 1, user: 1 },
      { unique: true }
    );
    console.log('Created unique index on hotTake and user fields');

    console.log('Successfully reset HotTakeResponse collection');
  } catch (error) {
    if (error instanceof Error && error.message.includes('ns does not exist')) {
      // Collection doesn't exist, which is fine
      console.log('No existing collection to drop');
    } else {
      console.error('Error resetting HotTakeResponse collection:', error);
    }
  }
} 