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
} from "@mui/material";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const macOSStyle = (isDark) => ({
  ".rbc-calendar": {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
    border: "none",
  },
  ".rbc-header": {
    padding: "12px 4px",
    fontWeight: "500",
    fontSize: "0.9rem",
    backgroundColor: "transparent",
    color: isDark ? "#ffffff" : "#1d1d1f",
    borderBottom: `1px solid ${isDark ? "#3d3d3d" : "#e5e5e5"}`,
  },
  ".rbc-month-view": {
    border: "none",
    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
  },
  ".rbc-time-view": {
    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
    border: "none",
    borderRadius: "8px",
    overflow: "hidden",
  },
  ".rbc-time-header": {
    backgroundColor: isDark ? "#2c2c2e" : "#ffffff",
    border: "none",
  },
  ".rbc-time-header-content": {
    border: "none",
    borderLeft: `1px solid ${isDark ? "#3d3d3d" : "#e5e5e5"}`,
  },
  ".rbc-time-content": {
    border: "none",
    borderTop: `1px solid ${isDark ? "#3d3d3d" : "#e5e5e5"}`,
  },
  ".rbc-timeslot-group": {
    borderBottom: `1px solid ${isDark ? "#2c2c2e" : "#f5f5f7"}`,
  },
  ".rbc-current-time-indicator": {
    backgroundColor: isDark ? "#FF2D55" : "#FF3B30",
    height: "2px",
    zIndex: 3,
    position: "absolute",
    right: 0,
    left: 0,
    "&::before": {
      content: '""',
      position: "absolute",
      left: "-6px",
      top: "-4px",
      width: "10px",
      height: "10px",
      backgroundColor: "inherit",
      borderRadius: "50%",
    },
  },
  ".rbc-time-slot": {
    color: isDark ? "#8e8e93" : "#86868b",
    border: "none",
  },
  ".rbc-time-gutter": {
    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
  },
  ".rbc-time-content > * + * > *": {
    borderLeft: `1px solid ${isDark ? "#3d3d3d" : "#e5e5e5"}`,
  },
  ".rbc-day-bg": {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: isDark ? "#2c2c2e" : "#f5f5f7",
    },
  },
  ".rbc-today": {
    backgroundColor: isDark ? "#2c2c2e" : "#f5f5f7",
  },
  ".rbc-event": {
    padding: "2px 4px",
    fontSize: "0.85rem",
    fontWeight: "500",
    border: "none",
    borderRadius: "4px",
    "&:hover": {
      transform: "scale(1.02)",
      transition: "transform 0.2s ease",
    },
  },
  ".rbc-event.rbc-selected": {
    backgroundColor: "inherit",
    outline: `2px solid ${isDark ? "#ffffff" : "#000000"}`,
  },
  ".rbc-toolbar": {
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: isDark ? "#2c2c2e" : "#f5f5f7",
    borderRadius: "10px",
    border: "none",
  },
  ".rbc-toolbar button": {
    color: isDark ? "#ffffff" : "#1d1d1f",
    border: "none",
    backgroundColor: "transparent",
    padding: "8px 12px",
    borderRadius: "6px",
    fontWeight: "500",
    "&:hover": {
      backgroundColor: isDark ? "#3d3d3d" : "#e5e5e5",
    },
    "&.rbc-active": {
      backgroundColor: isDark ? "#3d3d3d" : "#e5e5e5",
      boxShadow: "none",
    },
  },
  ".rbc-time-header .rbc-header.rbc-today": {
    backgroundColor: isDark ? "#2c2c2e" : "#f5f5f7",
    color: isDark ? "#FF2D55" : "#FF3B30",
    fontWeight: "bold",
  },
  ".rbc-time-content .rbc-today": {
    backgroundColor: isDark ? "#2c2c2e" : "#f5f5f7",
  },
  ".rbc-time-column": {
    backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
  },
  ".rbc-day-slot .rbc-time-slot": {
    borderTop: `1px solid ${isDark ? "#2c2c2e" : "#f5f5f7"}`,
  },
  ".rbc-off-range-bg": {
    backgroundColor: isDark ? "#161618" : "#fafafa",
  },
  ".rbc-off-range": {
    color: isDark ? "#666668" : "#bfbfbf",
  },
  ".rbc-date-cell": {
    padding: "8px",
    fontSize: "0.9rem",
    fontWeight: "400",
    color: isDark ? "#8e8e93" : "#86868b",
  },
  ".rbc-month-row": {
    borderTop: `1px solid ${isDark ? "#3d3d3d" : "#e5e5e5"}`,
  },
  ".rbc-day-bg + .rbc-day-bg": {
    borderLeft: `1px solid ${isDark ? "#3d3d3d" : "#e5e5e5"}`,
  },
});
const TimeIndicator = () => {
  const [time, setTime] = useState(new Date());
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutesSinceMidnight = time.getHours() * 60 + time.getMinutes();
  const percentageOfDay = (minutesSinceMidnight / 1440) * 100;

  return (
    <div
      style={{
        position: "absolute",
        left: "-5px",
        top: `calc(${percentageOfDay}% - 12px)`,
        width: "65px",
        height: "24px",
        backgroundColor: isDark ? "#FF2D55" : "#FF3B30",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "11px",
        fontWeight: "bold",
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {format(time, "HH:mm:ss")}
    </div>
  );
};
const CalendarView = ({ calendar }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [blockedTimes, setBlockedTimes] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const EventDialog = ({ open, onClose, slotInfo }) => {
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");

    const handleSubmit = () => {
      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        start: slotInfo.start,
        end: slotInfo.end,
        color: "#FF2D55",
      };

      handleAddEvent(newEvent);
      onClose();
      setEventTitle("");
      setEventDescription("");
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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

    return calendar.events.map((event, index) => ({
      ...event,
      color: colors[index % colors.length],
    }));
  }, [calendar]);

  const isTimeBlocked = useCallback(
    (start, end) => {
      return blockedTimes.some(
        (blockedTime) =>
          (start >= blockedTime.start && start < blockedTime.end) ||
          (end > blockedTime.start && end <= blockedTime.end),
      );
    },
    [blockedTimes],
  );

  const isTimeAvailable = useCallback(
    (start, end) => {
      return !events.some(
        (event) =>
          (start >= new Date(event.start) && start < new Date(event.end)) ||
          (end > new Date(event.start) && end <= new Date(event.end)),
      );
    },
    [events],
  );

  const slotPropGetter = useCallback(
    (date) => {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(end.getHours() + 1);

      if (isTimeBlocked(start, end)) {
        return {
          style: {
            backgroundColor: isDark
              ? "rgba(255, 45, 85, 0.2)"
              : "rgba(255, 59, 48, 0.1)",
          },
        };
      }

      if (isTimeAvailable(start, end)) {
        return {
          style: {
            // backgroundColor: isDark
            //   ? "rgba(76, 217, 100, 0.2)"
            //   : "rgba(52, 199, 89, 0.1)",
          },
        };
      }

      return {};
    },
    [isTimeBlocked, isTimeAvailable, isDark],
  );

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      if (!isTimeBlocked(slotInfo.start, slotInfo.end)) {
        setSelectedSlot(slotInfo);
        setShowEventDialog(true);
      }
    },
    [isTimeBlocked],
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
        backgroundColor: event.color,
        opacity: 0.9,
      },
    }),
    [],
  );

  const components = {
    timeGutterHeader: () => (
      <div style={{ position: "relative", height: "100%" }}>
        <TimeIndicator />
      </div>
    ),
  };

  const defaultView = isMobile ? "day" : "month";
  const views = isMobile
    ? ["day", "agenda"]
    : isTablet
      ? ["month", "week", "day"]
      : ["month", "week", "day", "agenda"];

  return (
    <Box
      sx={{
        height: isMobile ? "500px" : "700px",
        p: isMobile ? 1 : 2,
        ...macOSStyle(isDark),
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
        slotPropGetter={slotPropGetter}
        components={components}
        selectable
        popup
        views={views}
        defaultView={defaultView}
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
      />
    </Box>
  );
};

export default CalendarView;
