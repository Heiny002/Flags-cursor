import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Switch, FormControlLabel } from '@mui/material';
import PositionButtons from './PositionButtons';
import { FaExchangeAlt } from 'react-icons/fa';

interface HotTakeCardProps {
  title: string;
  category: string;
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

  const handleResponseChange = (value: number | null) => {
    setResponse(value);
    onResponseChange(value);
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

  const handleDealbreakerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDealbreaker(event.target.checked);
    onDealbreakerChange(event.target.checked);
  };

  const toggleVisibility = (key: keyof VisibilityState) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNext = () => {
    if (isFlipped) {
      setIsFlipped(false);
      onNext();
    } else {
      setIsFlipped(true);
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
    <Box sx={{ width: '100%' }} key={cardKey}>
      <Box
        sx={{
          width: '100%',
          height: '350px',
          position: 'relative',
        }}
      >
        {!isFlipped ? (
          // Front Card
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              height: '100%',
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
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
              {visibility.frontTitle && (
                <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                  {title}
                </Typography>
              )}
              {visibility.frontCategory && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {category}
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
          </Paper>
        ) : (
          // Back Card
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              height: '100%',
            }}
          >
            <Box 
              sx={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
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
              <Box sx={{ position: 'relative', mb: 3 }}>
                {visibility.backTitle && (
                  <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                    {title}
                  </Typography>
                )}
                {visibility.backCategory && (
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    {category}
                  </Typography>
                )}
              </Box>
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
                  />
                </Box>
              )}
              {visibility.dealbreaker && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    position: 'relative',
                    mt: 1,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDealbreaker}
                        onChange={handleDealbreakerChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#EF4444',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            },
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#EF4444',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: isDealbreaker ? '#EF4444' : 'text.primary',
                          fontWeight: isDealbreaker ? 'bold' : 'normal',
                        }}
                      >
                        Dealbreaker
                      </Typography>
                    }
                  />
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>
      
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
        {visibility.flipButton && (
          <Button
            variant="text"
            onClick={() => setIsFlipped(!isFlipped)}
            startIcon={<FaExchangeAlt />}
            disabled={!canFlip}
            sx={{
              color: canFlip ? 'gray.600' : 'gray.400',
              '&:hover': {
                backgroundColor: 'transparent',
                color: canFlip ? 'gray.900' : 'gray.400',
              },
            }}
          >
            Flip
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default HotTakeCard; 