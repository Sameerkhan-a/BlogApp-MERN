import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';

const Layout = ({ children, isDark, toggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {children}
        </Container>
      </Box>
      
      {/* Simple Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ typography: 'body2' }}>
            © 2024 Blog App - Share Your Stories
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
