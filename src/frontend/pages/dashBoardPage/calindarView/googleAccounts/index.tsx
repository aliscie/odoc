import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { AccountsMenu } from './components/AccountsMenu';
import { useBackendContext } from '../../../../contexts/BackendContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './types';

const GoogleCalendarIntegration: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const {
    isSignedIn,
    isLoading,
    isGapiLoaded,
    accounts,
    handleAuthClick,
    setAccounts
  } = useGoogleAuth();

  const profile = useSelector((state: RootState) => state.filesState.profile);
  const { backendActor } = useBackendContext();
  const dispatch = useDispatch();

  const handleAddAccount = () => {
    window.gapi.auth2.getAuthInstance().grantOfflineAccess({
      prompt: 'select_account'
    }).then(() => {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const email = currentUser.getBasicProfile().getEmail();
      
      setAccounts(prev => [...prev, {email, isCurrent: true}]);
      setAnchorEl(null);
    });
  };

  const handleDisconnectAccount = (email: string) => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.disconnect().then(() => {
      setAccounts(prev => prev.filter(acc => acc.email !== email));
    });
  };

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Please log in to use Google Calendar integration</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {!isSignedIn ? (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAuthClick}
          sx={{ mb: 3 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Connect Google Calendar'}
        </Button>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Google Calendar Integration</Typography>
            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>

          <AccountsMenu
            anchorEl={anchorEl}
            accounts={accounts}
            onClose={() => setAnchorEl(null)}
            onAddAccount={handleAddAccount}
            onDisconnectAccount={handleDisconnectAccount}
          />

          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleAuthClick}
            sx={{ mb: 3 }}
          >
            Sign Out of Google Calendar
          </Button>
        </>
      )}
    </Box>
  );
};

export default GoogleCalendarIntegration;