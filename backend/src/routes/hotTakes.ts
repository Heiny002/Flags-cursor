import express from 'express';
import HotTake from '../models/HotTake';
import HotTakeResponse from '../models/HotTakeResponse';
import { auth } from '../middleware/auth';
import User, { IUser } from '../models/User';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface PopulatedAuthor {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
}

interface AuthRequest extends Request {
  user?: IUser;
}

const router = express.Router();

// Get hot takes for the current user
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    console.log('Fetching hot takes for user:', userId);
    console.log('Pagination:', { limit, offset });

    // First, get total count of active hot takes
    const totalCount = await HotTake.countDocuments({ isActive: true });
    console.log('Total active hot takes in database:', totalCount);

    // Get all active hot takes in a single query
    const allHotTakes = await HotTake.find({ 
      isActive: true
    })
    .populate<{ author: PopulatedAuthor }>('author', 'name email')
    .sort({ createdAt: -1 });  // Remove skip and limit to get all hot takes

    console.log('Total active hot takes found:', allHotTakes.length);
    console.log('Hot takes by author:');
    const authorCounts = new Map();
    allHotTakes.forEach(ht => {
      const authorId = ht.author?._id?.toString() || 'unknown';
      authorCounts.set(authorId, (authorCounts.get(authorId) || 0) + 1);
    });
    console.log('Author distribution:', Object.fromEntries(authorCounts));

    // Get user's responses
    const userResponses = await HotTakeResponse.find({
      userId: new mongoose.Types.ObjectId(userId)
    });
    console.log('User responses found:', userResponses.length);

    // Create maps for efficient lookup
    const userResponsesMap = new Map(userResponses.map(r => [r.hotTakeId.toString(), true]));
    const userHotTakesMap = new Map(allHotTakes
      .filter(ht => ht.author?._id?.toString() === userId.toString())
      .map(ht => [ht._id.toString(), true]));

    console.log('Hot takes authored by user:', userHotTakesMap.size);
    console.log('Hot takes responded to by user:', userResponsesMap.size);

    // Format and filter the hot takes
    const formattedHotTakes = allHotTakes
      .filter(hotTake => {
        const isAuthoredByUser = userHotTakesMap.has(hotTake._id.toString());
        const hasUserResponse = userResponsesMap.has(hotTake._id.toString());
        
        if (isAuthoredByUser) {
          console.log('Filtering out authored hot take:', {
            id: hotTake._id,
            text: hotTake.text.substring(0, 50),
            author: hotTake.author?._id?.toString()
          });
          return false;
        }
        
        if (hasUserResponse) {
          console.log('Filtering out responded hot take:', {
            id: hotTake._id,
            text: hotTake.text.substring(0, 50),
            author: hotTake.author?._id?.toString()
          });
          return false;
        }
        
        return true;
      })
      .map(hotTake => {
        const formatted = {
          _id: hotTake._id,
          text: hotTake.text,
          categories: hotTake.categories?.length > 0 ? hotTake.categories : ['No Category'],
          createdAt: hotTake.createdAt,
          authorName: hotTake.author?.name || 'Anonymous',
          isInitial: hotTake.isInitial || false,
          isActive: true,
          responses: hotTake.responses?.length || 0,
          author: {
            id: hotTake.author?._id?.toString() || 'anonymous',
            name: hotTake.author?.name || 'Anonymous',
            email: hotTake.author?.email || 'anonymous@example.com'
          },
          hasResponded: false,
          isAuthor: false,
          userResponse: null
        };
        console.log('Formatting hot take:', {
          id: formatted._id,
          text: formatted.text.substring(0, 50),
          authorName: formatted.authorName,
          authorId: formatted.author.id
        });
        return formatted;
      });

    // Sort hot takes: initial hot takes first, then by creation date
    const sortedHotTakes = formattedHotTakes.sort((a, b) => {
      // Put initial hot takes first
      if (a.isInitial && !b.isInitial) return -1;
      if (!a.isInitial && b.isInitial) return 1;
      
      // Then sort by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    console.log('Hot takes after filtering and sorting:', sortedHotTakes.length);
    console.log('Initial hot takes count:', sortedHotTakes.filter(ht => ht.isInitial).length);
    console.log('Non-initial hot takes count:', sortedHotTakes.filter(ht => !ht.isInitial).length);
    console.log('Sample of hot takes being returned:', sortedHotTakes.slice(0, 3).map(ht => ({
      id: ht._id,
      text: ht.text.substring(0, 50),
      authorName: ht.authorName,
      isInitial: ht.isInitial
    })));

    res.json(sortedHotTakes);
  } catch (error) {
    console.error('Error fetching hot takes:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: 'Error fetching hot takes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new hot take
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { text, categories } = req.body;

    // Check for duplicates
    const normalizedText = text.toLowerCase().trim();
    const existingHotTake = await HotTake.findOne({ 
      text: { $regex: new RegExp(`^${normalizedText}$`, 'i') }
    });

    if (existingHotTake) {
      return res.status(400).json({ 
        error: 'A similar hot take already exists',
        existingHotTake: {
          text: existingHotTake.text,
          categories: existingHotTake.categories,
          createdAt: existingHotTake.createdAt
        }
      });
    }

    const hotTake = new HotTake({
      text,
      categories,
      author: req.user._id,
      isActive: true,
      isInitial: false
    });

    await hotTake.save();
    res.status(201).json(hotTake);
  } catch (error) {
    console.error('Error creating hot take:', error);
    res.status(500).json({ error: 'Error creating hot take' });
  }
});

