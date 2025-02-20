import {
  Availability,
  Calendar,
  CalendarActions,
  Event,
} from "../../../declarations/backend/backend.did";

const calendar_actions: CalendarActions = {
  delete_availabilities: [],
  delete_events: [],
  events: [],
  availabilities: [],
};

const calendar: Calendar = {
  id: "string",
  owner: "string",
  events: [],
  availabilities: [],
};

const initialState: any = {
  calendar_actions,
  calendar,
  current_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export function calendarReducer(state = initialState, action: any): any {
  console.log({ action });
  switch (action.type) {
    case "SET_TRAINING_DATA":
      return {
        ...state,
        training_data: {
          output: action.training_data.output,
          input: action.training_data.input || state.training_data.input,
        },
      };

    case "SET_TIMEZONE":
      return {
        ...state,
        current_timezone: action.current_timezone,
      };

    case "SET_CALENDAR":
      return {
        ...state,
        calendarChanged: false,
        calendar_actions: {
          ...state.calendar_actions,
          // Only reset if calendarChanged is false
          ...(state.calendarChanged ? {} : calendar_actions),
        },
        calendar: action.calendar,
      };

    case "SET_CALENDAR_CHANGED":
      return {
        ...state,
        calendarChanged: action.calendarChanged,
        calendar_actions: action.calendarChanged
          ? state.calendar_actions
          : calendar_actions,
      };

    case "ADD_EVENTS":
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          events: [
            ...state.calendar_actions.events,
            ...action.events.map((e: any) => ({
              ...e,
              id: e.id || Math.random().toString(),
              created_by: state.calendar.owner,
            })),
          ],
        },
        calendar: {
          ...state.calendar,
          events: [
            ...state.calendar.events,
            ...action.events.map((e: any) => ({
              ...e,
              id: e.id || Math.random().toString(),
              created_by: state.calendar.owner,
            })),
          ],
        },
      };

    case "ADD_EVENT":
      const newEvent = {
        ...action.event,
        id: action.event.id || Math.random().toString(),
        created_by: state.calendar.owner,
      };
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          events: [...state.calendar_actions.events, newEvent],
        },
        calendar: {
          ...state.calendar,
          events: [...state.calendar.events, newEvent],
        },
      };

    case "UPDATE_EVENT":
      const updatedEvent = {
        ...action.event,
        created_by: action.event.created_by || state.calendar.owner,
      };
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          events: state.calendar_actions.events.map((event: Event) =>
            event.id === updatedEvent.id ? updatedEvent : event,
          ),
        },
        calendar: {
          ...state.calendar,
          events: state.calendar.events.map((event: Event) =>
            event.id === updatedEvent.id ? updatedEvent : event,
          ),
        },
      };

    case "DELETE_EVENT":
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          delete_events: [...state.calendar_actions.delete_events, action.id],
        },
        calendar: {
          ...state.calendar,
          events: state.calendar.events.filter(
            (event: Event) => event.id !== action.id,
          ),
        },
      };

    case "ADD_AVAILABILITIES":
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          availabilities: [
            ...state.calendar_actions.availabilities,
            ...action.availabilities,
          ],
        },
        calendar: {
          ...state.calendar,
          availabilities: [
            ...state.calendar.availabilities,
            ...action.availabilities,
          ],
        },
      };

    case "ADD_AVAILABILITY":
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          availabilities: [
            ...state.calendar_actions.availabilities,
            action.availability,
          ],
        },
        calendar: {
          ...state.calendar,
          availabilities: [
            ...state.calendar.availabilities,
            action.availability,
          ],
        },
      };

    case "UPDATE_AVAILABILITY": {
      const existingAvailabilityIndex =
        state.calendar_actions.availabilities.findIndex(
          (availability: Availability) =>
            availability.id === action.availability.id,
        );

      const updatedAvailabilities =
        existingAvailabilityIndex === -1
          ? [...state.calendar_actions.availabilities, action.availability] // Add new
          : state.calendar_actions.availabilities.map(
              (
                availability: Availability, // Update existing
              ) =>
                availability.id === action.availability.id
                  ? action.availability
                  : availability,
            );

      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          availabilities: updatedAvailabilities,
        },
        calendar: {
          ...state.calendar,
          availabilities: state.calendar.availabilities.map(
            (availability: Availability) =>
              availability.id === action.availability.id
                ? action.availability
                : availability,
          ),
        },
      };
    }

    case "DELETE_AVAILABILITY":
      return {
        ...state,
        calendarChanged: true,
        calendar_actions: {
          ...state.calendar_actions,
          delete_availabilities: [
            ...state.calendar_actions.delete_availabilities,
            action.id,
          ],
        },
        calendar: {
          ...state.calendar,
          availabilities: state.calendar.availabilities.filter(
            (availability: Availability) => availability.id !== action.id,
          ),
        },
      };

    default:
      return state;
  }
}
