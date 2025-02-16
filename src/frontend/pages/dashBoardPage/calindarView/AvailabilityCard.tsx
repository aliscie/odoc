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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EventIcon from '@mui/icons-material/Event';
import { Availability, Day } from './types';
import { formatDate } from './utils';

interface AvailabilityCardProps {
  availability: Availability;
  onEdit: () => void;
  onDelete: () => void;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  availability,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDays = (days: Day[]): string => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].every(day => days.includes(day as Day))) {
      return 'Weekdays';
    }
    if (days.length === 2 && ['Sat', 'Sun'].every(day => days.includes(day as Day))) {
      return 'Weekends';
    }
    return days.join(', ');
  };

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

  const getAvailabilityDescription = (): string => {
    if (availability.type === 'recurring') {
      return `${formatDays(availability.days || [])}`;
    } else {
      return `${formatDate(availability.startDate!)} - ${formatDate(availability.endDate!)}`;
    }
  };

  const getTimeDescription = (): string => {
    return `${formatTime(availability.startTime)} - ${formatTime(availability.endTime)}`;
  };

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          '&:hover': {
            boxShadow: theme.shadows[4],
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            {availability.type === 'recurring' ? (
              <EventRepeatIcon
                sx={{
                  mr: 1,
                  color: theme.palette.primary.main,
                }}
              />
            ) : (
              <EventIcon
                sx={{
                  mr: 1,
                  color: theme.palette.primary.main,
                }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ fontWeight: 'medium' }}
              >
                {getAvailabilityDescription()}
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
              {availability.exclusions?.length ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontStyle: 'italic' }}
                >
                  Excludes holidays
                </Typography>
              ) : null}
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
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
        <DialogTitle>Delete Availability</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this availability?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {getAvailabilityDescription()}
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

export default AvailabilityCard;