// Respond to a hot take
router.post('/:id/respond', auth, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { agree } = req.body;
    const userId = req.user._id;
    const hotTakeId = req.params.id;

    const hotTake = await HotTake.findById(hotTakeId);
    if (!hotTake) {
      return res.status(404).json({ error: 'Hot take not found' });
    }

    // Check if user has already responded
    const hasResponded = hotTake.responses.some(response => 
      response.user.toString() === userId.toString()
    );

    if (hasResponded) {
      return res.status(400).json({ error: 'User has already responded to this hot take' });
    }

    // Add response
    hotTake.responses.push({
      user: userId,
      agree,
      timestamp: new Date(),
    });

    await hotTake.save();
    res.json(hotTake);
  } catch (error) {
    console.error('Error responding to hot take:', error);
    res.status(500).json({ error: 'Error responding to hot take' });
  }
});

// Get all hot takes (excluding user's own)
router.get('/all', auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get hot takes that the user hasn't responded to yet
    const hotTakes = await HotTake.aggregate([
      // Match hot takes not authored by the current user
      { $match: { author: { $ne: req.user._id } } },
      
      // Lookup responses for each hot take
      { $lookup: {
        from: 'hottakeresponses',
        let: { hotTakeId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$hotTakeId', '$$hotTakeId'] },
                  { $eq: ['$userId', req.user._id] }
                ]
              }
            }
          }
        ],
        as: 'userResponses'
      }},
      
      // Filter out hot takes that the user has already responded to
      { $match: { userResponses: { $size: 0 } } },
      
      // Populate author information
      { $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorInfo'
      }},
      
      // Unwind the author array
      { $unwind: '$authorInfo' },
      
      // Project the final shape
      { $project: {
        _id: 1,
        text: 1,
        categories: 1,
        createdAt: 1,
        author: {
          name: '$authorInfo.name'
        }
      }},
      
      // Sort by creation date
      { $sort: { createdAt: -1 } },
      
      // Limit results
      { $limit: 50 }
    ]);

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
    const { hotTakeId, userResponse, matchResponse, isDealbreaker } = req.body;
    const userId = req.user?._id;

    console.log('Received hot take response:', {
      hotTakeId,
      userId,
      userResponse,
      matchResponse,
      isDealbreaker
    });

    if (!hotTakeId) {
      console.error('Missing hot take ID');
      return res.status(400).json({ message: 'Hot take ID is required' });
    }

    if (!userId) {
      console.error('Missing user ID');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the hot take
    const hotTakeDoc = await HotTake.findById(hotTakeId);
    if (!hotTakeDoc) {
      console.error('Hot take not found:', hotTakeId);
      return res.status(404).json({ message: 'Hot take not found' });
    }

    // Check if user has already submitted a response
    const existingResponse = await HotTakeResponse.findOne({
      hotTakeId: hotTakeDoc._id,
      userId: userId
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
        hotTakeId: hotTakeDoc._id,
        userId: userId,
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