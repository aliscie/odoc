import React, { useState } from "react";
import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import { Availability, Unavailability, Event, DialogType } from "./types";
import TimeZoneSelector from "./timezone";
import CalendarView from "./calendar";
import ConversationInput from "../AI_Input";
import CalendarDisplay from "./showCalendarInCards";
import { useSelector } from "react-redux";

const Scheduler = () => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [availabilities, setAvailabilities] = useState([]);
  // const [unavailabilities, setUnavailabilities] = useState([]);
  // const [dialogType, setDialogType] = useState(null);
  // const [editingId, setEditingId] = useState(null);
  const { calendar } = useSelector((state) => state.calendarState);

  const handleDeleteAvailability = (id) => {
    setAvailabilities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDeleteUnavailability = (id) => {
    setUnavailabilities((prev) => prev.filter((u) => u.id !== id));
  };
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        pb: "120px", // Add padding at bottom to prevent content from being hidden behind input
      }}
    >
      <Box sx={{ p: theme.spacing(3) }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <TimeZoneSelector />
        </Grid>

        {calendar && (
          <>
            <Box sx={{ mb: 4 }}>
              <CalendarView calendar={calendar} />
            </Box>
            <Box sx={{ mb: 4 }}>
              <CalendarDisplay calendar={calendar} />
            </Box>
          </>
        )}

        <Grid container spacing={3}>
          {/* Your other grid items */}
        </Grid>
      </Box>

      {/* Position the ConversationInput at the bottom */}
      <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <ConversationInput calendar={calendar} />
      </Box>
    </Box>
  );
};

export default Scheduler;
