import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  IconButton,
  Collapse,
  useTheme,
  styled
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import InfoIcon from "@mui/icons-material/Info";

const STORAGE_KEY = 'beta-warning-dismiss-count';
const MAX_DISMISS_COUNT = 2;

const StyledAlert = styled(Alert)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: theme.zIndex.tooltip + 1,
  maxWidth: '600px',
  width: '90%',
  boxShadow: theme.shadows[4],
  animation: 'slideDown 0.3s ease-out',
  '@keyframes slideDown': {
    from: {
      transform: 'translateX(-50%) translateY(-100%)',
      opacity: 0
    },
    to: {
      transform: 'translateX(-50%) translateY(0)',
      opacity: 1
    }
  },
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    top: theme.spacing(1)
  }
}));

const BetaWarning = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check dismiss count on component mount
    const checkDismissCount = () => {
      const dismissCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
      setIsVisible(dismissCount < MAX_DISMISS_COUNT);
    };

    checkDismissCount();
  }, []);

  const handleClose = () => {
    const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    setIsVisible(false);
  };

  return (
    <Collapse in={isVisible}>
      <StyledAlert
        severity="warning"
        icon={<InfoIcon />}
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
      >
        <AlertTitle>Beta Version</AlertTitle>
        Some features are not available yet. We will release them soon - stay tuned!
      </StyledAlert>
    </Collapse>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(BetaWarning);
