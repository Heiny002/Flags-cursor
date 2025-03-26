import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log('Login attempt:', { email, userFound: !!user });
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'No account found with this email'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password check:', { email, isMatch });
    
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Incorrect password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Log successful login
    console.log('Successful login:', { email, userId: user._id });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        hasCompletedInitialQuestionnaire: user.hasCompletedInitialQuestionnaire
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Error logging in',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'profile'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' });
  }
});

export default router; 