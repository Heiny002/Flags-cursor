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
    console.log('Fetching hot takes for user:', userId);

    // First, get all hot takes without filtering to see what's in the database
    const allHotTakes = await HotTake.find({ isActive: true })
      .populate<{ author: PopulatedAuthor }>('author', 'name email');
    console.log('All active hot takes in database:', allHotTakes.length);
    
    // Look for Monica's older hot takes regardless of active status
    const monicasOldHotTakes = await HotTake.find({
      $or: [
        { text: "Elon Musk is a fuck" },
        { text: "Men shouldn't pay for everything" }
      ]
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    console.log('Monica\'s older hot takes (all statuses):', monicasOldHotTakes.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.author ? {
        id: ht.author._id,
        name: ht.author.name,
        email: ht.author.email
      } : 'No author',
      isActive: ht.isActive,
      responses: ht.responses.length,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial
    })));

    // Also look for any hot takes by Monica's user ID
    const monicasUser = await User.findOne({ 
      $or: [
        { name: 'Monica Schroeder' },
        { email: 'monica.schroeder@example.com' }
      ]
    });

    if (monicasUser) {
      const monicasHotTakesByUserId = await HotTake.find({
        author: monicasUser._id
      }).populate<{ author: PopulatedAuthor }>('author', 'name email');

      console.log('All hot takes by Monica\'s user ID:', monicasHotTakesByUserId.map(ht => ({
        id: ht._id,
        text: ht.text,
        author: ht.author ? {
          id: ht.author._id,
          name: ht.author.name,
          email: ht.author.email
        } : 'No author',
        isActive: ht.isActive,
        responses: ht.responses.length,
        createdAt: ht.createdAt,
        isInitial: ht.isInitial
      })));
    }
    
    // Log all hot takes with their author information
    console.log('All hot takes with author info:', allHotTakes.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.author ? {
        id: ht.author._id,
        name: ht.author.name,
        email: ht.author.email
      } : 'No author',
      isActive: ht.isActive,
      responses: ht.responses.length,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial
    })));
    
    // Log Monica's hot takes specifically
    const monicasHotTakes = allHotTakes.filter(ht => 
      ht.author && 
      (ht.author.name === 'Monica Schroeder' || 
       ht.author.email === 'monica.schroeder@example.com')
    );
    console.log('Monica\'s hot takes:', monicasHotTakes.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.author ? {
        id: ht.author._id,
        name: ht.author.name,
        email: ht.author.email
      } : 'No author',
      isActive: ht.isActive,
      responses: ht.responses.length,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial
    })));

    // Get all active hot takes (both regular and initial)
    const mainHotTakes = await HotTake.find({ 
      isActive: true
    })
    .populate<{ author: PopulatedAuthor }>('author', 'name email')
    .sort({ createdAt: -1 });

    // Get Monica's hot takes to ensure they're included
    if (monicasUser) {
      // Get ALL of Monica's hot takes, regardless of active status
      const monicasHotTakes = await HotTake.find({
        author: monicasUser._id
      }).populate<{ author: PopulatedAuthor }>('author', 'name email');

      console.log('Found Monica\'s hot takes:', monicasHotTakes.length);
      console.log('Monica\'s hot takes details:', monicasHotTakes.map(ht => ({
        id: ht._id,
        text: ht.text,
        isActive: ht.isActive,
        createdAt: ht.createdAt
      })));

      // Create a map of existing hot take IDs
      const existingHotTakeIds = new Set(mainHotTakes.map(ht => ht._id.toString()));
      
      // Add any of Monica's hot takes that aren't already in mainHotTakes
      monicasHotTakes.forEach(hotTake => {
        if (!existingHotTakeIds.has(hotTake._id.toString())) {
          console.log('Adding Monica\'s hot take to mainHotTakes:', hotTake.text);
          mainHotTakes.push(hotTake);
        }
      });
    }

    // Get user's hot takes (both initial and regular)
    const userHotTakes = await HotTake.find({
      author: new mongoose.Types.ObjectId(userId)
    });

    // Get user's responses
    const userResponses = await HotTakeResponse.find({
      userId: new mongoose.Types.ObjectId(userId)
    });

    // Create maps for efficient lookup
    const userHotTakesMap = new Map(userHotTakes.map(ht => [ht._id.toString(), true]));
    const userResponsesMap = new Map(userResponses.map(r => [r.hotTakeId.toString(), true]));

    // Format the hot takes
    const formattedHotTakes = mainHotTakes
      .filter(hotTake => {
        // Filter out hot takes the user has authored
        if (userHotTakesMap.has(hotTake._id.toString())) {
          return false;
        }
        // Filter out hot takes the user has responded to
        if (userResponsesMap.has(hotTake._id.toString())) {
          return false;
        }
        return true;
      })
      .map(hotTake => ({
        _id: hotTake._id,
        text: hotTake.text,
        categories: hotTake.categories?.length > 0 ? hotTake.categories : ['No Category'],
        createdAt: hotTake.createdAt,
        authorName: hotTake.author?.name || 'Anonymous',
        isInitial: hotTake.isInitial || false,
        isActive: true,
        responses: 0,
        author: {
          id: hotTake.author?._id || 'anonymous',
          name: hotTake.author?.name || 'Anonymous',
          email: hotTake.author?.email || 'anonymous@example.com'
        },
        hasResponded: false,
        isAuthor: false,
        userResponse: null
      }));

    console.log('Total hot takes in mainHotTakes:', mainHotTakes.length);
    console.log('Found hot takes after filtering:', formattedHotTakes.length);
    console.log('Hot takes details:', formattedHotTakes.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.authorName,
      isActive: true,
      responses: ht.responses || 0,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial,
      categories: ht.categories || ['No Category']
    })));

    res.json(formattedHotTakes);
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

    const { text, categories, isInitial } = req.body;
    const userId = req.user._id;

    console.log('Creating hot take with data:', {
      text,
      categories,
      isInitial,
      userId,
    });

    // Validate required fields
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Create the hot take with proper error handling
    const hotTake = new HotTake({
      text: text.trim(),
      categories: Array.isArray(categories) ? categories : ['No Category'],
      author: userId,
      isInitial: Boolean(isInitial),
      isActive: true,
    });

    // Log the hot take before saving
    console.log('Creating hot take:', {
      text: hotTake.text,
      categories: hotTake.categories,
      author: userId,
      isInitial: hotTake.isInitial,
      isActive: hotTake.isActive
    });

    // Validate the document before saving
    const validationError = hotTake.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({ 
        error: 'Validation error',
        details: validationError.errors 
      });
    }

    // Save the hot take
    const savedHotTake = await hotTake.save();
    
    // Populate the author information after saving
    const populatedHotTake = await HotTake.findById(savedHotTake._id)
      .populate<{ author: PopulatedAuthor }>('author', 'name email');
    
    if (!populatedHotTake) {
      console.error('Failed to populate hot take after saving');
      return res.status(500).json({ error: 'Failed to save hot take' });
    }
    
    console.log('Hot take saved successfully:', {
      id: populatedHotTake._id,
      text: populatedHotTake.text,
      author: populatedHotTake.author ? {
        id: populatedHotTake.author._id,
        name: populatedHotTake.author.name,
        email: populatedHotTake.author.email
      } : 'No author',
      isActive: populatedHotTake.isActive,
      isInitial: populatedHotTake.isInitial
    });

    res.status(201).json(populatedHotTake);
  } catch (error) {
    console.error('Error creating hot take:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    res.status(500).json({ 
      error: 'Error creating hot take',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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

// Debug endpoint to investigate Monica's hot takes
router.get('/debug-monica', auth, async (req: Request, res: Response) => {
  try {
    // Find Monica's user account
    const monicasUser = await User.findOne({ 
      $or: [
        { name: 'Monica Schroeder' },
        { email: 'monica.schroeder@example.com' }
      ]
    });

    console.log('Monica\'s user account:', monicasUser ? {
      id: monicasUser._id,
      name: monicasUser.name,
      email: monicasUser.email
    } : 'Not found');

    if (!monicasUser) {
      return res.status(404).json({ error: 'Monica\'s account not found' });
    }

    // Find all hot takes by Monica's user ID
    const monicasHotTakes = await HotTake.find({
      author: monicasUser._id
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    console.log('All hot takes by Monica:', monicasHotTakes.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.author ? {
        id: ht.author._id,
        name: ht.author.name,
        email: ht.author.email
      } : 'No author',
      isActive: ht.isActive,
      responses: ht.responses.length,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial
    })));

    // Find specific hot takes by text
    const specificHotTakes = await HotTake.find({
      $or: [
        { text: "Elon Musk is a fuck" },
        { text: "Men shouldn't pay for everything" }
      ]
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    console.log('Specific hot takes:', specificHotTakes.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.author ? {
        id: ht.author._id,
        name: ht.author.name,
        email: ht.author.email
      } : 'No author',
      isActive: ht.isActive,
      responses: ht.responses.length,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial
    })));

    // Find all hot takes with Monica's name as author
    const hotTakesWithMonicasName = await HotTake.find({
      'author.name': 'Monica Schroeder'
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    console.log('Hot takes with Monica\'s name:', hotTakesWithMonicasName.map(ht => ({
      id: ht._id,
      text: ht.text,
      author: ht.author ? {
        id: ht.author._id,
        name: ht.author.name,
        email: ht.author.email
      } : 'No author',
      isActive: ht.isActive,
      responses: ht.responses.length,
      createdAt: ht.createdAt,
      isInitial: ht.isInitial
    })));

    res.json({
      monicasUser: monicasUser ? {
        id: monicasUser._id,
        name: monicasUser.name,
        email: monicasUser.email
      } : null,
      monicasHotTakes: monicasHotTakes.map(ht => ({
        id: ht._id,
        text: ht.text,
        author: ht.author ? {
          id: ht.author._id,
          name: ht.author.name,
          email: ht.author.email
        } : 'No author',
        isActive: ht.isActive,
        responses: ht.responses.length,
        createdAt: ht.createdAt,
        isInitial: ht.isInitial
      })),
      specificHotTakes: specificHotTakes.map(ht => ({
        id: ht._id,
        text: ht.text,
        author: ht.author ? {
          id: ht.author._id,
          name: ht.author.name,
          email: ht.author.email
        } : 'No author',
        isActive: ht.isActive,
        responses: ht.responses.length,
        createdAt: ht.createdAt,
        isInitial: ht.isInitial
      })),
      hotTakesWithMonicasName: hotTakesWithMonicasName.map(ht => ({
        id: ht._id,
        text: ht.text,
        author: ht.author ? {
          id: ht.author._id,
          name: ht.author.name,
          email: ht.author.email
        } : 'No author',
        isActive: ht.isActive,
        responses: ht.responses.length,
        createdAt: ht.createdAt,
        isInitial: ht.isInitial
      }))
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ 
      error: 'Error investigating Monica\'s hot takes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 