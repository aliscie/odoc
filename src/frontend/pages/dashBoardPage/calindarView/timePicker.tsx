import React, { useCallback, useMemo } from 'react';
import { Theme, useTheme, styled } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

// Types
interface TimePickerProps {
  onChange?: (value: bigint | null) => void;
  defaultValue?: bigint;
  label?: string;
  disabled?: boolean;
  sx?: any;
}

// Styled Components
const StyledContainer = styled(DemoContainer)(({ theme }) => ({
  width: '100%',
  maxWidth: '300px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

// Utility Functions
const convertToNanoseconds = (date: Date): bigint => {
  // Get hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Create a new Date at midnight
  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);

  // Convert to nanoseconds (multiply by 1e6 to match formatTime)
  return BigInt(baseDate.getTime() * 1e6);
};

const convertFromNanoseconds = (nanoseconds: bigint): Date => {
  // Convert from nanoseconds to milliseconds (divide by 1e6)
  const milliseconds = Number(nanoseconds) / 1e6;
  return new Date(milliseconds);
};

// Custom Hook
const useTimePickerLogic = (
  onChange?: (value: bigint | null) => void,
  defaultValue?: bigint
) => {
  const handleTimeChange = useCallback(
    (newValue: any) => {
      if (!onChange) return;

      if (!newValue) {
        onChange(null);
        return;
      }

      const date = newValue.toDate();
      const nanoseconds = convertToNanoseconds(date);
      onChange(nanoseconds);
    },
    [onChange]
  );

  const initialValue = useMemo(() => {
    if (!defaultValue) return null;
    const date = convertFromNanoseconds(defaultValue);
    return dayjs(date);
  }, [defaultValue]);

  return {
    handleTimeChange,
    initialValue,
  };
};

// Main Component
const EnhancedTimePicker: React.FC<TimePickerProps> = ({
  onChange,
  defaultValue,
  label = 'Select Time',
  disabled = false,
  sx = {},
}) => {
  const theme = useTheme();
  const { handleTimeChange, initialValue } = useTimePickerLogic(onChange, defaultValue);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledContainer components={['TimePicker']}>
        <TimePicker
          disabled={disabled}
          label={label}
          value={initialValue}
          onChange={handleTimeChange}
          views={['hours', 'minutes']}
          format="HH:mm"
          ampm={false}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            ...sx,
          }}
        />
      </StyledContainer>
    </LocalizationProvider>
  );
};

export default EnhancedTimePicker;
