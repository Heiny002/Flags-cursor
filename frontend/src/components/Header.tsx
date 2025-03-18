import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      window.location.reload();
    } else {
      navigate('/login');
    }
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 24px',
        background: 'transparent',
        zIndex: 1000,
      }}
    >
      <Button
        variant="text"
        onClick={handleAuthClick}
        sx={{
          color: 'gray.700',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </Button>
    </Box>
  );
};

export default Header; 