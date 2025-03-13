import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  Fade,
  ButtonGroup
} from '@mui/material';

/**
 * Internet Identity login handler
 * @returns {Promise<void>} Promise resolving after login attempt
 */
const handleInternetIdentityLogin = async () => {
  try {
    console.log('Logging in with Internet Identity');
    // Add Internet Identity integration logic here
  } catch (error) {
    console.error('Internet Identity login failed:', error);
  }
};

/**
 * MetaMask login handler
 * @returns {Promise<void>} Promise resolving after login attempt
 */
const handleMetaMaskLogin = async () => {
  try {
    console.log('Logging in with MetaMask');
    // Add MetaMask integration logic here
  } catch (error) {
    console.error('MetaMask login failed:', error);
  }
};

/**
 * Custom hook for managing hover state and interactions
 * @returns {Object} State and handlers for login component
 */
const useLoginInteraction = () => {
  const [expanded, setExpanded] = useState(false);
  
  const handleMouseEnter = () => {
    setExpanded(true);
  };
  
  const handleMouseLeave = () => {
    setExpanded(false);
  };
  
  const handleToggleExpanded = () => {
    setExpanded((prev) => !prev);
  };
  
  return {
    expanded,
    handleMouseEnter,
    handleMouseLeave,
    handleToggleExpanded
  };
};

/**
 * Main expandable login component
 * @returns {JSX.Element} Login component
 */
const ExpandableLogin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { 
    expanded, 
    handleMouseEnter, 
    handleMouseLeave, 
    handleToggleExpanded
  } = useLoginInteraction();
  
  // Determine if we should use hover or click based on device
  const interactionProps = isMobile
    ? { onClick: handleToggleExpanded }
    : { 
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      };

  // Button styles
  const buttonStyle = {
    borderRadius: expanded ? '4px' : '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: 'bold',
    boxShadow: expanded ? theme.shadows[4] : theme.shadows[2],
    px: 2,
    py: 1,
    textTransform: 'none',
    '&:hover': {
      boxShadow: theme.shadows[6]
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'inline-block', 
        position: 'relative',
        width: expanded ? 'auto' : 'auto',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
      {...interactionProps}
    >
      {/* Container that handles the expansion */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: expanded ? 240 : 100,
          backgroundColor: theme.palette.primary.main,
          borderRadius: expanded ? '8px' : '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: expanded ? theme.shadows[8] : theme.shadows[2],
        }}
      >
        {/* Login Text (visible when not expanded) */}
        <Fade in={!expanded} timeout={300}>
          <Box 
            sx={{
              display: !expanded ? 'flex' : 'none',
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1.5
            }}
          >
            <Typography 
              variant="button" 
              sx={{ 
                color: theme.palette.primary.contrastText,
                fontWeight: 'bold',
                fontSize: '1rem',
                letterSpacing: '0.5px'
              }}
            >
              Login
            </Typography>
          </Box>
        </Fade>
        
        {/* Expanded Login Options */}
        <Fade in={expanded} timeout={300}>
          <Stack
            spacing={1}
            sx={{
              display: expanded ? 'flex' : 'none',
              p: 2,
              width: '100%'
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleInternetIdentityLogin}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: theme.palette.primary.contrastText,
                textTransform: 'none',
                fontWeight: 'medium',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Internet Identity
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              onClick={handleMetaMaskLogin}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: theme.palette.primary.contrastText,
                textTransform: 'none',
                fontWeight: 'medium',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              MetaMask
            </Button>
          </Stack>
        </Fade>
      </Box>
    </Box>
  );
};

export default ExpandableLogin;