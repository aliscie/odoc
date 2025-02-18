import React, { useState, useCallback } from 'react';
import {
  Box,
  Fab,
  Slide,
  Paper,
  IconButton,
  useTheme,
  styled,
  Typography,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import  ThemedFineTuneComponent from './fineTuneCompnent';

// Styled Components
const FloatingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

const ChatBox = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(9),
  right: theme.spacing(3),
  width: '400px',
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
    bottom: 0,
    right: 0,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ChatContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  position: 'relative',
});

// Main Component
export const FloatingFineTune: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Handling click outside to close
  const handleClickOutside = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  }, []);

  return (
    <>
      {/* Overlay when chat is open on mobile */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: { xs: 'block', sm: 'none' },
          }}
          onClick={handleClickOutside}
        />
      )}

      <FloatingContainer>
        {/* Chat Box */}
        <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
          <ChatBox elevation={4}>
            <ChatHeader>
              <Typography variant="h6" component="div">
                Fine-Tune Model
              </Typography>
              <IconButton
                size="small"
                onClick={handleToggle}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>

            <ChatContent>
              <Box sx={{ p: 2 }}>
                <ThemedFineTuneComponent />
              </Box>
            </ChatContent>
          </ChatBox>
        </Slide>

        {/* Floating Button */}
        <Zoom in={!isOpen}>
          <Fab
            color="primary"
            onClick={handleToggle}
            sx={{
              position: 'fixed',
              bottom: theme.spacing(3),
              right: theme.spacing(3),
              transition: theme.transitions.create(['transform', 'box-shadow']),
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <TuneIcon />
          </Fab>
        </Zoom>
      </FloatingContainer>
    </>
  );
};

// Animation Wrapper
const AnimatedFloatingFineTune: React.FC = () => {
  return (
    <Box sx={{ zIndex: 1000 }}>
      <FloatingFineTune />
    </Box>
  );
};

export default AnimatedFloatingFineTune;
