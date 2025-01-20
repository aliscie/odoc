// src/components/Shares/PaymentDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { User, CPayment as Promise } from '../../../declarations/backend/backend.did';

interface PaymentDialogProps {
  open: boolean;
  amount: number;
  loading: boolean;
  promises: Promise[];
  allFriends: User[];
  onClose: () => void;
  onChange: (amount: number) => void;
  onSubmit: () => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  amount,
  loading,
  promises,
  allFriends,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make Payment</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Distribution preview:
          </Typography>
          {promises.map((promise) => (
            <Box
              key={promise.id}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="body2">
                {allFriends.find((f) => f.id === promise.receiver)?.name ||
                  promise.receiver}
              </Typography>
              <Typography variant="body2">
                {(amount * (promise.amount / 100)).toLocaleString()}{' '}
                ({promise.amount}%)
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          disabled={loading || amount <= 0}
          variant="contained"
        >
          {loading ? <CircularProgress size={24} /> : 'Pay'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
