import express from 'express';
import User from '../models/User';
import Question, { IQuestion } from '../models/Question';
import { auth } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// Get potential matches
router.get('/matches', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const questions = await Question.find({ isActive: true });
    
    // Get all users except current user
    const users = await User.find({ _id: { $ne: currentUser._id } });
    
    // Calculate compatibility scores
    const matches = users.map(user => {
      let totalWeight = 0;
      let weightedScore = 0;
      
      questions.forEach((question: IQuestion) => {
        const currentUserResponse = currentUser.questionnaireResponses.find(
          (r: { questionId: mongoose.Types.ObjectId }) => r.questionId.toString() === question._id.toString()
        );
        const otherUserResponse = user.questionnaireResponses.find(
          (r: { questionId: mongoose.Types.ObjectId }) => r.questionId.toString() === question._id.toString()
        );
        
        if (currentUserResponse && otherUserResponse) {
          const score = calculateQuestionScore(
            currentUserResponse.answer,
            otherUserResponse.answer,
            question.type
          );
          weightedScore += score * question.weight;
          totalWeight += question.weight;
        }
      });
      
      const compatibilityScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
      
      return {
        user: {
          id: user._id,
          name: user.name,
          profile: user.profile,
        },
        compatibilityScore,
      };
    });
    
    // Sort by compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Error finding matches' });
  }
});

// Helper function to calculate score between two answers
function calculateQuestionScore(answer1: any, answer2: any, type: string): number {
  switch (type) {
    case 'number':
      // For numeric answers, calculate how close they are
      const maxDiff = 10; // Assuming scale of 1-10
      const diff = Math.abs(answer1 - answer2);
      return 1 - (diff / maxDiff);
      
    case 'boolean':
      return answer1 === answer2 ? 1 : 0;
      
    case 'multiple-choice':
      return answer1 === answer2 ? 1 : 0;
      
    case 'slider':
      // For slider values, calculate similarity based on position
      const maxDiffSlider = 100; // Assuming 0-100 scale
      const diffSlider = Math.abs(answer1 - answer2);
      return 1 - (diffSlider / maxDiffSlider);
      
    case 'text':
      // For text answers, we could implement more sophisticated matching
      // For now, just return 0.5 as a neutral score
      return 0.5;
      
    default:
      return 0;
  }
}

// Get user's profile completion percentage
router.get('/completion', auth, async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments({ isActive: true });
    const answeredQuestions = req.user.questionnaireResponses.length;
    const completionPercentage = (answeredQuestions / totalQuestions) * 100;
    
    res.json({
      completionPercentage,
      answeredQuestions,
      totalQuestions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating profile completion' });
  }
});

// Get user's responses
router.get('/responses', auth, async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true });
    const responses = questions.map((question: IQuestion) => {
      const response = req.user.questionnaireResponses.find(
        (r: { questionId: mongoose.Types.ObjectId }) => r.questionId.toString() === question._id.toString()
      );
      
      return {
        question: {
          id: question._id,
          text: question.text,
          type: question.type,
          category: question.category,
          options: question.options,
        },
        answer: response ? response.answer : null,
        timestamp: response ? response.timestamp : null,
      };
    });
    
    res.json(responses);
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
    const user = await User.findById(req.user._id).select('hasCompletedInitialQuestionnaire');
    res.json({ hasCompleted: user?.hasCompletedInitialQuestionnaire || false });
  } catch (error) {
    res.status(400).json({ error: 'Error fetching questionnaire status' });
  }
});

export default router; 