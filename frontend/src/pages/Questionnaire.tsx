import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Slider,
  LinearProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  _id: string;
  text: string;
  type: 'text' | 'number' | 'boolean' | 'multiple-choice' | 'slider';
  category: string;
  options?: string[];
  weight: number;
}

interface Response {
  questionId: string;
  answer: string | number | boolean;
}

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(response.data);
      setLoading(false);
    } catch {
      setError('Failed to load questions');
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string | number | boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const existingResponseIndex = responses.findIndex(
      r => r.questionId === currentQuestion._id
    );

    if (existingResponseIndex >= 0) {
      const newResponses = [...responses];
      newResponses[existingResponseIndex] = {
        questionId: currentQuestion._id,
        answer,
      };
      setResponses(newResponses);
    } else {
      setResponses([
        ...responses,
        {
          questionId: currentQuestion._id,
          answer,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/questions/submit`,
        { responses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/profile');
    } catch {
      setError('Failed to submit responses');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const currentResponse = responses.find(r => r.questionId === question._id);
    const value = currentResponse?.answer ?? '';

    switch (question.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            value={value}
            onChange={(e) => handleAnswer(Number(e.target.value))}
          />
        );

      case 'boolean':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={value}
              onChange={(e) => handleAnswer(e.target.value === 'true')}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        );

      case 'multiple-choice':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={value}
              onChange={(e) => handleAnswer(e.target.value)}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'slider':
        return (
          <Box sx={{ px: 2 }}>
            <Slider
              value={value as number}
              onChange={(_, newValue) => handleAnswer(newValue as number)}
              min={0}
              max={100}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            {currentQuestion.text}
          </Typography>

          <Box sx={{ mt: 3, mb: 4 }}>
            {renderQuestionInput(currentQuestion)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Questionnaire; 