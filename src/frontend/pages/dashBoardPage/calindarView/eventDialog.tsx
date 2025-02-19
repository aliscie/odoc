import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  Box, Button,
  Dialog, DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel, MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import format from "date-fns/format";

const EventDialog = ({ open, onClose, slotInfo, selectedEvent = null }) => {
  const isEditMode = Boolean(selectedEvent);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    recurrence: {
      frequency: "Weekly",
      interval: 1,
      count: null,
      until: null,
    },
    attendees: [],
  });
  const [showRecurrence, setShowRecurrence] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setEventData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        recurrence: selectedEvent.recurrence[0] || {
          frequency: "Weekly",
          interval: 1,
          count: null,
          until: null,
        },
        attendees: selectedEvent.attendees,
      });
      setShowRecurrence(selectedEvent.recurrence.length > 0);
    } else {
      setEventData({
        title: "",
        description: "",
        recurrence: {
          frequency: "Weekly",
          interval: 1,
          count: null,
          until: null,
        },
        attendees: [],
      });
      setShowRecurrence(false);
    }
  }, [selectedEvent]);

  const handleChange = (field) => (event) => {
    setEventData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRecurrenceChange = (field) => (event) => {
    setEventData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [field]: event.target.value,
      },
    }));
  };

  const dispatch = useDispatch();

  const handleSubmit = () => {
    const eventPayload = {
      id: selectedEvent?.id || Math.random().toString(),
      title: eventData.title,
      description: eventData.description,
      start_time: slotInfo.start.getTime() * 1e6,
      end_time: slotInfo.end.getTime() * 1e6,
      date: new Date().getTime(),
      attendees: eventData.attendees,
      recurrence: showRecurrence ? [eventData.recurrence] : [],
      owner: "current_user",
      created_by: "current_user",
    };

    if (isEditMode) {
      dispatch({ type: "UPDATE_EVENT", event: eventPayload });
    } else {
      dispatch({ type: "ADD_EVENT", event: eventPayload });
    }

    handleClose();
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_EVENT", eventId: selectedEvent.id });
    handleClose();
  };

  const handleClose = () => {
    setEventData({
      title: "",
      description: "",
      recurrence: {
        frequency: "Weekly",
        interval: 1,
        count: null,
        until: null,
      },
      attendees: [],
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <Dialog open={open} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Update Event" : "Create New Event"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Event Title"
            fullWidth
            value={eventData.title}
            onChange={handleChange("title")}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={eventData.description}
            onChange={handleChange("description")}
          />

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Start Time"
              type="datetime-local"
              value={format(
                slotInfo?.start || new Date(),
                "yyyy-MM-dd'T'HH:mm"
              )}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <TextField
              label="End Time"
              type="datetime-local"
              value={format(slotInfo?.end || new Date(), "yyyy-MM-dd'T'HH:mm")}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Box>

          {showRecurrence && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={eventData.recurrence.frequency}
                  onChange={handleRecurrenceChange("frequency")}
                  label="Frequency"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Interval"
                type="number"
                value={eventData.recurrence.interval}
                onChange={handleRecurrenceChange("interval")}
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>
          )}

          <TextField
            label="Attendees"
            placeholder="Enter email addresses separated by commas"
            fullWidth
            value={eventData.attendees.join(", ")}
            onChange={(e) => {
              const emails = e.target.value
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean);
              setEventData((prev) => ({
                ...prev,
                attendees: emails,
              }));
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowRecurrence(!showRecurrence)}
          color="primary"
        >
          {showRecurrence ? "Hide Recurrence" : "Add Recurrence"}
        </Button>
        {isEditMode && (
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            color="error"
          >
            Delete
          </Button>
        )}
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {isEditMode ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
