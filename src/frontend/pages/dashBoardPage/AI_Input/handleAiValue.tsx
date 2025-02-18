import { processCalendarText } from "./gemeniAi";
import checkEventsOverlap from "../calindarView/utils";
import generateCalendarData from "./generativeAi";

export const handelAIValue = async (
  input,
  currentCalendar,
  currentMessages,
  setMessages,
  enqueueSnackbar,
  dispatch,
  profile,
) => {
  try {
    // console.log({ currentMessages });
    let myname = "";
    if (profile) {
      myname = `${profile.name} this is my name make sure to add it to the attendances when I create events`;
    }

    const calendarRes = await processCalendarText(
      JSON.stringify(currentMessages) + JSON.stringify(input) + myname,
      currentCalendar,
      dispatch,
    );

    const addEvents = [];
    const otherActions = [];
    calendarRes.forEach((action) => {
      if (action.type === "ADD_EVENT") {
        addEvents.push(action.event);
      } else if (action.type === "ADD_EVENTS") {
        addEvents.push(...action.events);
      } else if (action.type === "UPDATE_EVENT") {
        const updatedEventOverlap = checkEventsOverlap(currentCalendar.events, [
          action.event,
        ]);

        if (updatedEventOverlap.hasOverlap) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "AI",
              badEvent: action.event,
              content: "This event conflicts with an existing one",
            },
          ]);
          return;
        }
        otherActions.push(action);
      } else {
        otherActions.push(action);
      }
    });

    if (addEvents.length > 0) {
      const overlapping = checkEventsOverlap(currentCalendar.events, addEvents);

      if (overlapping.hasOverlap) {
        overlapping.overlappingPairs.forEach((overlap) => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "AI",
              badEvent: overlap.newEvent,
              content: "This event conflicts with an existing one",
            },
          ]);
        });
        return;
      }

      if (addEvents.length > 0) {
        otherActions.push({
          type: "ADD_EVENTS",
          events: addEvents,
        });
      }
    }

    if (otherActions.length > 0) {
      setMessages([]);
    }
    return otherActions;
  } catch (error) {
    console.error("Calendar operation error:", error);
    enqueueSnackbar(
      "Sorry, I couldn't process that request. Please try again.",
      {
        variant: "error",
      },
    );
  }
};
