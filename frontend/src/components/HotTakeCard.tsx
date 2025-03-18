import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Switch, FormControlLabel, Checkbox } from '@mui/material';
import FlagSlider from './FlagSlider';
import MatchPositionButtons from './MatchPositionButtons';
import { FaExchangeAlt } from 'react-icons/fa';

interface HotTakeCardProps {
  title: string;
  category: string;
  onResponseChange: (value: number) => void;
  onMatchChange: (value: [number, number]) => void;
  onDealbreakerChange: (checked: boolean) => void;
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
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [response, setResponse] = useState<number>(3);
  const [matchResponse, setMatchResponse] = useState<number>(3);
  const [isDealbreaker, setIsDealbreaker] = useState(false);
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

  const handleResponseChange = (value: number) => {
    setResponse(value);
    onResponseChange(value);
  };

  const handleMatchChange = (value: number) => {
    setMatchResponse(value);
    onMatchChange([value, value]);
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
    setIsSlidingUp(true);
    // Reset states after animation
    setTimeout(() => {
      setIsSlidingUp(false);
      setIsFlipped(false);
    }, 500); // Match the animation duration
  };

  const DebugPanel = () => (
    <Box sx={{ 
      mb: 2, 
      p: 2, 
      border: '1px solid #ccc', 
      borderRadius: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
    }}>
      <Typography variant="h6" sx={{ gridColumn: '1 / -1', mb: 1 }}>
        Debug Controls - Toggle Visibility
      </Typography>
      {Object.entries(visibility).map(([key, value]) => (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={value}
              onChange={() => toggleVisibility(key as keyof VisibilityState)}
              size="small"
            />
          }
          label={key}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <DebugPanel />
      <Box
        sx={{
          width: '100%',
          height: '350px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Front Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            height: '100%',
            position: 'absolute',
            width: '100%',
            transition: 'transform 0.5s ease-in-out',
            transform: isSlidingUp ? 'translateY(-100%)' : 'translateY(0)',
            zIndex: 1,
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
                <FlagSlider
                  value={response}
                  onChange={handleResponseChange}
                />
              </Box>
            )}
          </Box>
        </Paper>

        {/* Back Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            height: '100%',
            position: 'absolute',
            width: '100%',
            transition: 'transform 0.5s ease-in-out',
            transform: isSlidingUp 
              ? 'translateY(-100%)' 
              : isFlipped 
                ? 'translateX(0)' 
                : 'translateX(100%)',
            zIndex: 2,
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
                <MatchPositionButtons
                  selectedValue={matchResponse}
                  onChange={handleMatchChange}
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
                        transition: 'all 0.2s ease-in-out',
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
      </Box>
      
      {visibility.flipButton && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="text"
            onClick={() => setIsFlipped(!isFlipped)}
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
          {isFlipped && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: '#EF4444',
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
              }}
            >
              Next
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HotTakeCard; 