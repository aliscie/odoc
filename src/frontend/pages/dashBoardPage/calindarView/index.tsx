import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import TimeZoneSelector from "./timezone";
import CalendarDisplay from "./showCalendarInCards";
import { useDispatch, useSelector } from "react-redux";
import CopyButton from "../../../components/MuiComponents/copyButton";
import { useBackendContext } from "../../../contexts/BackendContext";
import { useSnackbar } from "notistack";
import LoaderButton from "../../../components/MuiComponents/LoaderButton";
import ConversationInput from "../AI_Input";
import { Calendar } from "../../../../declarations/backend/backend.did";
import CalendarView from "./calendar";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const profile = useSelector((state: RootState) => state.filesState.profile);
  const { calendarChanged, calendar, calendar_actions } = useSelector(
    (state: RootState) => state.calendarState,
  );
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { backendActor } = useBackendContext();

  // Memoized handlers
  const handleFetchCalendar = useCallback(async () => {
    if (!backendActor || fetchAttempted.current || calendar.owner !== "string")
      return;

    try {
      setIsLoading(true);
      setError(null);
      fetchAttempted.current = true;
      if (isCalendarPage) {
        console.log({ calendarID });
        const res = await backendActor.get_calendar(calendarID);
        console.log({ res });
        dispatch({
          type: "SET_CALENDAR",
          calendar: res,
        });
      } else if (profile) {
        const res = await backendActor.get_my_calendar();
        dispatch({
          type: "SET_CALENDAR",
          calendar: res,
        });
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch calendar";
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
        fetchAttempted.current = false;
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [backendActor, profile, dispatch, enqueueSnackbar]);

  const handleSave = useCallback(async () => {
    if (!backendActor || !calendar) return;

    try {
      setIsLoading(true);
      // console.log({ calendar });
      const res = await backendActor.update_calendar(calendar_actions);
      dispatch({
        type: "SET_CALENDAR_CHANGED",
        calendarChanged: false,
      });

      if (res?.Err) {
        enqueueSnackbar(res.Err, { variant: "error" });
      }

      enqueueSnackbar("Calendar saved successfully", { variant: "success" });
      return { Ok: "" };
    } catch (err) {
      console.log({ err })
      // const errorMessage =
      //   err instanceof Error ? err.message : "Failed to save calendar";
      // enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [backendActor, calendar, enqueueSnackbar]);

  const handleReset = useCallback(async () => {
    const res = await backendActor.get_my_calendar();
    dispatch({
      type: "SET_CALENDAR",
      calendar: res,
    });
  }, [handleFetchCalendar]);

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
  const copyLink = React.useMemo(() => {
    return `${window.location.href}calendar?id=${calendar?.id}`;
  }, [calendar?.id]);

  if (error) {
    return (
      <Box sx={{ p: 3, color: "error.main" }}>
        Error: {error}
        <LoaderButton onClick={handleReset}>Retry</LoaderButton>
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
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item>
            <TimeZoneSelector />
          </Grid>
          <Grid item>
            {!isCalendarPage && (
              <CopyButton title="Your calendar link" value={copyLink} />
            )}
          </Grid>
          <Grid item>
            <LoaderButton
              disabled={!calendarChanged}
              onClick={handleReset}
              loading={isLoading}
            >
              Reset
            </LoaderButton>
          </Grid>
          <Grid item>
            <LoaderButton
              disabled={!calendarChanged}
              onClick={handleSave}
              loading={isLoading}
            >
              Save
            </LoaderButton>
          </Grid>
        </Grid>

        <Box sx={{ mb: 4 }}>
          {/*<CalendarView*/}
          {/*    {...calendar}*/}
          {/*/>*/}

          <CalendarDisplay />
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
        <ConversationInput calendar={calendar} />
      </Box>
    </Box>
  );
});

Scheduler.displayName = "Scheduler";

export default Scheduler;
