import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Account } from '../types';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';

export const useGoogleAuth = (onConnect?: () => void) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const updateSigninStatus = useCallback((isSignedIn: boolean) => {
    setIsSignedIn(isSignedIn);
    if (isSignedIn) {
      onConnect?.();
    }
  }, [onConnect]);

  const initClient = useCallback(() => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      const authInstance = window.gapi.auth2.getAuthInstance();
      authInstance.isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(authInstance.isSignedIn.get());
      
      if (authInstance.isSignedIn.get()) {
        const currentUser = authInstance.currentUser.get();
        const email = currentUser.getBasicProfile().getEmail();
        setAccounts([{email, isCurrent: true}]);
      }
      
      setIsGapiLoaded(true);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error initializing Google API client', error);
      enqueueSnackbar('Failed to initialize Google Calendar API', { variant: 'error' });
      setIsLoading(false);
    });
  }, [enqueueSnackbar, updateSigninStatus]);

  useEffect(() => {
    const loadGapiAndInitClient = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', initClient);
      };
      document.body.appendChild(script);
    };

    loadGapiAndInitClient();

    return () => {
      const script = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [initClient]);

  const handleAuthClick = () => {
    if (isSignedIn) {
      window.gapi.auth2.getAuthInstance().signOut();
    } else {
      window.gapi.auth2.getAuthInstance().signIn();
    }
  };

  return {
    isSignedIn,
    isLoading,
    isGapiLoaded,
    accounts,
    handleAuthClick,
    setAccounts
  };
};