import React, { useState, useEffect } from 'react';
import FooterNav from '../components/FooterNav';
import HotTakeCard from '../components/HotTakeCard';
import Header from '../components/Header';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HotTake {
  _id: string;
  text: string;
  categories: string[];
  authorName: string;
  createdAt: string;
  isInitial?: boolean;
  hasResponded?: boolean;
  isAuthor?: boolean;
  userResponse?: boolean | null;
}

const agreementLevels = [
  { value: 1, label: 'Strongly Disagree', color: 'bg-red-100 hover:bg-red-200' },
  { value: 2, label: 'Disagree', color: 'bg-orange-100 hover:bg-orange-200' },
  { value: 3, label: 'Neutral', color: 'bg-slate-100 hover:bg-slate-200' },
  { value: 4, label: 'Agree', color: 'bg-emerald-100 hover:bg-emerald-200' },
  { value: 5, label: 'Strongly Agree', color: 'bg-blue-100 hover:bg-blue-200' }
];

const Flags: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | null>>({});
  const [matchRanges, setMatchRanges] = useState<Record<string, [number, number] | null>>({});
  const [dealbreakers, setDealbreakers] = useState<Record<string, boolean>>({});
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotTakes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hot-takes`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          limit: 100,  // Request more hot takes
          offset: 0
        }
      });
      const data = response.data;
      console.log('Received hot takes:', data.length);
      console.log('Sample of received hot takes:', data.slice(0, 3).map((ht: HotTake) => ({
        id: ht._id,
        text: ht.text,
        author: ht.authorName,
        categories: ht.categories
      })));

      // Validate and filter hot takes
      const validHotTakes = data.filter((hotTake: HotTake) => {
        // Basic validation - ensure required fields exist
        const isValid = hotTake._id && 
                       hotTake.text && 
                       Array.isArray(hotTake.categories) && 
                       hotTake.categories.length > 0 &&
                       hotTake.authorName;

        if (!isValid) {
          console.warn('Invalid hot take:', {
            id: hotTake._id,
            text: hotTake.text,
            hasCategories: Array.isArray(hotTake.categories),
            categoriesLength: hotTake.categories?.length,
            hasAuthorName: !!hotTake.authorName
          });
          return false;
        }

        return true;
      });

      console.log('Valid hot takes:', validHotTakes.length);
      console.log('Initial hot takes:', validHotTakes.filter((ht: HotTake) => ht.isInitial).length);
      console.log('Sample of valid hot takes:', validHotTakes.slice(0, 3).map((ht: HotTake) => ({
        id: ht._id,
        text: ht.text,
        author: ht.authorName,
        categories: ht.categories
      })));

      if (validHotTakes.length === 0) {
        console.log('No valid hot takes found in response');
        setError('No new hot takes available at the moment. Check back later!');
        setHotTakes([]);
      } else {
        // Sort hot takes: initial hot takes first, then by creation date
        const sortedHotTakes = validHotTakes.sort((a: HotTake, b: HotTake) => {
          // Put initial hot takes first
          if (a.isInitial && !b.isInitial) return -1;
          if (!a.isInitial && b.isInitial) return 1;
          
          // Then sort by creation date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        console.log('Sorted hot takes:', sortedHotTakes.length);
        console.log('Sample of sorted hot takes:', sortedHotTakes.slice(0, 3).map((ht: HotTake) => ({
          id: ht._id,
          text: ht.text,
          author: ht.authorName,
          categories: ht.categories,
          isInitial: ht.isInitial,
          createdAt: ht.createdAt
        })));

        setHotTakes(sortedHotTakes);
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hot takes:', error);
      setError('Failed to load hot takes. Please try again later.');
      setLoading(false);
    }
  };

  // Initial fetch of hot takes
  useEffect(() => {
    if (token) {
      fetchHotTakes();
    }
  }, [token]);

  const handleResponseChange = (value: number | null) => {
    if (!currentHotTake?._id) return;
    setResponses(prev => ({
      ...prev,
      [currentHotTake._id]: value
    }));
  };

  const handleMatchChange = (value: [number, number] | null) => {
    if (!currentHotTake?._id) return;
    setMatchRanges(prev => ({
      ...prev,
      [currentHotTake._id]: value
    }));
  };

  const handleDealbreakerChange = (checked: boolean) => {
    if (!currentHotTake?._id) return;
    setDealbreakers(prev => ({
      ...prev,
      [currentHotTake._id]: checked
    }));
  };

  const handleNext = async () => {
    if (currentIndex < hotTakes.length - 1) {
      console.log('Moving to next card. Current index:', currentIndex);
      console.log('Current hot take:', hotTakes[currentIndex]);
      
      // Store the current hot take ID
      const currentHotTakeId = hotTakes[currentIndex]._id;
      console.log('Current hot take ID:', currentHotTakeId);
      
      // First increment the index
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        console.log('New index:', newIndex);
        return newIndex;
      });

      // Then clean up the state for the previous card
      setResponses(prev => {
        const newResponses = { ...prev };
        delete newResponses[currentHotTakeId];
        console.log('Updated responses:', newResponses);
        return newResponses;
      });
      
      setMatchRanges(prev => {
        const newRanges = { ...prev };
        delete newRanges[currentHotTakeId];
        console.log('Updated match ranges:', newRanges);
        return newRanges;
      });
      
      setDealbreakers(prev => {
        const newDealbreakers = { ...prev };
        delete newDealbreakers[currentHotTakeId];
        console.log('Updated dealbreakers:', newDealbreakers);
        return newDealbreakers;
      });

      // Refresh the hot takes list to get updated data
      try {
        await fetchHotTakes();
      } catch (error) {
        console.error('Error refreshing hot takes:', error);
        // If there's an error refreshing, we should still proceed
        // but log the error for debugging
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < hotTakes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-6 pb-24 mt-16 flex items-center justify-center">
          <CircularProgress />
        </div>
        <FooterNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-6 pb-24 mt-16">
          <Alert severity="error">{error}</Alert>
        </div>
        <FooterNav />
      </div>
    );
  }

  if (hotTakes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-6 pb-24 mt-16">
          <Typography variant="h4" gutterBottom>
            No More Hot Takes Available
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            You've responded to all available hot takes! Why not submit your own?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/hot-takes')}
            sx={{ mt: 2 }}
          >
            Submit a Hot Take
          </Button>
        </div>
        <FooterNav />
      </div>
    );
  }

  const currentHotTake = hotTakes[currentIndex];
  
  // Additional safety check
  if (!currentHotTake) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-6 pb-24 mt-16">
          <Alert severity="error">Invalid hot take data</Alert>
        </div>
        <FooterNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-xl mx-auto px-4 py-6 pb-24 mt-16">
        <Typography variant="h4" gutterBottom>
          Hot Takes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Share your opinions on these statements and see how they match with potential partners.
        </Typography>
        <HotTakeCard
          title={currentHotTake.text}
          category={currentHotTake.categories?.[0] || 'Uncategorized'}
          author={currentHotTake.authorName}
          onResponseChange={handleResponseChange}
          onMatchChange={handleMatchChange}
          onDealbreakerChange={handleDealbreakerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          cardKey={currentHotTake._id}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} of {hotTakes.length}
          </Typography>
          {currentHotTake.isInitial && (
            <Typography variant="body2" color="primary">
              (Initial Hot Take)
            </Typography>
          )}
          {currentHotTake.hasResponded && (
            <Typography variant="body2" color="success.main">
              (You've responded)
            </Typography>
          )}
          {currentHotTake.isAuthor && (
            <Typography variant="body2" color="info.main">
              (Your hot take)
            </Typography>
          )}
        </Box>
      </div>
      <FooterNav />
    </div>
  );
};

export default Flags; 