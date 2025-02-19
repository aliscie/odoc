// handleAIValue.js
import { processCalendarText } from "./gemeniAi";
import validateEventAgainstCalendar from "../calindarView/utils";

const handleAIValue = async (
  input,
  currentCalendar,
  currentMessages,
  setMessages,
  enqueueSnackbar,
  dispatch,
  profile,
) => {
  try {
    let myname = profile
      ? `${profile.name} this is my name make sure to add it to the attendances when I create events`
      : "";

    const AI_AGENT_RES = await processCalendarText(
      JSON.stringify(currentMessages) + JSON.stringify(input) + myname,
      currentCalendar,
      dispatch,
    );

    const validActions = [];

    for (const action of AI_AGENT_RES) {
      if (action.type === "ADD_EVENT" || action.type === "UPDATE_EVENT") {
        const event = action.type === "ADD_EVENT" ? action.event : action.event;
        const excludeEventId = action.type === "UPDATE_EVENT" ? event.id : null;

        const validation = validateEventAgainstCalendar(
          currentCalendar,
          event,
          excludeEventId,
        );

        if (!validation.isValid) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "AI",
              badEvent: event,
              content: validation.reason,
            },
          ]);
          continue;
        }
      }

      if (action.type === "ADD_EVENTS") {
        const validEvents = [];

        for (const event of action.events) {
          const validation = validateEventAgainstCalendar(
            currentCalendar,
            event,
          );

          if (!validation.isValid) {
            setMessages((prev) => [
              ...prev,
              {
                sender: "AI",
                badEvent: event,
                content: validation.reason,
              },
            ]);
          } else {
            validEvents.push(event);
          }
        }

        if (validEvents.length > 0) {
          validActions.push({
            type: "ADD_EVENTS",
            events: validEvents,
          });
        }
      } else {
        validActions.push(action);
      }
    }

    if (validActions.length > 0) {
      setMessages([]);
    }

    return validActions;
  } catch (error) {
    console.error("Calendar operation error:", error);
    enqueueSnackbar(
      "Sorry, I couldn't process that request. Please try again.",
      { variant: "error" },
    );
  }
};
export default handleAIValue;
