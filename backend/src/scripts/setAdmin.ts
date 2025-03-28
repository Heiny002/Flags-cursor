import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function setAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app');
    console.log('Connected to MongoDB');

    const result = await User.updateOne(
      { email: 'jimandmon2025@gmail.com' },
      { $set: { isAdmin: true } }
    );

    console.log('Update result:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setAdminUser(); 