import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'primary.main' }}>
        Flags
      </Box>
      
      {isAuthenticated && (
        <IconButton
          onClick={handleLogout}
          sx={{
            color: 'gray.600',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: 'primary.main',
            },
            transition: 'all 0.2s ease-in-out',
          }}
          aria-label="logout"
        >
          <FiLogOut size={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default Header; 