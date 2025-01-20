import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Card,
  CardContent
} from '@mui/material';

const AffiliateStorageManager = {
  setAffiliateId: (id) => {
    if (!localStorage.getItem('affiliateId')) {
      localStorage.setItem('affiliateId', id);
      localStorage.setItem('affiliateTimestamp', Date.now());
      // Optional: Track where the user came from
      localStorage.setItem('affiliateReferrer', document.referrer);
    }
  },

  getAffiliateId: () => localStorage.getItem('affiliateId'),

  isAffiliateValid: () => {
    const timestamp = localStorage.getItem('affiliateTimestamp');
    if (!timestamp) return false;
    // Affiliate ID is valid for 30 days
    return Date.now() - parseInt(timestamp) < 30 * 24 * 60 * 60 * 1000;
  }
};

const AffiliateRedirect = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAffiliateRedirect = () => {
      // Parse the URL to get the affiliate ID
      const searchParams = new URLSearchParams(location.search);
      const affiliateId = searchParams.get('id');

      if (affiliateId) {
        try {
          // Store the affiliate ID
          AffiliateStorageManager.setAffiliateId(affiliateId);

          // Optional: You could make an API call here to track the click
          // await trackAffiliateClick(affiliateId);

          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } catch (error) {
          console.error('Error processing affiliate link:', error);
          // Redirect to home page even if there's an error
          navigate('/');
        }
      } else {
        // If no affiliate ID is found, redirect to home
        navigate('/');
      }
    };

    handleAffiliateRedirect();
  }, [navigate, location]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      <Card sx={{
        maxWidth: 400,
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper
      }}>
        <CardContent>
          <CircularProgress
            size={60}
            sx={{ mb: 3, color: theme.palette.primary.main }}
          />
          <Typography variant="h6" gutterBottom>
            Processing Your Request
          </Typography>
          <Typography color="textSecondary">
            Please wait while we redirect you...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AffiliateRedirect;
