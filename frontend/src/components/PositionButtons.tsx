import React from 'react';
import { Box, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { FaFlag, FaUndo } from 'react-icons/fa';

interface Position {
  value: number;
  label: string;
  color: string;
  iconColor: string;
}

interface PositionButtonsProps {
  value: number | null;
  onChange: (value: number) => void;
  isRange?: boolean;
  onRangeChange?: (value: [number, number] | null) => void;
  isSelectingRange?: boolean;
  rangeValue?: [number, number] | null;
  onDealbreakerChange?: (value: boolean) => void;
  isDealbreaker?: boolean;
}

const positions: Position[] = [
  { value: 1, label: 'Strongly Disagree', color: '#EF4444', iconColor: '#991B1B' },
  { value: 2, label: 'Disagree', color: '#F97316', iconColor: '#9A3412' },
  { value: 3, label: 'Neutral', color: '#64748B', iconColor: '#475569' },
  { value: 4, label: 'Agree', color: '#10B981', iconColor: '#065F46' },
  { value: 5, label: 'Strongly Agree', color: '#3B82F6', iconColor: '#1E40AF' },
];

const PositionButtons: React.FC<PositionButtonsProps> = ({
  value,
  onChange,
  isRange = false,
  onRangeChange,
  isSelectingRange = false,
  rangeValue,
  onDealbreakerChange,
  isDealbreaker,
}) => {
  const handleClick = (clickedValue: number) => {
    if (!isRange || !onRangeChange) {
      // Single selection mode
      onChange(clickedValue === value ? 0 : clickedValue);
      return;
    }

    // Range selection mode
    if (value === null || value === 0) {
      // No start value set - set it
      onChange(clickedValue);
    } else if (value === clickedValue) {
      // Clicked the start value again - reset everything
      onChange(0);
      onRangeChange(null);
    } else if (!rangeValue) {
      // Start value set, setting end value
      onRangeChange([value, clickedValue]);
    } else {
      // Range already set
      const [start, end] = rangeValue;
      if (clickedValue === end) {
        // Clicked end value - reset only the end, keep the start
        onRangeChange(null);
        // Keep the start value selected
        onChange(start);
      } else {
        // Set new end value
        onRangeChange([start, clickedValue]);
      }
    }
  };

  const isValueSelected = (positionValue: number) => {
    if (isRange && rangeValue) {
      const [start, end] = rangeValue;
      return positionValue >= Math.min(start, end) && positionValue <= Math.max(start, end);
    }
    return positionValue === value;
  };

  const getButtonColor = (positionValue: number) => {
    if (isRange) {
      if (positionValue === value) {
        // Start position is always colored
        return positions.find(p => p.value === positionValue)?.color || '#64748B';
      }
      if (rangeValue) {
        const [start, end] = rangeValue;
        if (positionValue >= Math.min(start, end) && positionValue <= Math.max(start, end)) {
          return positions.find(p => p.value === positionValue)?.color || '#64748B';
        }
      }
    } else if (positionValue === value) {
      return positions.find(p => p.value === positionValue)?.color || '#64748B';
    }
    return '#E5E7EB';
  };

  const getIconColor = (positionValue: number) => {
    if (isRange) {
      if (positionValue === value) {
        // Start position is always colored
        return positions.find(p => p.value === positionValue)?.iconColor || '#475569';
      }
      if (rangeValue) {
        const [start, end] = rangeValue;
        if (positionValue >= Math.min(start, end) && positionValue <= Math.max(start, end)) {
          return positions.find(p => p.value === positionValue)?.iconColor || '#475569';
        }
      }
    } else if (positionValue === value) {
      return positions.find(p => p.value === positionValue)?.iconColor || '#475569';
    }
    return '#6B7280';
  };

  const handleReset = () => {
    if (isRange && onRangeChange) {
      onRangeChange(null);
      onChange(0);
    } else {
      onChange(0);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: 150 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 2,
          mb: 2,
        }}
      >
        {positions.map((position) => (
          <Box
            key={position.value}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <button
              onClick={() => handleClick(position.value)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
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
                  backgroundColor: getButtonColor(position.value),
                  transition: 'all 0.2s ease-in-out',
                  mb: 1,
                  border: isValueSelected(position.value) ? '2px solid transparent' : '2px solid #D1D5DB',
                  '&:hover': {
                    borderColor: positions.find(p => p.value === position.value)?.color || '#64748B',
                    backgroundColor: isValueSelected(position.value) 
                      ? positions.find(p => p.value === position.value)?.color || '#64748B'
                      : '#F3F4F6',
                  },
                }}
              >
                <FaFlag
                  size={20}
                  color={getIconColor(position.value)}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'center',
                  color: isValueSelected(position.value) ? 'text.primary' : 'text.secondary',
                  fontWeight: isValueSelected(position.value) ? 'bold' : 'normal',
                  transition: 'all 0.2s ease-in-out',
                  userSelect: 'none',
                  minHeight: '2.5em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {position.label}
              </Typography>
            </button>
          </Box>
        ))}
      </Box>
      
      {isRange && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDealbreaker}
                onChange={(e) => onDealbreakerChange?.(e.target.checked)}
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
  );
};

export default PositionButtons; 