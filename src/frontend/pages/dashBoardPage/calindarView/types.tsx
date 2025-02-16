// Types for the scheduler components
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type DialogType = 'availability' | 'unavailability' | 'event' | null;

export interface Availability {
  id: string;
  type: "recurring" | "specific";
  days?: Day[];
  startDate?: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  exclusions?: Date[];
}

export interface Unavailability {
  id: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

export interface Event {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}
