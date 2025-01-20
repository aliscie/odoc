import React, { useMemo, useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Box, useTheme } from "@mui/material";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SAMPLE_TASKS } from "./boardView";

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

  // Calculate position based on current time
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

const CalendarView = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const events = useMemo(() => {
    const colors = [
      "#FF2D55", // Red
      "#5856D6", // Purple
      "#007AFF", // Blue
      "#5AC8FA", // Light Blue
      "#4CD964", // Green
      "#FF9500", // Orange
    ];

    return SAMPLE_TASKS.map((task, index) => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      color: colors[index % colors.length],
    }));
  }, []);

  const components = {
    timeGutterHeader: () => {
      return (
        <div style={{ position: "relative", height: "100%" }}>
          <TimeIndicator />
        </div>
      );
    },
  };

  const macOSStyle = {
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
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        opacity: 0.9,
      },
    };
  };

  return (
    <Box
      sx={{
        height: "700px",
        p: 2,
        ...macOSStyle,
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
        popup
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        toolbar={true}
        step={30}
        timeslots={2}
        showMultiDayTimes
        getNow={() => new Date()}
        dayLayoutAlgorithm="no-overlap"
      />
    </Box>
  );
};

export default CalendarView;
