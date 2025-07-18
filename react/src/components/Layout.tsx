import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import CameraIcon from '@mui/icons-material/PhotoCamera';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photo Rating App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box sx={{ py: 2, textAlign: 'center', backgroundColor: 'grey.100' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Photo Rating App
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
