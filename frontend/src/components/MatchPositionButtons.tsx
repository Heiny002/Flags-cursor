import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface MatchPositionButtonsProps {
  selectedValue: number | null;
  onChange: (value: [number, number]) => void;
}

const MatchPositionButtons: React.FC<MatchPositionButtonsProps> = ({
  selectedValue,
  onChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  useEffect(() => {
    if (selectedValue === null) {
      setSelectedRange(null);
      setIsSelectingRange(false);
    }
  }, [selectedValue]);

  const handlePositionClick = (value: number) => {
    if (!isSelectingRange) {
      setSelectedRange([value, value]);
      setIsSelectingRange(true);
    } else {
      setSelectedRange([selectedRange![0], value]);
      onChange([selectedRange![0], value]);
      setIsSelectingRange(false);
    }
  };

  const isValueInRange = (value: number) => {
    if (!selectedRange) return false;
    const [start, end] = selectedRange;
    return value >= Math.min(start, end) && value <= Math.max(start, end);
  };

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
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handlePositionClick(value)}
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
                backgroundColor: isValueInRange(value) ? getColor(value) : '#E5E7EB',
                transition: 'all 0.2s ease-in-out',
                mb: 1,
                border: isValueInRange(value) ? '2px solid transparent' : '2px solid #D1D5DB',
                '&:hover': {
                  borderColor: getColor(value),
                  backgroundColor: isValueInRange(value) ? getColor(value) : '#F3F4F6',
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: isValueInRange(value) ? 'white' : '#6B7280',
                  fontWeight: isValueInRange(value) ? 'bold' : 'normal',
                }}
              >
                {value}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                textAlign: 'center',
                color: isValueInRange(value) ? 'text.primary' : 'text.secondary',
                fontWeight: isValueInRange(value) ? 'bold' : 'normal',
                transition: 'all 0.2s ease-in-out',
                userSelect: 'none',
              }}
            >
              {value === 1 ? 'Strongly Disagree' :
               value === 2 ? 'Disagree' :
               value === 3 ? 'Neutral' :
               value === 4 ? 'Agree' :
               'Strongly Agree'}
            </Typography>
          </button>
        ))}
      </Box>
      {isSelectingRange && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center', display: 'block', mt: 1 }}
        >
          Select the end of your range
        </Typography>
      )}
    </Box>
  );
};

export default MatchPositionButtons; 