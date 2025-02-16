import React, { useState, useEffect } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

interface TimeZoneSelectorProps {
  onTimeZoneChange: (newTimeZone: string) => void;
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({
  onTimeZoneChange,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { current_timezone } = useSelector((state: any) => state.calendarState);
  const [timeZones] = useState(Intl.supportedValuesOf("timeZone"));
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: current_timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [current_timezone]);

  const handleChange = (newZone: string | null) => {
    if (newZone && timeZones.includes(newZone)) {
      dispatch({ type: "SET_TIMEZONE", current_timezone: newZone });
      // setCurrent_timezone(newZone);
      onTimeZoneChange(newZone);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Current Time: {currentTime}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Selected Zone: {current_timezone}
      </Typography>
      <Autocomplete
        value={current_timezone}
        onChange={(_, newValue) => handleChange(newValue)}
        options={timeZones}
        renderInput={(params) => (
          <TextField {...params} label="Select Time Zone" />
        )}
      />
    </Paper>
  );
};

export default TimeZoneSelector;
