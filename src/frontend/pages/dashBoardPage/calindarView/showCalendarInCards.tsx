import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Grid,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import RepeatIcon from "@mui/icons-material/Repeat";
import DateRangeIcon from "@mui/icons-material/DateRange";
import GroupIcon from "@mui/icons-material/Group";
import ScheduleIcon from "@mui/icons-material/Schedule";
import renderEventCard from "./eventCard";

const formatDate = (nanoseconds) => {
  const milliseconds = nanoseconds / 1_000_000;
  return new Date(milliseconds).toLocaleString();
};

const formatTimeOfDay = (nanoseconds) => {
  const milliseconds = nanoseconds / 1_000_000;
  return new Date(milliseconds).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDayName = (day) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[day];
};

const CalendarDisplay = ({ calendar }) => {
  const theme = useTheme();
  const renderAvailabilityCard = (availability) => (
    <Grid item xs={12} md={6} lg={4} key={availability.id}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          backgroundColor: theme.palette.success.light,
          "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-2px)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <DateRangeIcon color="success" />
            <Typography variant="h6" component="div">
              {availability.title || "Available Time"}
            </Typography>
          </Box>

          {availability.schedule_type?.DateRange && (
            <Stack direction="row" spacing={1} mb={2}>
              <Chip
                icon={<AccessTimeIcon />}
                label={formatDate(
                  availability.schedule_type.DateRange.start_date,
                )}
                size="small"
                color="success"
              />
              <Chip
                icon={<ScheduleIcon />}
                label={formatDate(
                  availability.schedule_type.DateRange.end_date,
                )}
                size="small"
                color="success"
              />
            </Stack>
          )}

          {availability.schedule_type.WeeklyRecurring && (
            <Box mb={2}>
              <Chip
                icon={<RepeatIcon />}
                label="Weekly Schedule"
                size="small"
                color="success"
                sx={{ mb: 1 }}
              />
              <Box display="flex" gap={1} flexWrap="wrap">
                {availability.schedule_type.WeeklyRecurring.days.map(
                  (day, index) => (
                    <Chip
                      key={index}
                      label={getDayName(day)}
                      size="small"
                      variant="outlined"
                      color="success"
                    />
                  ),
                )}
              </Box>
            </Box>
          )}

          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Time Slots:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {availability.time_slots.map((slot, index) => (
              <Chip
                key={index}
                label={`${formatTimeOfDay(slot.start_time)} - ${formatTimeOfDay(slot.end_time)}`}
                size="small"
                variant="outlined"
                color="success"
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderBlockedTimeCard = (blockedTime) => (
    <Grid item xs={12} md={6} lg={4} key={blockedTime.id}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          backgroundColor: theme.palette.error.light,
          "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-2px)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <BlockIcon color="error" />
            <Typography variant="h6" component="div">
              Blocked Time
            </Typography>
          </Box>

          {blockedTime.reason && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {blockedTime.reason}
            </Typography>
          )}

          {blockedTime.block_type.SingleBlock && (
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<AccessTimeIcon />}
                label={formatDate(
                  blockedTime.block_type.SingleBlock.start_time,
                )}
                size="small"
                color="error"
              />
              <Chip
                icon={<ScheduleIcon />}
                label={formatDate(blockedTime.block_type.SingleBlock.end_time)}
                size="small"
                color="error"
              />
            </Stack>
          )}

          {blockedTime.block_type.WeeklyBlock && (
            <Box>
              <Chip
                icon={<RepeatIcon />}
                label={`Weekly on ${getDayName(blockedTime.block_type.WeeklyBlock.day)}`}
                size="small"
                color="error"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                {formatTimeOfDay(blockedTime.block_type.WeeklyBlock.start_time)}{" "}
                -{formatTimeOfDay(blockedTime.block_type.WeeklyBlock.end_time)}
              </Typography>
            </Box>
          )}

          {blockedTime.block_type.FullDayBlock && (
            <Chip
              icon={<DateRangeIcon />}
              label={formatDate(blockedTime.block_type.FullDayBlock.date)}
              size="small"
              color="error"
            />
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Events Section */}
      {calendar.events?.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="h5"
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <EventIcon color="primary" />
            Events
          </Typography>
          <Grid container spacing={3}>
            {calendar.events.map(renderEventCard)}
          </Grid>
        </Box>
      )}

      {/* Availabilities Section */}
      {calendar.availabilities?.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="h5"
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <DateRangeIcon color="success" />
            Availabilities
          </Typography>
          <Grid container spacing={3}>
            {calendar.availabilities.map(renderAvailabilityCard)}
          </Grid>
        </Box>
      )}

      {/* Blocked Times Section */}
      {calendar.blocked_times.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="h5"
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <BlockIcon color="error" />
            Blocked Times
          </Typography>
          <Grid container spacing={3}>
            {calendar.blocked_times.map(renderBlockedTimeCard)}
          </Grid>
        </Box>
      )}

      {calendar.events.length === 0 &&
        calendar.availabilities.length === 0 &&
        calendar.blocked_times.length === 0 && (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No calendar entries found
          </Typography>
        )}
    </Box>
  );
};

export default CalendarDisplay;
