export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  description?: string;
  location?: string;
}

export interface NewEventForm {
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
}

export interface GoogleCalendarIntegrationProps {
  onConnect?: () => void;
}

export interface Account {
  email: string;
  isCurrent: boolean;
}