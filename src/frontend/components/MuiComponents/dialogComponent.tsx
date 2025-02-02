import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  useTheme,
  alpha,
  Box,
} from "@mui/material";

interface DialogComponentProps {
  button: React.ReactNode;
  onConfirm: () => Promise<void>;
  title: string;
  content: React.ReactNode;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  button,
  onConfirm,
  title,
  content,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error('Dialog confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {loading ? (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        ) : (
          <Box onClick={() => setOpen(true)} sx={{ cursor: 'pointer' }}>
            {button}
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.95)
              : theme.palette.background.paper,
            maxWidth: 'sm',
            margin: theme.spacing(2),
          },
        }}
      >
        <DialogTitle sx={{
          typography: 'h6',
          color: theme.palette.text.primary,
        }}>
          {title}
        </DialogTitle>

        <DialogContent sx={{
          color: theme.palette.text.secondary,
          py: theme.spacing(2),
        }}>
          {content}
        </DialogContent>

        <DialogActions sx={{ px: theme.spacing(3), pb: theme.spacing(2) }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              },
            }}
            autoFocus
          >
            {loading ? 'Processing...' : title}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogComponent;
