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
    // Try to get existing content
    let content = await OnboardingContent.findOne();

    // If no content exists, create default content
    if (!content) {
      content = await OnboardingContent.create(defaultContent);
    } else {
      // Update existing content to ensure it has the latest text
      content = await OnboardingContent.findOneAndUpdate(
        {},
        { 
          ...defaultContent,
          lastUpdated: new Date(),
        },
        { new: true }
      );
    }

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

export default router; 