import express from 'express';
import Question from '../models/Question';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all active questions
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true }).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// Get questions by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const questions = await Question.find({
      category: req.params.category,
      isActive: true,
    }).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions by category' });
  }
});

// Admin: Create new question
router.post('/', auth, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: 'Error creating question' });
  }
});

// Admin: Update question
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['text', 'type', 'category', 'options', 'weight', 'isActive', 'order'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    updates.forEach(update => {
      question[update] = req.body[update];
    });

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: 'Error updating question' });
  }
});

// Admin: Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting question' });
  }
});

// Submit questionnaire responses
router.post('/submit', auth, async (req, res) => {
  try {
    const { responses } = req.body;
    const user = req.user;

    // Update user's questionnaire responses
    responses.forEach((response: { questionId: string; answer: any }) => {
      const existingResponseIndex = user.questionnaireResponses.findIndex(
        (r: any) => r.questionId.toString() === response.questionId
      );

      if (existingResponseIndex >= 0) {
        user.questionnaireResponses[existingResponseIndex].answer = response.answer;
        user.questionnaireResponses[existingResponseIndex].timestamp = new Date();
      } else {
        user.questionnaireResponses.push({
          questionId: response.questionId,
          answer: response.answer,
          timestamp: new Date(),
        });
      }
    });

    await user.save();
    res.json({ message: 'Responses saved successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error saving responses' });
  }
});

export default router; 