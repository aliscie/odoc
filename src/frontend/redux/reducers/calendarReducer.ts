import { Calendar } from "../../../declarations/backend/backend.did";

const calendar: Calendar = {
  id: "string",
  owner: "string",
  events: [],
  availabilities: [],
  blocked_times: [],
};
const initialState: any = {
  calendar,
  current_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};
export function calendarReducer(state = initialState, action: any): any {
  switch (action.type) {
    case "SET_TIMEZONE":
      return {
        ...state,
        current_timezone: action.current_timezone,
      };
    case "SET_CALENDAR":
      return {
        ...state,
        calendar: action.calendar,
      };
    case "ADD_EVENTS":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: [...state.calendar.events, ...action.events],
        },
      };
    case "ADD_EVENT":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: [...state.calendar.events, action.event],
        },
      };

    case "UPDATE_EVENT":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: state.calendar.events.map((event: any) =>
            event.id === action.event.id ? action.event : event,
          ),
        },
      };

    case "DELETE_EVENT":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: state.calendar.events.filter(
            (event: any) => event.id !== action.eventId,
          ),
        },
      };
    case "ADD_AVAILABILITIES":
      return {
        ...state,
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
        calendar: {
          ...state.calendar,
          availabilities: [
            ...state.calendar.availabilities,
            action.availability,
          ],
        },
      };
    case "UPDATE_AVAILABILITY":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          availabilities: state.calendar.availabilities.map(
            (availability: any) =>
              availability.id === action.availability.id
                ? action.availability
                : availability,
          ),
        },
      };
    case "DELETE_AVAILABILITY":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          availabilities: state.calendar.availabilities.filter(
            (availability: any) => availability.id !== action.id,
          ),
        },
      };
    case "ADD_BLOCKED_TIMES":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          blocked_times: [
            ...state.calendar.blocked_times,
            ...action.blocked_times,
          ],
        },
      };
    case "DELETE_BLOCKED_TIME":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          blocked_times: state.calendar.blocked_times.filter(
            (blocked_time: any) => blocked_time.id !== action.id,
          ),
        },
      };
    case "UPDATE_BLOCKED_TIME":
      return {
        ...state,
        calendar: {
          ...state.calendar,
          blocked_times: state.calendar.blocked_times.map(
            (blocked_time: any) =>
              blocked_time.id === action.blocked_time.id
                ? action.blocked_time
                : blocked_time,
          ),
        },
      };

    default:
      return state;
  }
}
