import express from 'express';
import HotTake from '../models/HotTake';
import { auth } from '../middleware/auth';

const router = express.Router();

// Submit a new hot take
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { text, categories } = req.body;

    // Validate required fields
    if (!text || !categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the hot take
    const hotTake = new HotTake({
      text,
      categories,
      author: req.user._id,
    });

    // Save to database
    const savedHotTake = await hotTake.save();

    // Verify the save by fetching the document
    const verifiedHotTake = await HotTake.findById(savedHotTake._id)
      .populate('author', 'name');

    if (!verifiedHotTake) {
      throw new Error('Failed to verify hot take storage');
    }

    // Return detailed verification response
    res.status(201).json({
      message: 'Hot take submitted and verified successfully',
      hotTake: {
        id: verifiedHotTake._id,
        text: verifiedHotTake.text,
        categories: verifiedHotTake.categories,
        author: verifiedHotTake.author,
        createdAt: verifiedHotTake.createdAt,
        verified: true,
      },
      verification: {
        stored: true,
        timestamp: new Date().toISOString(),
        documentId: verifiedHotTake._id,
      }
    });
  } catch (error) {
    console.error('Error submitting hot take:', error);
    res.status(500).json({ 
      message: 'Error submitting hot take',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all hot takes
router.get('/', auth, async (req, res) => {
  try {
    const hotTakes = await HotTake.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .limit(50);

    res.json(hotTakes);
  } catch (error) {
    console.error('Error fetching hot takes:', error);
    res.status(500).json({ message: 'Error fetching hot takes' });
  }
});

// Get hot takes by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const hotTakes = await HotTake.find({ categories: category })
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .limit(50);

    res.json(hotTakes);
  } catch (error) {
    console.error('Error fetching hot takes by category:', error);
    res.status(500).json({ message: 'Error fetching hot takes by category' });
  }
});

export default router; 