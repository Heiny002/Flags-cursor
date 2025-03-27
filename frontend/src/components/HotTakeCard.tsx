import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';
import PositionButtons from './PositionButtons';
import { FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface HotTakeCardProps {
  title: string;
  category: string;
  author: string;
  onResponseChange: (value: number | null) => void;
  onMatchChange: (value: [number, number] | null) => void;
  onDealbreakerChange: (checked: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  cardKey: string;
}

interface VisibilityState {
  frontCard: boolean;
  backCard: boolean;
  frontTitle: boolean;
  frontCategory: boolean;
  frontResponse: boolean;
  frontSlider: boolean;
  backTitle: boolean;
  backCategory: boolean;
  backResponse: boolean;
  backSlider: boolean;
  dealbreaker: boolean;
  flipButton: boolean;
}

const HotTakeCard: React.FC<HotTakeCardProps> = ({
  title,
  category,
  author,
  onResponseChange,
  onMatchChange,
  onDealbreakerChange,
  onNext,
  onPrevious,
  onSkip,
  cardKey,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [response, setResponse] = useState<number | null>(null);
  const [matchResponse, setMatchResponse] = useState<[number, number] | null>(null);
  const [isDealbreaker, setIsDealbreaker] = useState(false);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityState>({
    frontCard: true,
    backCard: true,
    frontTitle: true,
    frontCategory: true,
    frontResponse: true,
    frontSlider: true,
    backTitle: true,
    backCategory: true,
    backResponse: true,
    backSlider: true,
    dealbreaker: true,
    flipButton: true,
  });

  // Reset state when cardKey changes
  React.useEffect(() => {
    setIsFlipped(false);
    setResponse(null);
    setMatchResponse(null);
    setIsDealbreaker(false);
    setIsSelectingRange(false);
  }, [cardKey]);

  const handleResponseChange = (value: number) => {
    setResponse(value);
    onResponseChange(value);
    // Auto-flip to back when a response is selected with a 1-second delay
    if (value !== 0) {
      setTimeout(() => {
        setIsFlipped(true);
      }, 500);
    }
  };

  const handleMatchChange = (value: [number, number] | null) => {
    setMatchResponse(value);
    onMatchChange(value);
    setIsSelectingRange(false);
  };

  const handleMatchClick = (value: number) => {
    if (!isSelectingRange) {
      // Single selection
      setMatchResponse([value, value]);
      onMatchChange([value, value]);
      setIsSelectingRange(false);
    } else {
      // Range selection
      setMatchResponse([matchResponse![0], value]);
      onMatchChange([matchResponse![0], value]);
      setIsSelectingRange(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setMatchResponse(null);
    setIsSelectingRange(false);
    onResponseChange(null);
    onMatchChange(null);
  };

  const handleDealbreakerChange = (checked: boolean) => {
    setIsDealbreaker(checked);
    onDealbreakerChange(checked);
  };

  const toggleVisibility = (key: keyof VisibilityState) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNext = async () => {
    if (!canProceed) return;
    
    setIsLoading(true);
    try {
      // Log the hot take response to the backend
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!cardKey) {
        throw new Error('No hot take ID provided');
      }

      console.log('Submitting response with cardKey:', cardKey);
      
      const payload = {
        hotTakeId: cardKey,
        userResponse: response,
        matchResponse: matchResponse,
        isDealbreaker: isDealbreaker
      };
      
      console.log('Request payload:', payload);
      
      const fetchResponse = await fetch(`${import.meta.env.VITE_API_URL}/hot-takes/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await fetchResponse.json();
      console.log('Server response:', data);

      if (!fetchResponse.ok) {
        throw new Error(data.message || 'Failed to save response');
      }

      // Show success notification
      toast.success('Response saved successfully!');
      
      // Reset the card state
      setIsFlipped(false);
      setResponse(null);
      setMatchResponse(null);
      setIsDealbreaker(false);
      setIsSelectingRange(false);
      
      // Only proceed with navigation if the save was successful
      onNext();
    } catch (error) {
      console.error('Error saving hot take response:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      // Show error notification
      toast.error(error instanceof Error ? error.message : 'Failed to save response');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (isFlipped) {
      setIsFlipped(false);
    } else {
      onPrevious();
    }
  };

  const isFrontComplete = response !== null;
  const isBackComplete = matchResponse !== null;
  const canFlip = isFrontComplete;
  const canProceed = isFrontComplete && isBackComplete;

  return (
    <Box sx={{ position: 'relative', perspective: '1000px', height: '400px' }}>
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          transition: 'transform 0.6s',
        }}
      >
        {/* Front of card */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            {category}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
            by {author}
          </Typography>
          {visibility.frontResponse && (
            <Typography
              variant="h4"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                opacity: 0.2,
                fontWeight: 'bold',
                color: 'gray.500',
                pointerEvents: 'none',
              }}
            >
              My Response
            </Typography>
          )}
          {visibility.frontSlider && (
            <Box sx={{ mt: 2 }}>
              <PositionButtons
                value={response}
                onChange={handleResponseChange}
              />
            </Box>
          )}
        </Box>

        {/* Back of card */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            {category}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
            by {author}
          </Typography>
          {visibility.backResponse && (
            <Typography
              variant="h4"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                opacity: 0.2,
                fontWeight: 'bold',
                color: 'gray.500',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              Match's Opinion
            </Typography>
          )}
          {visibility.backSlider && (
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%',
                mt: 'auto',
                mb: 3,
              }}
            >
              <PositionButtons
                value={matchResponse?.[0] || null}
                onChange={handleMatchClick}
                isRange={true}
                onRangeChange={handleMatchChange}
                isSelectingRange={isSelectingRange}
                rangeValue={matchResponse}
                onDealbreakerChange={handleDealbreakerChange}
                isDealbreaker={isDealbreaker}
              />
            </Box>
          )}
          {visibility.flipButton && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                position: 'relative',
                mt: 1,
              }}
            >
              <Button
                variant="text"
                onClick={() => setIsFlipped(false)}
                startIcon={<FaExchangeAlt />}
                sx={{
                  color: 'gray.600',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'gray.900',
                  },
                }}
              >
                Flip
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button
          variant="text"
          onClick={onSkip}
          sx={{
            color: 'gray.600',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'gray.900',
            },
          }}
        >
          Skip
        </Button>
        {canProceed && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isLoading}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {isLoading ? 'Saving...' : 'Next'}
          </Button>
        )}
      </Box>

      <Snackbar
        open={showConfirmation}
        autoHideDuration={3000}
        onClose={() => setShowConfirmation(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowConfirmation(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Hot Take response saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HotTakeCard; 