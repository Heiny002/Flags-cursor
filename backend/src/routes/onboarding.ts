import express from 'express';
import { auth } from '../middleware/auth';
import OnboardingContent from '../models/OnboardingContent';

const router = express.Router();

const defaultContent = {
  pages: [
    {
      title: 'Welcome to Flags',
      steps: [
        {
          label: 'Create Your First Hot Take',
          description: 'Share your opinion on a topic that matters to you.',
          hasInput: true,
          inputType: 'hotTake',
          inputPlaceholder: 'Try taking and extreme position like, "Blue is the BEST color" instead of "Blue is a GOOD color"\n\nTry to use superlatives like BEST, WORST, ONLY, MOST, NEVER, ALWAYS, etc.\n\nHot Takes should be statements like "Hot dogs are the BEST food" and not personal opinions like "I like hot dogs".\n\nComparing two things is recommended: "Cats are better than Dogs".',
        },
        {
          label: 'How it Works',
          description: 'Share your opinions on various topics, and we\'ll match you with people who share similar views.',
          hasSampleCard: true,
          sampleHotTake: {
            text: "Dogs deserve restaurant access more than children",
            categories: ["Social & Political Views", "Food & Cuisine"],
            authorName: "Riley"
          },
          walkthrough: [
            {
              element: "hot-take",
              description: "At the top of each card is the Hot Take",
              position: {
                bottom: "60%",
                left: "50%"
              }
            },
            {
              element: "category",
              description: "Beneath the Hot Take is the category/categories the Hot Take falls into",
              position: {
                bottom: "40%",
                left: "50%"
              }
            },
            {
              element: "author",
              description: "Below the category is the author of the Hot Take",
              position: {
                bottom: "30%",
                left: "50%"
              }
            },
            {
              element: "flags",
              description: "The 5 flags are options for your response to the Hot Take",
              position: {
                top: "70%",
                left: "50%"
              }
            }
          ]
        },
        {
          label: 'Rate Hot Takes',
          description: 'Rate hot takes to find your matches. The more you rate, the better your matches will be!',
          hasSampleCardBack: true,
          sampleHotTake: {
            text: "Dogs deserve restaurant access more than children",
            categories: ["Social & Political Views", "Food & Cuisine"],
            authorName: "Riley"
          }
        },
        {
          label: 'Getting Started',
          description: 'Complete your profile, share your hot takes, and start connecting with like-minded individuals.',
        },
      ],
    },
  ],
};

// Get onboarding content
router.get('/content', auth, async (req, res) => {
  try {
    // Force update the content with our default values
    const content = await OnboardingContent.findOneAndUpdate(
      {}, // empty filter to match any document
      defaultContent,
      { 
        new: true, // return the updated document
        upsert: true, // create if doesn't exist
      }
    );

    res.json(content);
  } catch (error) {
    console.error('Error fetching onboarding content:', error);
    res.status(500).json({ error: 'Error fetching onboarding content' });
  }
});

// Update onboarding content
router.post('/content', auth, async (req, res) => {
  try {
    const { pages } = req.body;
    const userEmail = req.user?.email;

    // Check if user is admin
    const isAdmin = userEmail === 'JimHeiniger@gmail.com';

    // Update or create the content
    const content = await OnboardingContent.findOneAndUpdate(
      {}, // empty filter to match any document
      { 
        pages,
        lastUpdated: new Date(),
      },
      { 
        new: true, // return the updated document
        upsert: true, // create if doesn't exist
      }
    );

    console.log('Onboarding content updated:', content);
    res.json(content);
  } catch (error) {
    console.error('Error updating onboarding content:', error);
    res.status(500).json({ error: 'Error updating onboarding content' });
  }
});

// Add a new endpoint to check if user can bypass validation
router.get('/can-bypass-validation', auth, async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const isAdmin = userEmail === 'jimheiniger@gmail.com' || userEmail === 'jimheiniger@yahoo.com';
    res.json({ canBypass: isAdmin });
  } catch (error) {
    console.error('Error checking bypass status:', error);
    res.status(500).json({ error: 'Error checking bypass status' });
  }
});

export default router; 