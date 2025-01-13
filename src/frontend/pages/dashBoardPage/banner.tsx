import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  Box,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {Z_INDEX_BANNER} from "../../constants/zIndex";

const DemoBanner = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        width: '100%',
        maxWidth: '600px',
        top: ({ spacing }) => `${spacing(isMobile ? 1 : 9)} !important`, // Adjusted for navbar height
        zIndex: Z_INDEX_BANNER, // Ensure it's below the navbar
      }}
      TransitionComponent={Slide}
    >
      <Alert
        severity="warning"
        icon={<WarningIcon />}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          width: '100%',
          boxShadow: (theme) => theme.shadows[4],
          backgroundColor: 'warning.light',
          color: 'warning.dark',
          '& .MuiAlert-icon': {
            color: 'warning.main',
            fontSize: '2rem',
            alignItems: 'center'
          },
          '& .MuiIconButton-root': {
            color: 'warning.dark',
          },
          border: 1,
          borderColor: 'warning.main',
          m: 1, // Add margin to prevent touching screen edges
        }}
      >
        <AlertTitle sx={{
          fontWeight: 'bold',
          mb: 0,
          color: 'warning.dark'
        }}>
          Feature Not Available
        </AlertTitle>
        This is a demo dashboard with sample data. All information displayed is for demonstration purposes only.
      </Alert>
    </Snackbar>
  );
};

export default DemoBanner;
