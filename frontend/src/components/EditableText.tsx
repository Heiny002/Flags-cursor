import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  multiline?: boolean;
  rows?: number;
  sx?: any;
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  onSave,
  variant = 'body1',
  multiline = false,
  rows = 1,
  sx = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const { token } = useAuth();

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the text in your backend
      // For now, we'll just call the onSave prop
      onSave(editedText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving text:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !multiline) {
      handleSave();
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .edit-icon': {
          opacity: 1,
        },
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth
            multiline={multiline}
            rows={rows}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            variant="outlined"
            size="small"
          />
          <IconButton
            onClick={handleSave}
            color="primary"
            size="small"
            sx={{ mt: 0.5 }}
          >
            <SaveIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant={variant}>{text}</Typography>
          {isHovered && (
            <IconButton
              className="edit-icon"
              onClick={() => setIsEditing(true)}
              size="small"
              sx={{
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EditableText; 