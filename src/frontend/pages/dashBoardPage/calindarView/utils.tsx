// calendarUtils.js

/**
 * Converts microsecond timestamp to milliseconds for comparison
 */
const microToMilli = (microseconds) => microseconds / 1000;

/**
 * Checks if a time range overlaps with another
 */
const doTimeRangesOverlap = (start1, end1, start2, end2) => {
  const start1Milli = microToMilli(start1);
  const end1Milli = microToMilli(end1);
  const start2Milli = microToMilli(start2);
  const end2Milli = microToMilli(end2);

  return (
    (start1Milli >= start2Milli && start1Milli < end2Milli) ||
    (start2Milli >= start1Milli && start2Milli < end1Milli) ||
    (start1Milli <= start2Milli && end1Milli >= end2Milli) ||
    (start2Milli <= start1Milli && end2Milli >= end1Milli)
  );
};

/**
 * Checks if an event falls within a schedule type's time range
 */
const isWithinScheduleType = (event, scheduleType) => {
  const eventDate = event.date;

  switch (Object.keys(scheduleType)[0]) {
    case 'DateRange': {
      const { start_date, end_date } = scheduleType.DateRange;
      return eventDate >= start_date && eventDate <= end_date;
    }
    case 'WeeklyRecurring': {
      const { days, valid_until } = scheduleType.WeeklyRecurring;
      const eventDay = new Date(eventDate / 1e6).getUTCDay();
      if (!days.includes(eventDay)) return false;
      if (valid_until && eventDate > valid_until) return false;
      return true;
    }
    case 'SpecificDates': {
      return scheduleType.SpecificDates.includes(eventDate);
    }
    default:
      return false;
  }
};

/**
 * Check if event overlaps with availability time slots
 */
const checkAvailabilityOverlap = (event, availability) => {
  // First check if the event date falls within the schedule type
  if (!isWithinScheduleType(event, availability.schedule_type)) {
    return false;
  }

  // Then check if any time slots overlap
  return availability.time_slots.some(slot =>
    doTimeRangesOverlap(
      event.start_time,
      event.end_time,
      slot.start_time,
      slot.end_time
    )
  );
};

/**
 * Comprehensive event validation against calendar
 */
const validateEventAgainstCalendar = (calendar, newEvent, excludeEventId = null) => {
  // 1. Check overlap with other events
  const hasEventOverlap = calendar.events.some(existingEvent =>
    existingEvent.id !== excludeEventId &&
    existingEvent.date === newEvent.date &&
    doTimeRangesOverlap(
      newEvent.start_time,
      newEvent.end_time,
      existingEvent.start_time,
      existingEvent.end_time
    )
  );

  if (hasEventOverlap) {
    return {
      isValid: false,
      reason: "Event overlaps with an existing event"
    };
  }

  // 2. Check overlap with blocked availabilities
  const overlapsBlockedTime = calendar.availabilities
    .filter(a => a.is_blocked)
    .some(blockedAvail => checkAvailabilityOverlap(newEvent, blockedAvail));

  if (overlapsBlockedTime) {
    return {
      isValid: false,
      reason: "Event overlaps with blocked time"
    };
  }

  // 3. Verify event falls within at least one available time slot
  const hasValidAvailability = calendar.availabilities
    .filter(a => !a.is_blocked)
    .some(avail => checkAvailabilityOverlap(newEvent, avail));

  if (!hasValidAvailability && calendar.availabilities.length > 0) {
    return {
      isValid: false,
      reason: "Event does not fall within any available time slot"
    };
  }

  return {
    isValid: true
  };
};

export default validateEventAgainstCalendar;
