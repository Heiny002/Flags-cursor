import React from 'react';
import Header from './Header';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'gray.100' }}>
      {!isAuthPage && <Header />}
      {children}
    </Box>
  );
};

export default Layout; 