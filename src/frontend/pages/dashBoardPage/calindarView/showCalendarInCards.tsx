import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import RepeatIcon from "@mui/icons-material/Repeat";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ScheduleIcon from "@mui/icons-material/Schedule";
import renderEventCard from "./eventCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";
const useTimezoneConverter = () => {
  const { current_timezone } = useSelector(
    (state: RootState) => state.calendarState,
  );

  // Memoize the converter function to prevent unnecessary recreations
  const convertToLocalTime = React.useCallback(
    (nanoseconds: number): Date => {
      const milliseconds = nanoseconds / 1_000_000;
      const utcDate = new Date(milliseconds);

      try {
        return new Date(
          utcDate.toLocaleString("en-US", {
            timeZone: current_timezone,
          }),
        );
      } catch (error) {
        console.warn(
          `Timezone conversion failed for ${current_timezone}`,
          error,
        );
        return utcDate;
      }
    },
    [current_timezone],
  );

  return { convertToLocalTime };
};
// Types
interface TimeSlot {
  start_time: number;
  end_time: number;
}

interface DateRange {
  start_date: number;
  end_date: number;
}

interface WeeklyRecurring {
  days: number[];
}

interface Availability {
  id: string;
  title?: string[];
  is_blocked: boolean;
  schedule_type: {
    DateRange?: DateRange;
    WeeklyRecurring?: WeeklyRecurring;
  };
  time_slots: TimeSlot[];
}

const useFormatters = () => {
  const { convertToLocalTime } = useTimezoneConverter();

  const formatDate = (nanoseconds: number): string => {
    const localDate = convertToLocalTime(nanoseconds);
    return localDate.toLocaleString();
  };

  const formatTimeOfDay = (nanoseconds: number): string => {
    const localDate = convertToLocalTime(nanoseconds);
    return localDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDayName = (day: number): string => {
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

  return { formatDate, formatTimeOfDay, getDayName };
};

// Components
const TimeSlotChip: React.FC<{
  slot: TimeSlot;
  color: "error" | "success";
}> = ({ slot, color }) => {
  const { formatTimeOfDay } = useFormatters();
  // Add key prop with timezone to force re-render when timezone changes
  return (
    <Chip
      key={`${slot.start_time}-${slot.end_time}`}
      label={`${formatTimeOfDay(slot.start_time)} - ${formatTimeOfDay(slot.end_time)}`}
      size="small"
      variant="outlined"
      color={color}
    />
  );
};

const DateRangeChips: React.FC<{
  dateRange: DateRange;
  color: "error" | "success";
}> = ({ dateRange, color }) => {
  const { formatDate } = useFormatters();

  return (
    <Stack direction="row" spacing={1} mb={2}>
      <Chip
        icon={<AccessTimeIcon />}
        label={formatDate(dateRange.start_date)}
        size="small"
        color={color}
      />
      <Chip
        icon={<ScheduleIcon />}
        label={formatDate(dateRange.end_date)}
        size="small"
        color={color}
      />
    </Stack>
  );
};

const WeeklyScheduleChips: React.FC<{
  days: number[];
  color: "error" | "success";
}> = ({ days, color }) => {
  const { getDayName } = useFormatters();

  return (
    <Box mb={2}>
      <Chip
        icon={<RepeatIcon />}
        label="Weekly Schedule"
        size="small"
        color={color}
        sx={{ mb: 1 }}
      />
      <Box display="flex" gap={1} flexWrap="wrap">
        {days.map((day, index) => (
          <Chip
            key={index}
            label={getDayName(day)}
            size="small"
            variant="outlined"
            color={color}
          />
        ))}
      </Box>
    </Box>
  );
};

const TimeSlotCard: React.FC<{ availability: Availability }> = ({
  availability,
}) => {
  const theme = useTheme();
  const isBlocked = availability.is_blocked;
  const color = isBlocked ? "error" : "success";
  const backgroundColor = isBlocked
    ? theme.palette.error.light
    : theme.palette.success.light;

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          backgroundColor,
          "&:hover": {
            boxShadow: theme.shadows[8],
            transform: "translateY(-2px)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            {isBlocked ? (
              <BlockIcon color={color} />
            ) : (
              <DateRangeIcon color={color} />
            )}
            <Typography variant="h6" component="div">
              {availability.title?.[0] ||
                (isBlocked ? "Blocked Time" : "Available Time")}
            </Typography>
          </Box>

          {availability.schedule_type?.DateRange && (
            <DateRangeChips
              dateRange={availability.schedule_type.DateRange}
              color={color}
            />
          )}

          {availability.schedule_type?.WeeklyRecurring && (
            <WeeklyScheduleChips
              days={availability.schedule_type.WeeklyRecurring.days}
              color={color}
            />
          )}

          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Time Slots:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {availability.time_slots.map((slot, index) => (
              <TimeSlotChip key={index} slot={slot} color={color} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

const CalendarDisplay: React.FC = () => {
  const { current_timezone, calendar } = useSelector(
    (state: RootState) => state.calendarState,
  );

  // Force re-render when timezone changes
  const [, setForceUpdate] = React.useState({});
  React.useEffect(() => {
    setForceUpdate({});
  }, [current_timezone]);

  return (
    <Box sx={{ p: 3 }}>
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

      {calendar.availabilities?.length > 0 && (
        <Box mb={4}>
          <Typography
            variant="h5"
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <DateRangeIcon color="primary" />
            Time Slots
          </Typography>
          <Grid container spacing={3}>
            {calendar.availabilities.map((availability) => (
              <TimeSlotCard key={availability.id} availability={availability} />
            ))}
          </Grid>
        </Box>
      )}

      {calendar.events.length === 0 && calendar.availabilities.length === 0 && (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No calendar entries found
        </Typography>
      )}
    </Box>
  );
};

export default CalendarDisplay;
