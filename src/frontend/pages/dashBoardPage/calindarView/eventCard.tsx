import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const EventCard = (event) => {
  const theme = useTheme();
  const formatDate = (timestamp) => {
    // Convert nanoseconds to milliseconds
    const date = new Date(timestamp / 1_000_000);
    return date.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const createGoogleCalendarUrl = (event) => {
    // Convert nanosecond timestamps to milliseconds for Date object
    const startDate = new Date(event.start_time / 1_000_000);
    const endDate = new Date(event.end_time / 1_000_000);

    // Format dates for Google Calendar URL
    const formatDateForGoogle = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const start = formatDateForGoogle(startDate);
    const end = formatDateForGoogle(endDate);

    // Create Google Calendar URL with proper timezone
    const baseUrl = "https://calendar.google.com/calendar/render";
    const queryParams = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      details: event.description || "",
      dates: `${start}/${end}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return `${baseUrl}?${queryParams.toString()}`;
  };

  const handleAddToCalendar = (e) => {
    e.stopPropagation();
    const calendarUrl = createGoogleCalendarUrl(event);
    window.open(calendarUrl, "_blank");
  };

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          backgroundColor: theme.palette.primary.light,
          "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-2px)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EventIcon color="primary" />
              <Typography variant="h6" component="div">
                {event?.title}
              </Typography>
            </Box>
            <Tooltip title="Add to Google Calendar">
              <IconButton
                onClick={handleAddToCalendar}
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "20",
                  },
                }}
              >
                <CalendarTodayIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {event.description && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {event.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} mb={2}>
            <Chip
              icon={<AccessTimeIcon />}
              label={formatDate(event.start_time)}
              size="small"
              color="primary"
            />
            <Chip
              icon={<ScheduleIcon />}
              label={formatDate(event.end_time)}
              size="small"
              color="primary"
            />
          </Stack>

          {event.attendees && event.attendees.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap">
              <GroupIcon fontSize="small" color="action" />
              {event.attendees.map((attendee, index) => (
                <Chip
                  key={index}
                  label={attendee}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default EventCard;
