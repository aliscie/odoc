import React, { useEffect } from 'react';

import { useGoogleCalendar } from './useGoogleCalendar';
// Add to imports
import { Button, Badge, Avatar } from '@mui/material';
import GoogleCalendarLogo from '@mui/icons-material/Event';
import Tooltip from '@mui/material/Tooltip';


const GoogleCalendarButton = () => {

  const {
    connectCalendar,
    disConnectCalendar,
    isConnected,
  } = useGoogleCalendar();


  return (
    <div>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={isConnected ? 'success' : 'error'}
        sx={{
          '& .MuiBadge-dot': {
            height: 12,
            width: 12,
            borderRadius: '50%',
            animation: isConnected ? 'pulse 2s infinite' : 'none',
          },
          '@keyframes pulse': {
            '0%': { transform: 'scale(0.95)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
            '100%': { transform: 'scale(0.95)', opacity: 1 },
          }
        }}
      >
        <Tooltip title={isConnected ? "Disconnect Google Calendar" : "Connect Google Calendar"}>
          <Button
            variant="contained"
            onClick={isConnected ? disConnectCalendar : connectCalendar}
            sx={{
              backgroundColor: isConnected ? '#4285F4' : '#DB4437',
              '&:hover': {
                backgroundColor: isConnected ? '#3367D6' : '#C1351D',
              },
              minWidth: '40px',
              padding: '8px'
            }}
          >
            <GoogleCalendarLogo sx={{ color: 'white', fontSize: '24px' }} />
          </Button>
        </Tooltip>
      </Badge>
    </div>
  );
};

export default GoogleCalendarButton;