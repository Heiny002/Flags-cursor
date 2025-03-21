import React, { useState } from 'react';
import FooterNav from '../components/FooterNav';
import HotTakeCard from '../components/HotTakeCard';
import Header from '../components/Header';
import { Box, Button, Typography } from '@mui/material';

interface HotTake {
  id: string;
  text: string;
  author: string;
  category: string;
}

const agreementLevels = [
  { value: 1, label: 'Strongly Disagree', color: 'bg-red-100 hover:bg-red-200' },
  { value: 2, label: 'Disagree', color: 'bg-orange-100 hover:bg-orange-200' },
  { value: 3, label: 'Neutral', color: 'bg-slate-100 hover:bg-slate-200' },
  { value: 4, label: 'Agree', color: 'bg-emerald-100 hover:bg-emerald-200' },
  { value: 5, label: 'Strongly Agree', color: 'bg-blue-100 hover:bg-blue-200' }
];

const Flags: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | null>>({});
  const [matchRanges, setMatchRanges] = useState<Record<string, [number, number] | null>>({});
  const [dealbreakers, setDealbreakers] = useState<Record<string, boolean>>({});
  const [hotTakes, setHotTakes] = useState([
    {
      title: "Pineapple on pizza is delicious",
      category: "Food Preferences"
    },
    {
      title: "Dogs are better than cats",
      category: "Pet Preferences"
    },
    // Add more hot takes as needed
  ]);

  const handleResponseChange = (value: number | null) => {
    setResponses(prev => ({
      ...prev,
      [currentHotTake.title]: value
    }));
  };

  const handleMatchChange = (value: [number, number] | null) => {
    setMatchRanges(prev => ({
      ...prev,
      [currentHotTake.title]: value
    }));
  };

  const handleDealbreakerChange = (checked: boolean) => {
    setDealbreakers(prev => ({
      ...prev,
      [currentHotTake.title]: checked
    }));
  };

  const handleNext = () => {
    if (currentIndex < hotTakes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Move to next hot take without saving any responses
    setCurrentIndex(prev => prev + 1);
  };

  const currentHotTake = hotTakes[currentIndex];

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
          title={currentHotTake.title}
          category={currentHotTake.category}
          onResponseChange={handleResponseChange}
          onMatchChange={handleMatchChange}
          onDealbreakerChange={handleDealbreakerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          cardKey={`hot-take-${currentIndex}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentIndex === hotTakes.length - 1}
          >
            Next
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
        </Box>
      </div>
      
      <FooterNav />
    </div>
  );
};

export default Flags; 