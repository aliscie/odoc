import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid, useTheme, Tabs, Tab } from "@mui/material";
// import TimeZoneSelector from "./timezone";
import { useDispatch, useSelector } from "react-redux";
import { useBackendContext } from "../../../contexts/BackendContext";
import { useSnackbar } from "notistack";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import ConversationInput from "../AI_Input";
import { Calendar } from "../../../../declarations/backend/backend.did";
import CalendarView from "./calendar";
import GoogleCalendarIntegration from "./googleAccounts";
import { AvailabilityTimezone, EventTimezone } from "./serializers";
import { logger } from "../../../DevUtils/logData";

interface RootState {
  filesState: {
    profile: any; // Replace with proper profile type
  };
  calendarState: {
    calendar: Calendar;
  };
}

const Scheduler = React.memo(() => {
  const currentPage = window.location.pathname;
  const isCalendarPage = currentPage === "/calendar";
  const calendarID = window.location.search.split("id=")[1];
  // Refs
  const isMounted = useRef(true);
  const fetchAttempted = useRef(false);

  // State
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const profile = useSelector((state: RootState) => state.filesState.profile);
  const { calendar } = useSelector((state: RootState) => state.calendarState);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { backendActor } = useBackendContext();

  // Memoized handlers
  const handleFetchCalendar = useCallback(async () => {
    if (!backendActor || fetchAttempted.current || calendar.owner !== "string")
      return;

    try {
      setError(null);
      fetchAttempted.current = true;
      if (isCalendarPage) {
        let fetchedCalendar = await backendActor.get_calendar(calendarID);
        // logger({ fetchedCalendar });
        fetchedCalendar = fetchedCalendar[0];
        if (!fetchedCalendar) {
          enqueueSnackbar("Calendar not found", { variant: "error" });
          return;
        }
        // console.log({ get_calendar: fetchedCalendar, calendarID });
        fetchedCalendar.events = fetchedCalendar.events?.map((event) =>
          EventTimezone(event),
        );
        fetchedCalendar.availabilities = fetchedCalendar.availabilities?.map(
          (event) => AvailabilityTimezone(event),
        );
        // console.log({ after: fetchedCalendar });
        dispatch({
          type: "SET_CALENDAR",
          calendar: fetchedCalendar,
        });
      } else if (profile) {
        let res = await backendActor.get_my_calendar();
        console.log({ res });
        res.events = res.events.map((event) => EventTimezone(event));
        res.availabilities = res.availabilities.map((event) =>
          AvailabilityTimezone(event),
        );
        dispatch({
          type: "SET_CALENDAR",
          calendar: res,
        });
      }
    } catch (err) {
      console.log({ err });
      if (isMounted.current) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch calendar";
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
        fetchAttempted.current = false;
      }
    } finally {
      if (isMounted.current) {
      }
    }
  }, [backendActor, profile, dispatch, enqueueSnackbar]);

  // Remove the tab state and handler
  // const [selectedTab, setSelectedTab] = useState<number>(0);
  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setSelectedTab(newValue);
  // };

  // Effects
  useEffect(() => {
    handleFetchCalendar();
  }, [handleFetchCalendar]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoized values

  // if (error) {
  //   return (
  //     <Box sx={{ p: 3, color: "error.main" }}>
  //       Error: {error}
  //       <LoaderButton onClick={handleReset}>Retry</LoaderButton>
  //     </Box>
  //   );
  // }
  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <LoaderButton onClick={handleFetchCalendar}>
          Loading... make sure login.
        </LoaderButton>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        pb: "120px",
      }}
    >
      <Box sx={{ p: theme.spacing(3) }}>
        {/* Remove the Tabs component */}
        <Box sx={{ mb: 4 }}>
          <CalendarView />
        </Box>
        <Box sx={{ mb: 4 }}>
          <GoogleCalendarIntegration onConnect={() => console.log('Google Calendar connected')} />
        </Box>
      </Box>

      {/* Fixed position conversation input */}
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <ConversationInput />
      </Box>
    </Box>
  );
});

Scheduler.displayName = "Scheduler";

export default Scheduler;
