import React from 'react';
import { Box, Typography, Button } from '@mui/material';
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
}) => {
  const handleClick = (clickedValue: number) => {
    if (isRange && onRangeChange) {
      if (value === null) {
        onChange(clickedValue);
      } else {
        onRangeChange([value, clickedValue]);
      }
    } else {
      onChange(clickedValue);
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
    if (isRange && rangeValue) {
      const [start, end] = rangeValue;
      if (positionValue >= Math.min(start, end) && positionValue <= Math.max(start, end)) {
        return positions.find(p => p.value === positionValue)?.color || '#64748B';
      }
    } else if (positionValue === value) {
      return positions.find(p => p.value === positionValue)?.color || '#64748B';
    }
    return '#E5E7EB';
  };

  const getIconColor = (positionValue: number) => {
    if (isRange && rangeValue) {
      const [start, end] = rangeValue;
      if (positionValue >= Math.min(start, end) && positionValue <= Math.max(start, end)) {
        return positions.find(p => p.value === positionValue)?.iconColor || '#475569';
      }
    } else if (positionValue === value) {
      return positions.find(p => p.value === positionValue)?.iconColor || '#475569';
    }
    return '#6B7280';
  };

  const handleReset = () => {
    if (isRange && onRangeChange) {
      onRangeChange(null);
    } else {
      onChange(null);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
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
              }}
            >
              {position.label}
            </Typography>
          </button>
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
        {(value !== null || (isRange && rangeValue)) && (
          <Button
            variant="text"
            size="small"
            startIcon={<FaUndo />}
            onClick={handleReset}
            sx={{
              color: 'gray.600',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'gray.900',
              },
            }}
          >
            Reset
          </Button>
        )}
        {isSelectingRange && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', display: 'block' }}
          >
            Select the end of your range
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PositionButtons; 