import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { FaFlag } from 'react-icons/fa';

interface Position {
  value: number;
  label: string;
  color: string;
  iconColor: string;
}

interface FlagSliderProps {
  value: number | [number, number];
  onChange: (value: number) => void;
  isMatch?: boolean;
  onMatchChange?: (value: [number, number]) => void;
  showDealbreaker?: boolean;
  onDealbreakerChange?: (checked: boolean) => void;
  isDealbreaker?: boolean;
}

const positions: Position[] = [
  { value: 1, label: 'Strongly Disagree', color: '#EF4444', iconColor: '#991B1B' },
  { value: 2, label: 'Disagree', color: '#F97316', iconColor: '#9A3412' },
  { value: 3, label: 'Neutral', color: '#D4C988', iconColor: '#8B7355' },
  { value: 4, label: 'Agree', color: '#EAB308', iconColor: '#854D0E' },
  { value: 5, label: 'Strongly Agree', color: '#22C55E', iconColor: '#166534' },
];

const FlagSlider: React.FC<FlagSliderProps> = ({
  value,
  onChange,
  isMatch = false,
  onMatchChange,
  showDealbreaker = false,
  onDealbreakerChange,
  isDealbreaker = false,
}) => {
  const isValueInRange = (position: number) => {
    if (Array.isArray(value)) {
      const [start, end] = value;
      return position >= Math.min(start, end) && position <= Math.max(start, end);
    }
    return position === value;
  };

  const handleClick = (clickedValue: number) => {
    if (isMatch && onMatchChange) {
      if (Array.isArray(value)) {
        const [start, end] = value;
        if (start === end) {
          onMatchChange([start, clickedValue]);
        } else if (clickedValue === start || clickedValue === end) {
          onMatchChange([clickedValue, clickedValue]);
        } else {
          onMatchChange([start, clickedValue]);
        }
      }
    }
    onChange(clickedValue);
  };

  const handleDealbreakerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onDealbreakerChange) {
      onDealbreakerChange(event.target.checked);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2,
        }}
      >
        {positions.map((position) => (
          <button
            key={position.value}
            onClick={() => handleClick(position.value)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isValueInRange(position.value) ? position.color : '#E5E7EB',
                transition: 'all 0.2s ease-in-out',
                mb: 1,
                border: isValueInRange(position.value) ? '2px solid transparent' : '2px solid #D1D5DB',
                '&:hover': {
                  borderColor: position.color,
                  backgroundColor: isValueInRange(position.value) ? position.color : '#F3F4F6',
                },
              }}
            >
              <FaFlag
                size={20}
                color={isValueInRange(position.value) ? position.iconColor : '#6B7280'}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                textAlign: 'center',
                color: isValueInRange(position.value) ? 'text.primary' : 'text.secondary',
                fontWeight: isValueInRange(position.value) ? 'bold' : 'normal',
                transition: 'all 0.2s ease-in-out',
                userSelect: 'none',
              }}
            >
              {position.label}
            </Typography>
          </button>
        ))}
      </Box>
      {showDealbreaker && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDealbreaker}
                onChange={handleDealbreakerChange}
                sx={{
                  '&.Mui-checked': {
                    color: '#EF4444',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.04)',
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
                  userSelect: 'none',
                }}
              >
                Dealbreaker
              </Typography>
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default FlagSlider; 