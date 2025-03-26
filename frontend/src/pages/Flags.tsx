import React, { useState, useEffect } from 'react';
import FooterNav from '../components/FooterNav';
import HotTakeCard from '../components/HotTakeCard';
import Header from '../components/Header';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface HotTake {
  id: string;
  text: string;
  categories: string[];
  author: {
    name: string;
  };
  createdAt: string;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | null>>({});
  const [matchRanges, setMatchRanges] = useState<Record<string, [number, number] | null>>({});
  const [dealbreakers, setDealbreakers] = useState<Record<string, boolean>>({});
  const [hotTakes, setHotTakes] = useState<HotTake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hot takes from the backend
  useEffect(() => {
    const fetchHotTakes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/hot-takes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Validate the response data
        const validHotTakes = response.data.filter((hotTake: any) => 
          hotTake && 
          hotTake._id && // Ensure we have a valid MongoDB ID
          hotTake.text && 
          hotTake.categories && 
          hotTake.author && 
          hotTake.author.name
        ).map((hotTake: any) => ({
          id: hotTake._id, // Map _id to id for frontend use
          text: hotTake.text,
          categories: hotTake.categories,
          author: hotTake.author,
          createdAt: hotTake.createdAt
        }));

        if (validHotTakes.length === 0) {
          throw new Error('No valid hot takes available');
        }

        setHotTakes(validHotTakes);
      } catch (err: any) {
        console.error('Error fetching hot takes:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch hot takes');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHotTakes();
    }
  }, [token]);

  const handleResponseChange = (value: number | null) => {
    if (!currentHotTake?.id) return;
    setResponses(prev => ({
      ...prev,
      [currentHotTake.id]: value
    }));
  };

  const handleMatchChange = (value: [number, number] | null) => {
    if (!currentHotTake?.id) return;
    setMatchRanges(prev => ({
      ...prev,
      [currentHotTake.id]: value
    }));
  };

  const handleDealbreakerChange = (checked: boolean) => {
    if (!currentHotTake?.id) return;
    setDealbreakers(prev => ({
      ...prev,
      [currentHotTake.id]: checked
    }));
  };

  const handleNext = () => {
    if (currentIndex < hotTakes.length - 1) {
      console.log('Moving to next card. Current index:', currentIndex);
      console.log('Current hot take:', hotTakes[currentIndex]);
      
      // Store the current hot take ID
      const currentHotTakeId = hotTakes[currentIndex].id;
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
            No Hot Takes Available
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Be the first to submit a hot take!
          </Typography>
        </div>
        <FooterNav />
      </div>
    );
  }

  const currentHotTake = hotTakes[currentIndex];
  
  // Additional safety check
  if (!currentHotTake || !currentHotTake.author) {
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
          category={currentHotTake.categories?.[0] || 'Uncategorized'} // Provide fallback
          author={currentHotTake.author.name}
          onResponseChange={handleResponseChange}
          onMatchChange={handleMatchChange}
          onDealbreakerChange={handleDealbreakerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          cardKey={currentHotTake.id}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} of {hotTakes.length}
          </Typography>
        </Box>
      </div>
      <FooterNav />
    </div>
  );
};

export default Flags; 