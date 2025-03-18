import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FaFlag } from 'react-icons/fa';

interface Position {
  value: number;
  label: string;
  color: string;
  iconColor: string;
}

interface MatchPositionButtonsProps {
  selectedValue: number;
  onChange: (value: number) => void;
}

const positions: Position[] = [
  { value: 1, label: 'Strongly Disagree', color: '#EF4444', iconColor: '#991B1B' },
  { value: 2, label: 'Disagree', color: '#F97316', iconColor: '#9A3412' },
  { value: 3, label: 'Neutral', color: '#D4C988', iconColor: '#8B7355' },
  { value: 4, label: 'Agree', color: '#EAB308', iconColor: '#854D0E' },
  { value: 5, label: 'Strongly Agree', color: '#22C55E', iconColor: '#166534' },
];

const MatchPositionButtons: React.FC<MatchPositionButtonsProps> = ({
  selectedValue,
  onChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 2,
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {positions.map((position) => (
        <Box
          key={position.value}
          onClick={() => onChange(position.value)}
          sx={{
            flex: 1,
            minWidth: 0,
            position: 'relative',
            cursor: 'pointer',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: selectedValue === position.value ? position.color : 'transparent',
              border: `2px solid ${position.color}`,
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
              zIndex: -1,
            },
            '&:hover::before': {
              backgroundColor: selectedValue === position.value 
                ? position.color 
                : `${position.color}20`,
              transform: 'scale(1.05)',
            },
            '&:active::before': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <FaFlag
              size={20}
              color={selectedValue === position.value ? position.iconColor : position.color}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                color: selectedValue === position.value ? position.iconColor : position.color,
                fontWeight: selectedValue === position.value ? 'bold' : 'normal',
                fontSize: '0.7rem',
                textAlign: 'center',
                lineHeight: 1.1,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                height: '2.4em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {position.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MatchPositionButtons; 