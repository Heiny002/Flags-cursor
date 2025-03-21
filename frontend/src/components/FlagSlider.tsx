import React from 'react';
import { Box, Typography, Slider, Stack } from '@mui/material';

interface FlagSliderProps {
  value: number | null;
  onChange: (value: number) => void;
}

const FlagSlider: React.FC<FlagSliderProps> = ({ value, onChange }) => {
  const marks = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ];

  const getColor = (value: number) => {
    switch (value) {
      case 1:
        return '#EF4444'; // red
      case 2:
        return '#F97316'; // orange
      case 3:
        return '#64748B'; // slate
      case 4:
        return '#10B981'; // emerald
      case 5:
        return '#3B82F6'; // blue
      default:
        return '#64748B'; // slate
    }
  };

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Slider
        value={value || 0}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={1}
        max={5}
        step={1}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => marks.find(mark => mark.value === value)?.label}
        sx={{
          '& .MuiSlider-thumb': {
            backgroundColor: value ? getColor(value) : '#94A3B8',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: 'none',
            },
            '&.Mui-active': {
              boxShadow: 'none',
            },
          },
          '& .MuiSlider-track': {
            backgroundColor: value ? getColor(value) : '#E2E8F0',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#E2E8F0',
          },
          '& .MuiSlider-mark': {
            backgroundColor: value ? getColor(value) : '#94A3B8',
            '&.MuiSlider-markActive': {
              backgroundColor: value ? getColor(value) : '#94A3B8',
            },
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: value ? getColor(value) : '#94A3B8',
            color: 'white',
            '&:before': {
              display: 'none',
            },
            '& *': {
              background: 'transparent',
              color: 'white',
            },
          },
        }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {value ? marks.find(mark => mark.value === value)?.label : 'Select your response'}
        </Typography>
      </Stack>
    </Box>
  );
};

export default FlagSlider; 