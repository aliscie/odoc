export const formatTime = (time: bigint, hour12 = false): string => {
  const date = new Date(Number(time) / 1e6);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  });
};

export const parseTime = (timeStr: string): bigint => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return BigInt(date.getTime() * 1000); // Convert milliseconds to microseconds
};

export const microsecondsToDate = (time: number): Date => {
  return new Date(Number(time) / 1e6);
};

const utcToLocal = (utcMicroseconds: bigint): bigint => {
  // Convert UTC microseconds to local time microseconds
  const utcDate = new Date(Number(utcMicroseconds) / 1e6);
  const localOffset = utcDate.getTimezoneOffset() * 60 * 1000 * 1000; // Convert minutes to microseconds
  return BigInt(Number(utcMicroseconds) - localOffset);
};

const localToUtc = (localMicroseconds: bigint): bigint => {
  // Convert local time microseconds to UTC microseconds
  const localDate = new Date(Number(localMicroseconds) / 1e6);
  const localOffset = localDate.getTimezoneOffset() * 60 * 1000 * 1000; // Convert minutes to microseconds
  return BigInt(Number(localMicroseconds) + localOffset);
};

export const EventTimezone = (
  event: {
    start_time: number;
    end_time: number;
  },
  toUtc = false,
) => {
  const converter = toUtc ? localToUtc : utcToLocal;

  return {
    ...event,
    start_time: Number(converter(BigInt(event.start_time))),
    end_time: Number(converter(BigInt(event.end_time))),
  };
};

export const AvailabilityTimezone = (
  availability: {
    schedule_type: {
      DateRange?: {
        start_date: number;
        end_date: number;
      };
      WeeklyRecurring?: {
        days: number[];
        valid_until: number[];
      };
      SpecificDates?: number[];
    };
  },
  toUtc = false,
) => {
  const converter = toUtc ? localToUtc : utcToLocal;

  const convertedScheduleType = { ...availability.schedule_type };

  if (convertedScheduleType.DateRange) {
    convertedScheduleType.DateRange = {
      start_date: Number(
        converter(BigInt(convertedScheduleType.DateRange.start_date)),
      ),
      end_date: Number(
        converter(BigInt(convertedScheduleType.DateRange.end_date)),
      ),
    };
  }

  if (convertedScheduleType.WeeklyRecurring) {
    convertedScheduleType.WeeklyRecurring = {
      ...convertedScheduleType.WeeklyRecurring,
      valid_until: convertedScheduleType.WeeklyRecurring.valid_until.map(
        (time) => (time ? Number(converter(BigInt(time))) : null),
      ),
    };
  }

  if (convertedScheduleType.SpecificDates) {
    convertedScheduleType.SpecificDates =
      convertedScheduleType.SpecificDates.map((date) =>
        Number(converter(BigInt(date))),
      );
  }

  return {
    ...availability,
    schedule_type: convertedScheduleType,
  };
};

