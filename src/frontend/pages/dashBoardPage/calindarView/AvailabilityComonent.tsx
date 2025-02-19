import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

// Types based on Candid definition
interface TimeSlot {
  start_time: bigint;
  end_time: bigint;
}

interface Availability {
  id: string;
  title: [] | [string];
  is_blocked: boolean;
  schedule_type: ScheduleType;
  time_slots: TimeSlot[];
}

interface ScheduleType {
  WeeklyRecurring?: {
    days: number[];
    valid_until: [] | [number];
  };
}

interface RootState {
  calendarState: {
    calendar: {
      availabilities: Availability[];
    };
  };
}

// Utility functions
const formatTime = (time: bigint): string => {
  const date = new Date(Number(time) / 1000); // Convert microseconds to milliseconds
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const parseTime = (timeStr: string): bigint => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return BigInt(date.getTime() * 1000); // Convert to microseconds
};

const formatDays = (days: number[] | Uint32Array) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Convert Uint32Array to regular array and ensure numbers are 0-based for array indexing
  const daysArray = Array.from(days).map((day) => dayNames[day - 1]);
  return daysArray.join(", ");
};

// Custom hooks
const useAvailabilityDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);

  const handleOpen = (availability: Availability) => {
    setSelectedAvailability(availability);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAvailability(null);
  };

  return {
    open,
    selectedAvailability,
    handleOpen,
    handleClose,
  };
};

const useAvailabilityMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl,
    handleOpen,
    handleClose,
  };
};

// Components
const AvailabilityDialog: React.FC<{
  open: boolean;
  availability: Availability | null;
  onClose: () => void;
  onUpdate: (availability: Availability) => void;
  onDelete: (id: string) => void;
}> = ({ open, availability, onClose, onUpdate, onDelete }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState<Availability | null>(availability);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    setFormData(availability);
  }, [availability]);

  const handleUpdate = () => {
    if (formData) {
      onUpdate(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (formData) {
      onDelete(formData.id);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      {showDeleteConfirm ? (
        <>
          <DialogTitle>Delete Availability</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this availability? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Edit Availability</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Title"
                value={formData.title[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: [e.target.value],
                  })
                }
                fullWidth
              />
              {formData.schedule_type.WeeklyRecurring && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Days</InputLabel>
                    <Select
                      multiple
                      value={Array.from(
                        formData.schedule_type.WeeklyRecurring.days,
                      )}
                      onChange={(e) => {
                        const days = e.target.value as number[];
                        setFormData({
                          ...formData,
                          schedule_type: {
                            WeeklyRecurring: {
                              ...formData.schedule_type.WeeklyRecurring,
                              days: days,
                            },
                          },
                        });
                      }}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {(selected as number[]).map((day) => (
                            <Chip
                              key={day}
                              label={
                                [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ][day - 1]
                              }
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <MenuItem key={day} value={day}>
                          {
                            [
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ][day - 1]
                          }
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {formData.time_slots.map((slot, index) => (
                    <Stack key={index} direction="row" spacing={2}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={formatTime(slot.start_time)}
                        onChange={(e) => {
                          const newSlots = [...formData.time_slots];
                          newSlots[index] = {
                            ...slot,
                            start_time: parseTime(e.target.value),
                          };
                          setFormData({ ...formData, time_slots: newSlots });
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="End Time"
                        type="time"
                        value={formatTime(slot.end_time)}
                        onChange={(e) => {
                          const newSlots = [...formData.time_slots];
                          newSlots[index] = {
                            ...slot,
                            end_time: parseTime(e.target.value),
                          };
                          setFormData({ ...formData, time_slots: newSlots });
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirm(true)} color="error">
              Delete
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

// Main component
const CalendarManagement: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { calendar } = useSelector((state: RootState) => state.calendarState);
  console.log({ calendar });
  const {
    open: dialogOpen,
    selectedAvailability,
    handleOpen: handleDialogOpen,
    handleClose: handleDialogClose,
  } = useAvailabilityDialog();

  const {
    anchorEl,
    handleOpen: handleMenuOpen,
    handleClose: handleMenuClose,
  } = useAvailabilityMenu();

  const handleUpdateAvailability = (updatedAvailability: Availability) => {
    dispatch({
      type: "UPDATE_AVAILABILITY",
      availability: updatedAvailability,
    });
  };

  const handleDeleteAvailability = (id: string) => {
    dispatch({
      type: "DELETE_AVAILABILITY",
      id,
    });
  };

  const formatTimeSlots = (slots: TimeSlot[]) => {
    return slots
      .map(
        (slot) =>
          `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
      )
      .join(", ");
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={isMenuOpen ? handleMenuClose : handleMenuOpen}
        sx={{
          minWidth: "auto",
          px: 2,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        {isMenuOpen ? <CloseIcon fontSize="small" /> : "Availabilities"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {calendar.availabilities.map((availability) => (
          <MenuItem
            key={availability.id}
            onClick={() => {
              handleDialogOpen(availability);
              handleMenuClose();
            }}
            sx={{ minWidth: 250 }}
          >
            <Stack direction="row" alignItems="center" spacing={1} width="100%">
              <Typography noWrap>
                {availability.title[0] || "Untitled"}
                {availability.schedule_type.WeeklyRecurring && (
                  <Typography component="span" color="text.secondary">
                    {" • "}
                    {formatDays(
                      Array.from(
                        availability.schedule_type.WeeklyRecurring.days,
                      ),
                    )}
                    {" • "}
                    {formatTimeSlots(availability.time_slots)}
                  </Typography>
                )}
              </Typography>
              {availability.is_blocked && (
                <DoNotDisturbIcon color="error" fontSize="small" />
              )}
            </Stack>
          </MenuItem>
        ))}
      </Menu>

      <AvailabilityDialog
        open={dialogOpen}
        availability={selectedAvailability}
        onClose={handleDialogClose}
        onUpdate={handleUpdateAvailability}
        onDelete={handleDeleteAvailability}
      />
    </>
  );
};

export default CalendarManagement;
