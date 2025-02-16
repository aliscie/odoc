/**
 * Checks if two events overlap in time
 * @param {Event} event1 - First event to compare
 * @param {Event} event2 - Second event to compare
 * @returns {boolean} - True if events overlap, false otherwise
 */
const doEventsOverlap = (event1, event2) => {
  // Convert microsecond timestamps to milliseconds for easier comparison
  const event1Start = event1.start_time / 1000;
  const event1End = event1.end_time / 1000;
  const event2Start = event2.start_time / 1000;
  const event2End = event2.end_time / 1000;

  // Events overlap if one event starts during the other event's time period
  return (
    (event1Start >= event2Start && event1Start < event2End) || // event1 starts during event2
    (event2Start >= event1Start && event2Start < event1End) || // event2 starts during event1
    (event1Start <= event2Start && event1End >= event2End) || // event1 completely contains event2
    (event2Start <= event1Start && event2End >= event1End) // event2 completely contains event1
  );
};

/**
 * Checks for overlaps between existing events and new events
 * @param {Array<Event>} oldEvents - Array of existing events
 * @param {Array<Event>} newEvents - Array of new events to check
 * @returns {Object} - Object containing overlap information
 */
const checkEventsOverlap = (oldEvents, newEvents) => {
  const overlappingPairs = [];
  let hasOverlap = false;

  // Handle empty arrays
  if (!oldEvents?.length || !newEvents?.length) {
    return {
      hasOverlap: false,
      overlappingPairs: []
    };
  }

  // Check each new event against all existing events
  for (const newEvent of newEvents) {
    for (const existingEvent of oldEvents) {
      // Skip if comparing the same event (useful when checking updates)
      if (newEvent.id === existingEvent.id) {
        continue;
      }

      if (doEventsOverlap(newEvent, existingEvent)) {
        hasOverlap = true;
        overlappingPairs.push({
          existingEvent,
          newEvent
        });
      }
    }
  }

  return {
    hasOverlap,
    overlappingPairs
  };
};

export default checkEventsOverlap;
