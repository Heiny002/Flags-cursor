import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface WalkthroughStep {
  element: string;
  description: string;
  position: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
  highlightArea: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface CardWalkthroughProps {
  steps: WalkthroughStep[];
  onComplete: () => void;
}

const CardWalkthrough: React.FC<CardWalkthroughProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const currentHighlight = steps[currentStep]?.highlightArea;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        // backgroundColor: 'rgba(0, 0, 0, 0.15)', // Commented out the overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Create a "hole" in the overlay for the highlighted element */}
      {currentHighlight && (
        <Box
          sx={{
            position: 'absolute',
            top: currentHighlight.top,
            left: currentHighlight.left,
            width: currentHighlight.width,
            height: currentHighlight.height,
            backgroundColor: 'transparent',
            boxShadow: '0 0 0 100vmax rgba(0, 0, 0, 0.5)', // Increased shadow coverage and opacity
            zIndex: 1001,
          }}
        />
      )}

      {/* Description button */}
      <Button
        variant="contained"
        onClick={handleNext}
        sx={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#2196f3',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 1002,
          maxWidth: '80%',
          whiteSpace: 'normal',
          textAlign: 'center',
          '&:hover': {
            backgroundColor: '#1976d2',
          },
        }}
      >
        <Typography variant="body1">
          {steps[currentStep]?.description}
        </Typography>
      </Button>
    </Box>
  );
};

export default CardWalkthrough; 