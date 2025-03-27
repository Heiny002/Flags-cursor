import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Help as HelpIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';
import FooterNav from '../components/FooterNav';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CATEGORIES = [
  'Lifestyle & Habits',
  'Cultural & Entertainment',
  'Ethical & Moral Beliefs',
  'Social & Political Views',
  'Relationship Dynamics',
  'Career & Education',
  'Travel & Adventure',
  'Food & Cuisine',
  'After Dark',
  'Local',
];

const HINTS = [
  'Taking an extreme stance is typically better for others to vote on. For example "Blue is the BEST color" is better than "Blue is a GOOD color" because disagreeing with the second statement could mean you think blue is a BAD color or that blue is the BEST color.',
  'So try to use superlatives like BEST, WORST, ONLY, MOST, NEVER, ALWAYS, etc.',
  'Try not to include feelings like "Hot dogs are my favorite food". Hot Takes should be statements like "Hot dogs are the BEST food".',
  'Comparing two things is recommended: "Cats are better than Dogs".',
];

interface VerificationResponse {
  _id: string;
  text: string;
  categories: string[];
  author: string;
  createdAt: string;
  isActive: boolean;
  isInitial: boolean;
  responses: any[];
  updatedAt: string;
  __v: number;
}

const HotTakeSubmission: React.FC = () => {
  const { token } = useAuth();
  const [hotTake, setHotTake] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openHints, setOpenHints] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<VerificationResponse | null>(null);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setVerification(null);

    if (!hotTake.trim()) {
      setError('Please enter a hot take');
      setLoading(false);
      return;
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('You must be logged in to submit a hot take');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting hot take to:', `${import.meta.env.VITE_API_URL}/hot-takes`);
      console.log('With data:', {
        text: hotTake.trim(),
        categories: selectedCategories,
      });

      const response = await axios.post<VerificationResponse>(
        `${import.meta.env.VITE_API_URL}/hot-takes`,
        {
          text: hotTake.trim(),
          categories: selectedCategories,
          isInitial: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response received:', response.data);

      // Store verification response
      setVerification(response.data);

      // Reset form after successful submission
      setHotTake('');
      setSelectedCategories([]);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error submitting hot take:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      let errorMessage = 'Failed to submit hot take. Please try again.';
      
      if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. Please check if the server is running.';
      } else if (err.response?.status === 401) {
        errorMessage = 'You must be logged in to submit a hot take.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Submit a Hot Take
            </Typography>
            <IconButton onClick={() => setOpenHints(true)} color="primary">
              <HelpIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Your Hot Take"
              value={hotTake}
              onChange={(e) => setHotTake(e.target.value)}
              error={!!error && !hotTake.trim()}
              helperText={error && !hotTake.trim() ? error : ''}
              placeholder="Enter your controversial opinion..."
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Select Categories:
            </Typography>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
              {CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryToggle(category)}
                  color={selectedCategories.includes(category) ? "primary" : "default"}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>

            {error && (
              <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!hotTake.trim() || selectedCategories.length === 0 || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Submitting...' : 'Submit Hot Take'}
            </Button>
          </form>
        </Paper>
      </Container>

      <Dialog open={openHints} onClose={() => setOpenHints(false)}>
        <DialogTitle>Tips for Writing Hot Takes</DialogTitle>
        <DialogContent>
          <List>
            {HINTS.map((hint, index) => (
              <ListItem key={index}>
                <ListItemText primary={hint} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHints(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon />}
        >
          {verification ? (
            <Box>
              <Typography variant="subtitle2">Hot take submitted successfully!</Typography>
              <Typography variant="caption" display="block">
                ID: {verification._id}
              </Typography>
              <Typography variant="caption" display="block">
                Created at: {new Date(verification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ) : (
            'Hot take submitted successfully!'
          )}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ width: '100%' }}
          icon={<ErrorIcon />}
        >
          {error}
        </Alert>
      </Snackbar>

      <FooterNav />
    </div>
  );
};

export default HotTakeSubmission; 