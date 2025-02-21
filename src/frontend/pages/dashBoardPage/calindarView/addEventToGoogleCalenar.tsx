import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

// Utility function to create Google Calendar URL
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
    text: event.title || "Untitled Event",
    details: event.description || "",
    dates: `${start}/${end}`,
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return `${baseUrl}?${queryParams.toString()}`;
};

// Props interface for type safety
interface GoogleCalendarButtonProps {
  event: {
    title: string;
    description: string;
    start_time: number; // Unix timestamp in nanoseconds
    end_time: number; // Unix timestamp in nanoseconds
    location?: string;
  };
  className?: string;
}

const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({
  event,
  className
}) => {
  const theme = useTheme();

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const calendarUrl = createGoogleCalendarUrl(event);
    window.open(calendarUrl, "_blank");
  };

  return (
    <Tooltip title="Add to Google Calendar">
      <IconButton
        onClick={handleAddToCalendar}
        className={className}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(1, 2),
          "& svg": {
            fontSize: "1.5rem"
          }
        }}
      >
        <GoogleIcon />
      </IconButton>
    </Tooltip>
  );
};

export default GoogleCalendarButton;
