import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import format from "date-fns/format";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { microsecondsToDate } from "./serializers";
import EventDialog from "./EventDialog";
import CustomToolbar from "./toolsBar";
import useCalendarStyles from "./style";

const CalendarView = ({ calendar }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("calendarView") || "month";
  });
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    localStorage.setItem("calendarView", currentView);
  }, [currentView]);

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

    return calendar.events.map((event, index) => ({
      ...event,
      start: microsecondsToDate(event.start_time),
      end: microsecondsToDate(event.end_time),
      color: colors[index % colors.length],
    }));
  }, [calendar]);

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      if (slotInfo.action === "click" && calendar?.view === "month") {
        setCurrentDate(slotInfo.start);
        return;
      }
      setSelectedSlot(slotInfo);
      setSelectedEvent(null);
      setShowEventDialog(true);
    },
    [calendar?.view],
  );

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setSelectedSlot({
      start: event.start,
      end: event.end,
    });
    setShowEventDialog(true);
  }, []);

  const eventStyleGetter = useCallback(
    (event) => ({
      style: {
        backgroundColor: event.color,
        opacity: 0.9,
      },
    }),
    [],
  );

  const handleCloseDialog = useCallback(() => {
    setShowEventDialog(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  }, []);

  const views = isMobile ? ["month", "week"] : ["month", "week"];
  const components = { toolbar: CustomToolbar };

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
        defaultView={currentView}
        onView={setCurrentView}
        toolbar={true}
        step={30}
        timeslots={2}
        showMultiDayTimes
        getNow={() => new Date()}
        dayLayoutAlgorithm="no-overlap"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

      <EventDialog
        open={showEventDialog}
        onClose={handleCloseDialog}
        slotInfo={selectedSlot}
        selectedEvent={selectedEvent}
      />
    </Box>
  );
};

export default CalendarView;
