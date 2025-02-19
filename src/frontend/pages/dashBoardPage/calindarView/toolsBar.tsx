import {
  Button,
  ButtonGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CalendarManagement from "./AvailabilityComonent";
import React from "react";
import CopyButton from "../../../components/MuiComponents/copyButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
import TimeZoneSelector from "./timezone";
import SaveCalendarData from "./saveData";
import ResetCalendarData from "./resetData";

const CustomToolbar = (toolbar) => {
  const { calendarChanged, calendar, calendar_actions } = useSelector(
    (state: RootState) => state.calendarState,
  );
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const navigate = (action) => {
    toolbar.onNavigate(action);
  };

  const viewNames = toolbar.views;
  const view = toolbar.view;
  const currentPage = window.location.pathname;
  const isCalendarPage = currentPage === "/calendar";
  const copyLink = React.useMemo(() => {
    return `${window.location.href}calendar?id=${calendar?.id}`;
  }, [calendar?.id]);

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
        {!isCalendarPage && <CopyButton title="Share" value={copyLink} />}
        <CalendarManagement />
        <SaveCalendarData />
        <ResetCalendarData />
        <Button onClick={() => navigate("TODAY")}>
          Today <TimeZoneSelector />
        </Button>
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

export default CustomToolbar;
