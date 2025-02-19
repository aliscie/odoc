import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  Box,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
  ButtonGroup,
  Typography,
} from "@mui/material";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarManagement from "./AvailabilityComonent";

const useCalendarStyles = (isDark) => ({
  ".rbc-calendar": {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    border: "none",
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  ".rbc-header": {
    padding: "8px 4px",
    fontWeight: "500",
    fontSize: "0.9rem",
    backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
    color: isDark ? "#ffffff" : "#1a1a1a",
    borderBottom: isDark
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
    height: "36px",
    "& span": {
      display: "block",
      textAlign: "center",
    },
  },
  ".rbc-header + .rbc-header": {
    borderLeft: isDark
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
  },
  ".rbc-time-view": {
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  ".rbc-time-header": {
    backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
    borderBottom: isDark
      ? "2px solid rgba(255, 255, 255, 0.12)"
      : "2px solid rgba(0, 0, 0, 0.12)",
  },
  ".rbc-time-content": {
    border: "none",
    "& > * + * > *": {
      borderLeft: isDark
        ? "1px solid rgba(255, 255, 255, 0.08)"
        : "1px solid rgba(0, 0, 0, 0.08)",
    },
  },
  ".rbc-timeslot-group": {
    borderBottom: "none",
    minHeight: "80px",
  },
  ".rbc-time-content > * + * > *": {
    borderLeft: isDark
      ? "1px solid rgba(255, 255, 255, 0.04)"
      : "1px solid rgba(0, 0, 0, 0.08)",
  },
  ".rbc-time-gutter": {
    color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    fontSize: "0.85rem",
    fontWeight: "500",
    padding: "0 12px",
  },
  ".rbc-time-slot": {
    color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
  },
  ".rbc-event": {
    padding: "6px 8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    border: "none",
    borderRadius: "6px",
    backgroundColor: isDark ? "#5856D6" : "#4845d6",
    boxShadow: isDark
      ? "0 2px 4px rgba(0, 0, 0, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: isDark
        ? "0 4px 8px rgba(0, 0, 0, 0.3)"
        : "0 4px 8px rgba(0, 0, 0, 0.15)",
    },
  },
  ".rbc-today": {
    backgroundColor: isDark ? "#2C1F2D" : "#FFE5E5",
  },
  ".rbc-time-header-cell.rbc-today": {
    backgroundColor: isDark ? "#3D2B3D" : "#FFD6D6",
  },
  ".rbc-current-time-indicator": {
    backgroundColor: isDark ? "#FF2D55" : "#FF3B30",
    height: "2px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "-5px",
      top: "-3px",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "inherit",
    },
  },
  ".rbc-toolbar": {
    marginBottom: "24px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: isDark ? "#2d2d2d" : "#f8f9fa",
  },
  ".rbc-toolbar button": {
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    color: isDark ? "#fff" : "#000",
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)",
    },
    "&:active, &.rbc-active": {
      backgroundColor: isDark ? "#9f006a" : "#ff0bae",
      color: "#fff",
      "&:hover": {
        backgroundColor: isDark ? "#0fa259" : "#18ff00",
      },
    },
  },
  // Out of range dates styling
  ".rbc-off-range-bg": {
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(0, 0, 0, 0.02)",
  },
  ".rbc-off-range": {
    color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
  },
});
const CustomToolbar = (toolbar) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const navigate = (action) => {
    toolbar.onNavigate(action);
  };

  const viewNames = toolbar.views;
  const view = toolbar.view;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 3, px: 2 }}
    >
      {/* Navigation Buttons */}
      <ButtonGroup variant="contained" size="small">
        <CalendarManagement />
        <Button onClick={() => navigate("TODAY")}>Today</Button>
        <Button onClick={() => navigate("PREV")}>Back</Button>
        <Button onClick={() => navigate("NEXT")}>Next</Button>
      </ButtonGroup>

      {/* Current Date Display */}
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        {toolbar.label}
      </Typography>

      {/* View Selection Buttons */}
      <ButtonGroup variant="contained" size="small">
        {viewNames.map((name) => (
          <Button
            key={name}
            onClick={() => toolbar.onView(name)}
            variant={view === name ? "contained" : "outlined"}
            sx={{
              bgcolor: view === name ? "primary.main" : "transparent",
              "&:hover": {
                bgcolor: view === name ? "primary.dark" : "action.hover",
              },
            }}
          >
            {name}
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
};

const EventDialog = ({ open, onClose, slotInfo, onSubmit }) => {
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

  const handleSubmit = () => {
    const newEvent = {
      id: Math.random().toString(),
      title: eventData.title,
      description: eventData.description,
      start_time: slotInfo.start.getTime() * 1e6, // Convert to nanoseconds
      end_time: slotInfo.end.getTime() * 1e6, // Convert to nanoseconds
      date: new Date().getTime(),
      attendees: eventData.attendees,
      recurrence: showRecurrence ? [eventData.recurrence] : [],
      owner: "current_user",
      created_by: "current_user",
    };

    onSubmit(newEvent);
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
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Event</DialogTitle>
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
                "yyyy-MM-dd'T'HH:mm",
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowRecurrence(!showRecurrence)}
          color="primary"
        >
          {showRecurrence ? "Hide Recurrence" : "Add Recurrence"}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CalendarView = ({ calendar }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const locales = { "en-US": enUS };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const events = useMemo(() => {
    if (!calendar?.events) return [];
    const colors = [
      "#FF2D55",
      "#5856D6",
      "#007AFF",
      "#5AC8FA",
      "#4CD964",
      "#FF9500",
    ];

    return calendar.events.map((event, index) => {
      // Convert nanoseconds to milliseconds (divide by 1e6)
      const startMs = Number(event.start_time) / 1e6;
      const endMs = Number(event.end_time) / 1e6;

      // Create Date objects (these will be in local timezone)
      const start = new Date(startMs);
      const end = new Date(endMs);

      return {
        ...event,
        start,
        end,
        color: colors[index % colors.length],
      };
    });
  }, [calendar]);

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      if (slotInfo.action === "click" && calendar?.view === "month") {
        setCurrentDate(slotInfo.start);
        return;
      }
      setSelectedSlot(slotInfo);
      setShowEventDialog(true);
    },
    [calendar?.view],
  );

  const handleAddEvent = useCallback(
    (newEvent) => {
      if (calendar?.onAddEvent) {
        calendar.onAddEvent(newEvent);
      }
    },
    [calendar],
  );

  const eventStyleGetter = useCallback(
    (event) => ({
      style: {
        // backgroundColor: event.color,
        opacity: 0.9,
      },
    }),
    [],
  );

  const views = isMobile ? ["month", "week"] : ["month", "week"];

  const components = {
    toolbar: CustomToolbar,
  };

  return (
    <Box
      sx={{
        height: isMobile ? "500px" : "700px",
        p: isMobile ? 1 : 2,
        ...useCalendarStyles(isDark),
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onNavigate={setCurrentDate}
        date={currentDate}
        eventPropGetter={eventStyleGetter}
        components={components}
        selectable
        popup={false}
        views={views}
        defaultView="month"
        toolbar={true}
        step={30}
        timeslots={2}
        showMultiDayTimes
        getNow={() => new Date()}
        dayLayoutAlgorithm="no-overlap"
        onSelectSlot={handleSelectSlot}
      />

      <EventDialog
        open={showEventDialog}
        onClose={() => {
          setShowEventDialog(false);
          setSelectedSlot(null);
        }}
        slotInfo={selectedSlot}
        onSubmit={handleAddEvent}
      />
    </Box>
  );
};

export default CalendarView;
