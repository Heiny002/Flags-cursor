import User from '../models/User';

export const initWhitelistedUser = async () => {
  try {
    const whitelistedEmail = 'jimheiniger@gmail.com';
    const whitelistedPassword = 'Fl4gs_App!';
    const whitelistedName = 'Jim Heiniger';

    // Check if whitelisted user exists
    const existingUser = await User.findOne({ email: whitelistedEmail });
    
    if (!existingUser) {
      // Create whitelisted user
      const whitelistedUser = new User({
        email: whitelistedEmail,
        password: whitelistedPassword,
        name: whitelistedName,
      });

      await whitelistedUser.save();
      console.log('Whitelisted user created successfully');
    } else {
      console.log('Whitelisted user already exists');
    }
  } catch (error) {
    console.error('Error initializing whitelisted user:', error);
  }
}; 