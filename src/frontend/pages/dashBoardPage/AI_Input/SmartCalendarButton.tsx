import React from 'react';
import {IconButton, Tooltip, useTheme} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const SmartCalendarButton = ({ event }) => {
  const theme = useTheme();
  // const deviceInfo = useDeviceDetection();

  const createGoogleCalendarUrl = (event) => {
    const { name, description, startDate, endDate } = event;

    // Format dates for Google Calendar URL
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    // Create Google Calendar URL
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const queryParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: name,
      details: description,
      dates: `${start}/${end}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    return `${baseUrl}?${queryParams.toString()}`;
  };

  const handleClick = () => {
    const calendarUrl = createGoogleCalendarUrl(event);
    // Open in new tab
    window.open(calendarUrl, '_blank');
  };

  return (
    <Tooltip title="Add to Google Calendar">
      <IconButton
        onClick={handleClick}
        sx={{
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light + '20',
          },
        }}
      >
        <CalendarTodayIcon />
      </IconButton>
    </Tooltip>
  );
};

export default SmartCalendarButton;
