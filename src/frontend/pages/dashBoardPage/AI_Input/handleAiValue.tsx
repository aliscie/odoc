// handleAIValue.js
import { processCalendarText } from "./gemeniAi";
// import { validateEventAgainstCalendar } from "../calendarView/utils";

/**
 * Processes AI-generated calendar actions and validates them against the current calendar
 * @param {Object} params - The parameters object
 * @param {string} params.input - User input text
 * @param {Object} params.currentCalendar - Current calendar state
 * @param {Array} params.currentMessages - Current message history
 * @param {Function} params.setMessages - Message state setter
 * @param {Function} params.enqueueSnackbar - Notification handler
 * @param {Function} params.dispatch - Redux dispatch function
 * @param {Object} params.profile - User profile object
 * @returns {Promise<Array>} Array of valid calendar actions
 */
const handleAIValue = async ({
  input,
  currentCalendar,
  currentMessages,
  setMessages,
  enqueueSnackbar,
  dispatch,
  profile,
}) => {
  console.log({ currentCalendar });
  try {
    const contextData = {
      messages: currentMessages,
      input,
      profile: profile
        ? { ...profile, note: "Add ID to attendances for created events" }
        : null,
    };

    const aiResponse = await processCalendarText(
      JSON.stringify(contextData),
      currentCalendar,
      dispatch,
    );

    return processAIActions(aiResponse, {
      currentCalendar,
      setMessages,
    });
  } catch (error) {
    console.error("Calendar operation error:", error);

    // Extract the relevant error message
    let userMessage =
      "Sorry, I couldn't process that request. Please try again.";

    if (error?.message?.includes("model is overloaded")) {
      userMessage =
        "The AI service is currently busy. Please wait a moment and try again.";
    } else if (error?.message?.includes("Error fetching")) {
      userMessage =
        "Network connection issue. Please check your connection and try again.";
    }

    // Show error notification
    enqueueSnackbar(userMessage, {
      variant: "error",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });

    return [];
  }
};

/**
 * Processes and validates AI-generated calendar actions
 * @param {Array} actions - Array of calendar actions from AI
 * @param {Object} context - Processing context
 * @returns {Array} Array of valid actions
 */
const processAIActions = (actions, { currentCalendar, setMessages }) => {
  const validActions = [];
  const messages = [];

  for (const action of actions) {
    // Add the feedback message from AI to the messages array
    if (action.feedback) {
      messages.push({
        sender: "AI",
        content: action.feedback,
      });
    }

    const processedAction = processAction(action.data, {
      currentCalendar,
      messages,
    });

    if (processedAction) {
      validActions.push(processedAction);
    }
  }

  if (messages.length > 0) {
    setMessages((prevMessages) => [...prevMessages, ...messages]);
  } else if (validActions.length > 0) {
    setMessages([]);
  }

  return validActions;
};

/**
 * Processes a single calendar action
 * @param {Object} action - Calendar action to process
 * @param {Object} context - Processing context
 * @returns {Object|null} Processed action or null if invalid
 */
const processAction = (action, { currentCalendar, messages }) => {
  switch (action.type) {
    case "ADD_EVENT":
    case "UPDATE_EVENT": {
      const event = action.event;
      const excludeEventId = action.type === "UPDATE_EVENT" ? event.id : null;

      const validation = validateEventAgainstCalendar(
        currentCalendar,
        event,
        excludeEventId,
      );

      if (!validation.isValid) {
        messages.push({
          sender: "AI",
          badEvent: event,
          content: validation.reason,
        });
        return null;
      }

      return action;
    }

    case "ADD_EVENTS": {
      const validEvents = action.events.filter((event) => {
        const validation = validateEventAgainstCalendar(currentCalendar, event);

        if (!validation.isValid) {
          messages.push({
            sender: "AI",
            badEvent: event,
            content: validation.reason,
          });
          return false;
        }

        return true;
      });

      return validEvents.length > 0
        ? { type: "ADD_EVENTS", events: validEvents }
        : null;
    }

    default:
      return action;
  }
};

// Utils for event validation
const TimeUtils = {
  /**
   * Checks if two time ranges overlap
   */
  doTimeRangesOverlap: (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  },

  /**
   * Checks if an event overlaps with an availability period
   */
  checkAvailabilityOverlap: (event, availability) => {
    return (
      event.date === availability.date &&
      TimeUtils.doTimeRangesOverlap(
        event.start_time,
        event.end_time,
        availability.start_time,
        availability.end_time,
      )
    );
  },
};

/**
 * Validates an event against the calendar constraints
 * @param {Object} calendar - Calendar object
 * @param {Object} newEvent - Event to validate
 * @param {string|null} excludeEventId - ID of event to exclude from overlap check
 * @returns {Object} Validation result
 */
export const validateEventAgainstCalendar = (
  calendar,
  newEvent,
  excludeEventId = null,
) => {
  // Check event overlap
  const hasEventOverlap = calendar?.events.some(
    (existingEvent) =>
      existingEvent.id !== excludeEventId &&
      existingEvent.date === newEvent.date &&
      TimeUtils.doTimeRangesOverlap(
        newEvent.start_time,
        newEvent.end_time,
        existingEvent.start_time,
        existingEvent.end_time,
      ),
  );

  if (hasEventOverlap) {
    return {
      isValid: false,
      reason: "Event overlaps with an existing event",
    };
  }

  // Check blocked availabilities
  const overlapsBlockedTime = calendar?.availabilities
    .filter((a) => a.is_blocked)
    .some((blockedAvail) =>
      TimeUtils.checkAvailabilityOverlap(newEvent, blockedAvail),
    );

  if (overlapsBlockedTime) {
    return {
      isValid: false,
      reason: "Event overlaps with blocked time",
    };
  }

  // Check available time slots
  const hasValidAvailability =
    calendar?.availabilities.length === 0 ||
    calendar?.availabilities
      .filter((a) => !a.is_blocked)
      .some((avail) => TimeUtils.checkAvailabilityOverlap(newEvent, avail));

  if (!hasValidAvailability) {
    return {
      isValid: false,
      reason: "Event does not fall within any available time slot",
    };
  }

  return { isValid: true };
};

export default handleAIValue;
