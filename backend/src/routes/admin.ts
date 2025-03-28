import express from 'express';
import { auth } from '../middleware/auth';
import HotTake from '../models/HotTake';
import User from '../models/User';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req: Request, res: Response, next: Function) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(req.user._id);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all hot takes (admin only)
router.get('/hot-takes', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const hotTakes = await HotTake.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(hotTakes);
  } catch (error) {
    console.error('Error fetching hot takes:', error);
    res.status(500).json({ error: 'Error fetching hot takes' });
  }
});

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

interface HotTakeUpdate {
  text?: string;
  categories?: string[];
  isActive?: boolean;
}

interface UserUpdate {
  name?: string;
  email?: string;
  profile?: {
    age?: number;
    gender?: string;
    location?: string;
  };
}

// Update a hot take (admin only)
router.patch('/hot-takes/:id', auth, isAdmin, async (req: Request<{ id: string }, {}, HotTakeUpdate>, res: Response) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['text', 'categories', 'isActive'] as const;
    const isValidOperation = updates.every(update => allowedUpdates.includes(update as typeof allowedUpdates[number]));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const hotTake = await HotTake.findById(req.params.id);
    if (!hotTake) {
      return res.status(404).json({ error: 'Hot take not found' });
    }

    if (req.body.text !== undefined) hotTake.text = req.body.text;
    if (req.body.categories !== undefined) hotTake.categories = req.body.categories;
    if (req.body.isActive !== undefined) hotTake.isActive = req.body.isActive;

    await hotTake.save();
    res.json(hotTake);
  } catch (error) {
    console.error('Error updating hot take:', error);
    res.status(500).json({ error: 'Error updating hot take' });
  }
});

// Update a user (admin only)
router.patch('/users/:id', auth, isAdmin, async (req: Request<{ id: string }, {}, UserUpdate>, res: Response) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'profile'] as const;
    const isValidOperation = updates.every(update => allowedUpdates.includes(update as typeof allowedUpdates[number]));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.profile !== undefined) {
      user.profile = {
        ...user.profile,
        ...req.body.profile
      };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

export default router; 