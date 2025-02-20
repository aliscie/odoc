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
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";

function getAvailabilityTimeSpan(availabilities) {
  let earliestAvailability = new Date();
  earliestAvailability.setHours(23, 59, 0, 0);
  let latestAvailability = new Date();
  latestAvailability.setHours(0, 0, 0, 0);

  const getTimeFromNano = (nanoStr) => {
    const date = new Date(Number(nanoStr) / 1000000);
    return new Date(0, 0, 0, date.getHours(), date.getMinutes(), 0);
  };

  availabilities.forEach((availability) => {
    availability.time_slots.forEach((slot) => {
      const startTime = getTimeFromNano(slot.start_time);
      const endTime = getTimeFromNano(slot.end_time);

      if (startTime < earliestAvailability) {
        earliestAvailability = startTime;
      }
      if (endTime > latestAvailability) {
        latestAvailability = endTime;
      }
    });
  });

  return { earliestAvailability, latestAvailability };
}

function getTimeSpan(calendar) {
  // Initialize with current date (not just time)
  const today = new Date();
  let earliestStart = new Date(today);
  earliestStart.setHours(23, 59, 0, 0);
  let latestEnd = new Date(today);
  latestEnd.setHours(0, 0, 0, 0);

  // Helper to get time while preserving the current date
  const getTimeFromNano = (nanoStr) => {
    const date = new Date(Number(nanoStr) / 1000000);
    const result = new Date(today); // Use today's date
    result.setHours(date.getHours(), date.getMinutes(), 0);
    return result;
  };

  // Process availabilities
  if (calendar?.availabilities) {
    calendar.availabilities.forEach((availability) => {
      availability.time_slots.forEach((slot) => {
        const startTime = getTimeFromNano(slot.start_time);
        const endTime = getTimeFromNano(slot.end_time);

        if (startTime < earliestStart) {
          earliestStart = startTime;
        }
        if (endTime > latestEnd) {
          latestEnd = endTime;
        }
      });
    });
  }

  return { earliestStart, latestEnd };
}
const CalendarView = () => {
  const { calendar } = useSelector((state: RootState) => state.calendarState);
  const { earliestStart, latestEnd } = getTimeSpan(calendar);
  const availabilities = calendar?.availabilities || [];

  const { profile } = useSelector((state: any) => state.filesState);
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

  const TimeSlotWrapper = useCallback(
    ({ children, value }) => {
      // Get availability time spans
      // const { earliestAvailability, latestAvailability } = useMemo(
      //   () => getAvailabilityTimeSpan(availabilities),
      //   [availabilities],
      // );

      // Check if the time slot is in the past
      const isPastTimeSlot = value < new Date();

      const isWithinWeeklySchedule = (date, availability) => {
        if (availability.schedule_type.WeeklyRecurring) {
          const dayOfWeek = date.getDay();
          const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
          return (
            availability.schedule_type.WeeklyRecurring.days[adjustedDay - 1] !==
            undefined
          );
        }
        return false;
      };

      const isWithinTimeSlot = (date, timeSlot) => {
        const slotStart = new Date(Number(timeSlot.start_time) / 1000000);
        const slotEnd = new Date(Number(timeSlot.end_time) / 1000000);

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const currentTime = new Date(0, 0, 0, hours, minutes, 0);

        return (
          currentTime >=
            new Date(
              0,
              0,
              0,
              slotStart.getHours(),
              slotStart.getMinutes(),
              0,
            ) &&
          currentTime <
            new Date(0, 0, 0, slotEnd.getHours(), slotEnd.getMinutes(), 0)
        );
      };

      const getSlotStatus = () => {
        if (isPastTimeSlot) return "past";

        let foundStatus = "none";

        for (const availability of availabilities) {
          const isCorrectDay = isWithinWeeklySchedule(value, availability);
          const isInTimeSlot = availability.time_slots.some((slot) =>
            isWithinTimeSlot(value, slot),
          );

          if (isCorrectDay && isInTimeSlot) {
            if (availability.is_blocked) {
              return "blocked"; // Return immediately if blocked
            } else {
              foundStatus = "available";
            }
          }
        }

        return foundStatus;
      };

      const child = React.Children.only(children);
      const status = getSlotStatus();

      let className = child.props.className;
      let title = "";

      switch (status) {
        case "blocked":
          className += " blocked-slot";
          title = "⛔ Blocked Time";
          break;
        case "available":
          className += " available-slot";
          title = "✓ Available for booking";
          break;
        case "past":
          className += " past-time-slot";
          break;
      }

      return React.cloneElement(child, {
        className: className,
        title: title,
      });
    },
    [availabilities],
  );

  let timeSpans = {};
  if (profile?.id !== calendar?.owner) {
    timeSpans = {
      min: earliestStart,
      max: latestEnd,
    };
  }
  return (
    <Box
      sx={{
        // height: "100vh", // Change from fixed height to viewport height
        // maxHeight: "calc(100vh - 48px)", // Account for any padding/margins
        // p: isMobile ? 1 : 2,
        // display: "flex",
        // flexDirection: "column",
        ...useCalendarStyles(isDark),
      }}
    >
      <Calendar
        style={{
          flex: 1,
          // height: "5000px",
        }} // Change from height: 100% to flex: 1
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onNavigate={setCurrentDate}
        date={currentDate}
        eventPropGetter={eventStyleGetter}
        components={{
          ...components,
          timeSlotWrapper: TimeSlotWrapper,
        }}
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
        {...timeSpans}
      />

      <EventDialog
        open={showEventDialog}
        onClose={handleCloseDialog}
        slotInfo={selectedSlot}
        selectedEvent={selectedEvent}
        readOnly={
          selectedEvent
            ? calendar.owner !== profile.id &&
              selectedEvent.created_by !== profile.id
            : calendar.owner !== profile?.id
        }
      />
    </Box>
  );
};

export default CalendarView;
