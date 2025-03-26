import express from 'express';
import HotTake from '../models/HotTake';
import HotTakeResponse from '../models/HotTakeResponse';
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

// Get all hot takes (excluding user's own)
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const hotTakes = await HotTake.find({ author: { $ne: req.user._id } })
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .limit(50);

    res.json(hotTakes);
  } catch (error) {
    console.error('Error fetching hot takes:', error);
    res.status(500).json({ message: 'Error fetching hot takes' });
  }
});

// Get user's submitted hot takes with stats
router.get('/my-hot-takes', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userHotTakes = await HotTake.aggregate([
      // Match hot takes by the current user
      { $match: { author: req.user._id } },
      
      // Lookup responses for each hot take
      { $lookup: {
        from: 'hottakeresponses',
        localField: '_id',
        foreignField: 'hotTakeId',
        as: 'responses'
      }},
      
      // Calculate statistics
      { $project: {
        text: 1,
        categories: 1,
        createdAt: 1,
        stats: {
          totalResponses: { $size: '$responses' },
          averagePosition: {
            $cond: {
              if: { $eq: [{ $size: '$responses' }, 0] },
              then: null,
              else: { 
                $avg: {
                  $filter: {
                    input: '$responses.userResponse',
                    as: 'response',
                    cond: { $ne: ['$$response', null] }
                  }
                }
              }
            }
          },
          skipCount: {
            $size: {
              $filter: {
                input: '$responses',
                as: 'response',
                cond: { 
                  $and: [
                    { $eq: ['$$response.userResponse', null] },
                    { $eq: ['$$response.matchResponse', null] }
                  ]
                }
              }
            }
          }
        }
      }},
      
      // Sort by creation date
      { $sort: { createdAt: -1 } }
    ]);

    res.json(userHotTakes);
  } catch (error) {
    console.error('Error fetching user hot takes:', error);
    res.status(500).json({ message: 'Error fetching user hot takes' });
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

// Submit a hot take response
router.post('/responses', auth, async (req, res) => {
  try {
    const { hotTake, userResponse, matchResponse, isDealbreaker } = req.body;
    const userId = req.user?._id;

    console.log('Received hot take response:', {
      hotTake,
      userId,
      userResponse,
      matchResponse,
      isDealbreaker
    });

    if (!hotTake) {
      console.error('Missing hot take ID');
      return res.status(400).json({ message: 'Hot take ID is required' });
    }

    if (!userId) {
      console.error('Missing user ID');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the hot take
    const hotTakeDoc = await HotTake.findById(hotTake);
    if (!hotTakeDoc) {
      console.error('Hot take not found:', hotTake);
      return res.status(404).json({ message: 'Hot take not found' });
    }

    // Check if user has already submitted a response
    const existingResponse = await HotTakeResponse.findOne({
      hotTake: hotTakeDoc._id,
      user: userId
    });

    if (existingResponse) {
      console.log('Updating existing response');
      // Update existing response
      existingResponse.userResponse = userResponse;
      existingResponse.matchResponse = matchResponse;
      existingResponse.isDealbreaker = isDealbreaker;
      await existingResponse.save();
    } else {
      console.log('Creating new response');
      // Create new response
      const response = new HotTakeResponse({
        hotTake: hotTakeDoc._id,
        user: userId,
        userResponse,
        matchResponse,
        isDealbreaker
      });
      await response.save();
    }

    res.status(200).json({ message: 'Response saved successfully' });
  } catch (error) {
    console.error('Error saving hot take response:', error);
    // Send more detailed error information
    res.status(500).json({ 
      message: 'Error saving hot take response',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error && 'errors' in error ? (error as any).errors : undefined
    });
  }
});

export default router; 