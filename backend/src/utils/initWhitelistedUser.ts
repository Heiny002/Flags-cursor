import User from '../models/User';
import HotTake from '../models/HotTake';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export const initWhitelistedUser = async () => {
  try {
    const whitelistedEmail = 'jimheiniger@gmail.com';
    const whitelistedPassword = 'Fl4gs_App!';
    const whitelistedName = 'Jim Heiniger';

    // Delete existing whitelisted user if exists
    await User.deleteOne({ email: whitelistedEmail });
    
    // Create new whitelisted user with direct password (will be hashed by pre-save hook)
    const user = new User({
      email: whitelistedEmail,
      password: whitelistedPassword, // This will be hashed by the pre-save hook
      name: whitelistedName,
      hasCompletedInitialQuestionnaire: true
    });

    await user.save();
    console.log('Whitelisted user recreated');

    // Create a sample hot take for the user
    const existingHotTake = await HotTake.findOne({ text: 'Chicago is the greatest city in the US' });
    if (!existingHotTake) {
      const sampleHotTake = new HotTake({
        text: 'Chicago is the greatest city in the US',
        categories: ['Travel & Adventure'],
        author: user._id,
      });
      await sampleHotTake.save();
      console.log('Sample hot take created');
    }

    // Verify the password works
    const verifyUser = await User.findOne({ email: whitelistedEmail });
    if (verifyUser) {
      const isPasswordValid = await verifyUser.comparePassword(whitelistedPassword);
      console.log('Password verification:', isPasswordValid ? 'successful' : 'failed');
    }
  } catch (error) {
    console.error('Error initializing whitelisted user:', error);
  }
}; 