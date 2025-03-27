import express from 'express';
import { auth } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get potential matches
router.get('/matches', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get all users except current user
    const users = await User.find({ _id: { $ne: req.user._id } });
    
    // For now, return all users as potential matches
    const matches = users.map(user => ({
      user: {
        id: user._id,
        name: user.name,
        sex: user.sex,
        location: user.location,
        interestedIn: user.interestedIn,
        hotTake: user.hotTake,
        importantCategories: user.importantCategories,
      },
      compatibilityScore: 0, // Placeholder since we're not calculating compatibility anymore
    }));
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Error finding matches' });
  }
});

// Get user's profile completion percentage
router.get('/completion', auth, async (req, res) => {
  try {
    res.json({
      completionPercentage: 100,
      answeredQuestions: 0,
      totalQuestions: 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating profile completion' });
  }
});

// Get user's responses
router.get('/responses', auth, async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching responses' });
  }
});

// Handle initial questionnaire submission
router.post('/initial-questionnaire', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, sex, location, interestedIn, hotTake, importantCategories } = req.body;

    // Validate required fields
    if (!name || !sex || !location || !interestedIn || !importantCategories) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        sex,
        location,
        interestedIn,
        hotTake,
        importantCategories,
        hasCompletedInitialQuestionnaire: true
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Questionnaire completed successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        hasCompletedInitialQuestionnaire: updatedUser.hasCompletedInitialQuestionnaire
      }
    });
  } catch (error) {
    console.error('Error saving questionnaire:', error);
    res.status(500).json({ message: 'Error saving questionnaire data' });
  }
});

// Get user's questionnaire completion status
router.get('/questionnaire-status', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user._id).select('hasCompletedInitialQuestionnaire');
    res.json({ hasCompleted: user?.hasCompletedInitialQuestionnaire || false });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching questionnaire status' });
  }
});

export default router; 