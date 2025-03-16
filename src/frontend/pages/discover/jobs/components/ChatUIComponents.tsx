import React from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const EmptyState: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        color: theme.palette.text.secondary,
        gap: 2
      }}
    >
      <SmartToyIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
      <Typography>Start a conversation with the AI assistant</Typography>
    </Box>
  );
};

export const LoadingIndicator: React.FC = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 2 
    }}
  >
    <CircularProgress size={20} />
    <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
      AI is thinking...
    </Typography>
  </Box>
);