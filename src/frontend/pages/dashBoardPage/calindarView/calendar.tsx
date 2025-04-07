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

const CalendarView = () => {
  const { calendar, google_events } = useSelector((state: RootState) => state.calendarState);

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
    const allEvents = [
      ...(calendar?.events || []),
      ...(google_events || [])
    ];
    
    const colors = [
      "#FF2D55",
      "#5856D6",
      "#007AFF",
      "#5AC8FA",
      "#4CD964",
      "#FF9500",
    ];

    return allEvents.map((event, index) => ({
      ...event,
      start: microsecondsToDate(event.start_time),
      end: microsecondsToDate(event.end_time),
      color: event.isGoogleEvent ? "#4285F4" : colors[index % colors.length], // Google blue for Google events
    }));
  }, [calendar, google_events]);

  const isWithinWeeklySchedule = (date, availability) => {
    if (availability.schedule_type.WeeklyRecurring) {
      const dayOfWeek = date.getDay();
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday (0) to 7
      return availability.schedule_type.WeeklyRecurring.days.includes(
        adjustedDay,
      );
    }
    return false;
  };
  const isWithinTimeSlot = (date, timeSlot) => {
    let slotStart = new Date(Number(timeSlot.start_time) / 1000000);
    let slotEnd = new Date(Number(timeSlot.end_time) / 1000000);
    // if  slotStart> slotEnd switch them
    if (slotStart > slotEnd) {
      const temp = slotStart;
      slotStart = slotEnd;
      slotEnd = temp;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const currentTime = new Date(0, 0, 0, hours, minutes, 0);

    return (
      currentTime >=
        new Date(0, 0, 0, slotStart.getHours(), slotStart.getMinutes(), 0) &&
      currentTime <
        new Date(0, 0, 0, slotEnd.getHours(), slotEnd.getMinutes(), 0)
    );
  };

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      if (slotInfo.action === "click" && calendar?.view === "month") {
        setCurrentDate(slotInfo.start);
        return;
      }

      // Prevent selection if slot is in the past
      if (slotInfo.start < new Date()) {
        return;
      }

      // Check if user is not the owner
      if (profile?.id !== calendar?.owner) {
        const isBlocked = availabilities.some((availability) => {
          const isCorrectDay = isWithinWeeklySchedule(
            slotInfo.start,
            availability,
          );
          const isInTimeSlot = availability.time_slots.some((slot) =>
            isWithinTimeSlot(slotInfo.start, slot),
          );
          return isCorrectDay && isInTimeSlot && availability.is_blocked;
        });

        const isAvailable = availabilities.some((availability) => {
          const isCorrectDay = isWithinWeeklySchedule(
            slotInfo.start,
            availability,
          );
          const isInTimeSlot = availability.time_slots.some((slot) =>
            isWithinTimeSlot(slotInfo.start, slot),
          );
          return isCorrectDay && isInTimeSlot && !availability.is_blocked;
        });

        // Prevent selection if blocked or not available
        if (isBlocked || !isAvailable) {
          return;
        }
      }

      setSelectedSlot({
        ...slotInfo,
        created_by: profile?.id,
      });

      setSelectedEvent(null);
      setShowEventDialog(true);
    },
    [calendar?.view, profile?.id, calendar?.owner, availabilities],
  );
  const handleSelectEvent = useCallback(
    (event) => {
      setSelectedEvent(event);
      setSelectedSlot({
        start: event.start,
        end: event.end,
        created_by: event.created_by,
      });
      let isCreator =
        calendar?.owner == profile?.id || profile?.id == event?.created_by;
      isCreator && setShowEventDialog(true);
    },
    [calendar, profile],
  );

  const eventStyleGetter = useCallback(
    (event) => {
      const isCreator = profile?.id === event?.created_by
      return {
        style: {
          backgroundColor: isCreator ? event.color : "#9e9e9e",
          opacity: 0.9,
          // Hide text content if not creator
          color: isCreator ? "inherit" : "transparent",
        },
      };
    },
    [calendar, profile],
  );
  const handleCloseDialog = useCallback(() => {
    setShowEventDialog(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  }, []);

  const views = isMobile ? ["month", "week"] : ["month", "week"];
  const components = { toolbar: CustomToolbar };

  //------- get earliestStart and latestEnd
  let earliestStart, latestEnd;
  for (const availability of availabilities) {
    availability.time_slots.forEach((slot) => {
      let slotStart = new Date(Number(slot.start_time) / 1000000);
      let slotEnd = new Date(Number(slot.end_time) / 1000000);

      if (slotStart > slotEnd) {
        const temp = slotStart;
        slotStart = slotEnd;
        slotEnd = temp;
      }

      if (!earliestStart) {
        earliestStart = slotStart;
        latestEnd = slotEnd;
      } else {
        earliestStart = slotStart < earliestStart ? slotStart : earliestStart;
        latestEnd = slotStart > latestEnd ? slotStart : latestEnd;
      }
    });
  }

  const TimeSlotWrapper = useCallback(
    ({ children, value }) => {
      // Check if the time slot is in the past
      const isPastTimeSlot = value < new Date();

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

      if (!children || !React.isValidElement(children)) {
        return children;
      }

      const child = React.Children.only(children);
      const status = getSlotStatus();

      let className = child.props?.className || '';
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
  );  // console.log({ earliestStart });
  let timeSpans = {};
  if (profile?.id === calendar?.owner) {
    const today = new Date();
    const minTime = new Date(today);
    minTime.setHours(1, 0, 0, 0);
    const maxTime = new Date(today);
    maxTime.setHours(23, 59, 0, 0);
    timeSpans = {
      min: minTime,
      max: maxTime,
    };
  } else {
    timeSpans = {
      min: earliestStart,
      max: latestEnd,
    };
  }

  return (
    <Box
      sx={{
        height: "100vh",
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
