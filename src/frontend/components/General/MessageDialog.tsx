import * as React from 'react';
import { Box, Typography, Dialog, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MessageDialogProps {
  open: boolean;
  title: string;
  description?: string;
  inputFields?: React.ReactNode;
  actions?: React.ReactNode[];
  onClose: () => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  title,
  description,
  inputFields,
  actions,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '16px',
          position: 'relative' // Ensure relative positioning for the Box components inside
        },
      }}
    >
      <Box sx={{ padding: '16px', position: 'relative' }}>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center', marginBottom: '8px' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginBottom: '16px' }}>
            {description}
          </Typography>
        )}
        {actions && actions[0] && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            {actions[0]}
          </Box>
        )}
      </Box>
      <DialogContent sx={{ padding: '0' }}>
        {inputFields}
      </DialogContent>
      {actions && actions[1] && (
        <Box sx={{ padding: '8px 16px', display: 'flex', justifyContent: 'flex-start' }}>
          {actions[1]}
        </Box>
      )}
    </Dialog>
  );
};

export default MessageDialog;
