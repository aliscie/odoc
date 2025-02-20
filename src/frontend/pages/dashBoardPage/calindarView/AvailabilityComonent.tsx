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
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import AddIcon from "@mui/icons-material/Add";
import { formatTime, parseTime } from "./serializers";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import EnhancedTimePicker from "./timePicker";

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
const formatDays = (days: number[] | Uint32Array) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysArray = Array.from(days).map((day) => dayNames[day - 1]);
  return daysArray.join(", ");
};

const createEmptyAvailability = (): Availability => ({
  id: Math.random().toString(),
  title: [""],
  is_blocked: false,
  schedule_type: {
    WeeklyRecurring: {
      days: [1], // Monday by default
      valid_until: [],
    },
  },
  time_slots: [
    {
      start_time: BigInt(9 * 60 * 60 * 1000000000), // 9 AM
      end_time: BigInt(17 * 60 * 60 * 1000000000), // 5 PM
    },
  ],
});

// Custom hooks
const useAvailabilityDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleOpen = (availability?: Availability) => {
    if (availability) {
      setSelectedAvailability(availability);
      setIsCreating(false);
    } else {
      setSelectedAvailability(createEmptyAvailability());
      setIsCreating(true);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAvailability(null);
    setIsCreating(false);
  };

  return {
    open,
    selectedAvailability,
    isCreating,
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
  isCreating: boolean;
  onClose: () => void;
  onUpdate: (availability: Availability) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}> = ({
  open,
  availability,
  isCreating,
  onClose,
  onUpdate,
  onDelete,
  readOnly = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState<Availability | null>(availability);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    setFormData(availability);
  }, [availability]);

  const handleSubmit = () => {
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
          <DialogTitle>
            {isCreating ? "Create Availability" : "Edit Availability"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                disabled={readOnly}
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

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_blocked}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_blocked: e.target.checked,
                      })
                    }
                  />
                }
                disabled={readOnly}
                label="Block this time slot"
              />

              {formData.schedule_type.WeeklyRecurring && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Days</InputLabel>
                    <Select
                      disabled={readOnly}
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
                      <EnhancedTimePicker
                        disabled={readOnly}
                        label="Start Time"
                        defaultValue={Number(slot.start_time)}
                        onChange={(value) => {
                          const newSlots = [...formData.time_slots];
                          newSlots[index] = {
                            ...slot,
                            start_time: BigInt(value || 0),
                          };
                          setFormData({
                            ...formData,
                            time_slots: newSlots,
                          });
                        }}
                        sx={{ width: 150 }}
                      />
                      <EnhancedTimePicker
                        disabled={readOnly}
                        label="End Time"
                        defaultValue={Number(slot.end_time)}
                        onChange={(value) => {
                          const newSlots = [...formData.time_slots];
                          newSlots[index] = {
                            ...slot,
                            end_time: BigInt(value || 0),
                          };
                          setFormData({
                            ...formData,
                            time_slots: newSlots,
                          });
                        }}
                        sx={{ width: 150 }}
                      />
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            {!isCreating && !readOnly && (
              <Button onClick={() => setShowDeleteConfirm(true)} color="error">
                Delete
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button onClick={onClose}>Close</Button>
            {!readOnly && (
              <Button onClick={handleSubmit} variant="contained">
                {isCreating ? "Create" : "Save"}
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

// Main component
const CalendarManagement: React.FC = () => {
  const { profile } = useSelector((state: any) => state.filesState);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { calendar } = useSelector((state: RootState) => state.calendarState);

  const isOwner = calendar?.owner === profile?.id;

  const {
    open: dialogOpen,
    selectedAvailability,
    isCreating,
    handleOpen: handleDialogOpen,
    handleClose: handleDialogClose,
  } = useAvailabilityDialog();

  const {
    anchorEl,
    handleOpen: handleMenuOpen,
    handleClose: handleMenuClose,
  } = useAvailabilityMenu();

  const handleUpdateAvailability = (updatedAvailability: Availability) => {
    console.log({ updatedAvailability });
    dispatch({
      type: isCreating ? "ADD_AVAILABILITY" : "UPDATE_AVAILABILITY",
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
          `${formatTime(slot.start_time, true)} - ${formatTime(slot.end_time, true)}`,
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
        {isOwner && (
          <>
            <MenuItem
              onClick={() => {
                handleDialogOpen();
                handleMenuClose();
              }}
              sx={{
                minWidth: 250,
                color: theme.palette.primary.main,
              }}
            >
              <AddIcon sx={{ mr: 1 }} /> Add New Availability
            </MenuItem>
            <Divider />
          </>
        )}

        <Divider />

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
                {availability.is_blocked && <DoNotDisturbIcon color="error" />}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>

      <AvailabilityDialog
        open={dialogOpen}
        availability={selectedAvailability}
        isCreating={isCreating}
        onClose={handleDialogClose}
        onUpdate={handleUpdateAvailability}
        onDelete={handleDeleteAvailability}
        readOnly={!isOwner}
      />
    </>
  );
};

export default CalendarManagement;
