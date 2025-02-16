import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import { Unavailability } from './types';
import { formatDate } from './utils';

interface UnavailabilityCardProps {
  unavailability: Unavailability;
  onDelete: () => void;
}

const UnavailabilityCard: React.FC<UnavailabilityCardProps> = ({
  unavailability,
  onDelete,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDateDescription = (): string => {
    if (isSameDay(unavailability.startDate, unavailability.endDate)) {
      return formatDate(unavailability.startDate);
    }
    return `${formatDate(unavailability.startDate)} - ${formatDate(unavailability.endDate)}`;
  };

  const getTimeDescription = (): string => {
    return `${formatTime(unavailability.startTime)} - ${formatTime(unavailability.endTime)}`;
  };

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          backgroundColor: alpha(theme.palette.error.main, 0.05),
          '&:hover': {
            boxShadow: theme.shadows[4],
            backgroundColor: alpha(theme.palette.error.main, 0.08),
          },
          transition: 'all 0.3s ease',
          border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <BlockIcon
              sx={{
                mr: 1,
                color: theme.palette.error.main,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontWeight: 'medium',
                  color: theme.palette.error.main,
                }}
              >
                {getDateDescription()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <AccessTimeIcon
                  sx={{
                    fontSize: '1rem',
                    mr: 0.5,
                    color: theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {getTimeDescription()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            pb: 1,
            px: 2,
          }}
        >
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Unavailability</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this unavailability period?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {getDateDescription()}
              <br />
              {getTimeDescription()}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDelete();
              setDeleteDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UnavailabilityCard;
