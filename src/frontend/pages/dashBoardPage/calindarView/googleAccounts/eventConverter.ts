import {Event as ODOCEvent } from "$/declarations/backend/backend.did.d.js";
// interface ODOCEvent {
//   title: string;
//   description: string;
//   start_time: number; // Unix timestamp in nanoseconds
//   end_time: number; // Unix timestamp in nanoseconds
//   location?: string;
// }

interface GoogleEvent {
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence?: string[];
  attendees?: { email: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
  colorId?: string;
  guestsCanInviteOthers?: boolean;
  guestsCanModify?: boolean;
  guestsCanSeeOtherGuests?: boolean;
}

export function googleToODOC(googleEvent: GoogleEvent | {start: string, end: string}): ODOCEvent {
  const isBusyEvent = !('summary' in googleEvent);
  
  return {
    id:googleEvent.id || "",
    title: isBusyEvent ? 'Busy' : googleEvent.summary,
    description: isBusyEvent ? 'Busy time slot' : (googleEvent.description || ''),
    start_time: new Date(isBusyEvent ? googleEvent.start : googleEvent.start.dateTime).getTime() * 1000000,
    end_time: new Date(isBusyEvent ? googleEvent.end : googleEvent.end.dateTime).getTime() * 1000000,
    attendees: ('attendees' in googleEvent) ? googleEvent.attendees?.map(attendee => attendee.email) || [] : [],
    created_by: ('created_by' in googleEvent) ? googleEvent.created_by : ""
  };
}

export function odocToGoogle(odocEvent: ODOCEvent): GoogleEvent {
  const startDate = new Date(odocEvent.start_time / 1000000);
  const endDate = new Date(odocEvent.end_time / 1000000);
  
  return {
    summary: odocEvent.title,
    description: odocEvent.description,
    // location: odocEvent.location,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 60 }
      ]
    }
  };
}