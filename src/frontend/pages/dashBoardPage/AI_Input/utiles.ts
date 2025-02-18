// TimeFormatter class for handling different time formats
class TimeFormatter {
  // Constants for time conversions
  private static readonly NANOS_TO_MILLIS = 1e-6;
  private static readonly MILLIS_TO_NANOS = 1e6;
  private static readonly SECONDS_TO_NANOS = 1e9;

  /**
   * Converts nanosecond timestamp to UTC time string
   */
  static toUTCTime(timestamp: number | bigint): string {
    try {
      // Convert nanoseconds to milliseconds for JS Date
      const milliseconds = this.nanosToMillis(timestamp);
      const date = new Date(milliseconds);
      
      // Validate the date
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date conversion');
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      });
    } catch (error) {
      console.error('Error in toUTCTime:', error);
      return '00:00'; // Fallback value
    }
  }

  /**
   * Converts nanosecond timestamp to UTC date string
   */
  static toUTCDate(timestamp: number | bigint): string {
    try {
      const milliseconds = this.nanosToMillis(timestamp);
      const date = new Date(milliseconds);
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date conversion');
      }

      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      }).replace(/\//g, '-');
    } catch (error) {
      console.error('Error in toUTCDate:', error);
      return '01-01-1970'; // Fallback value
    }
  }

  /**
   * Converts time string to nanosecond timestamp
   */
  static parseTimeToNanos(timeStr: string, dateTimestamp: number | bigint): number {
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes) || 
          hours < 0 || hours > 23 || 
          minutes < 0 || minutes > 59) {
        throw new Error('Invalid time format');
      }

      // Get the base date in milliseconds
      const baseDate = new Date(this.nanosToMillis(dateTimestamp));
      
      // Create new date with the specified time
      const dateWithTime = new Date(Date.UTC(
        baseDate.getUTCFullYear(),
        baseDate.getUTCMonth(),
        baseDate.getUTCDate(),
        hours,
        minutes,
        0,
        0
      ));

      return this.millisToNanos(dateWithTime.getTime());
    } catch (error) {
      console.error('Error in parseTimeToNanos:', error);
      throw new Error(`Invalid time format: ${timeStr}`);
    }
  }

  /**
   * Converts date string to nanosecond timestamp
   */
  static parseDateToNanos(dateStr: string): number {
    try {
      const [day, month, year] = dateStr.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      return this.millisToNanos(date.getTime());
    } catch (error) {
      console.error('Error in parseDateToNanos:', error);
      throw new Error(`Invalid date format: ${dateStr}`);
    }
  }

  /**
   * Formats duration in nanoseconds to human-readable string
   */
  static formatDuration(durationNanos: number | bigint): string {
    try {
      const milliseconds = this.nanosToMillis(durationNanos);
      const minutes = Math.floor(milliseconds / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours > 0) {
        return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
      }
      return `${minutes}m`;
    } catch (error) {
      console.error('Error in formatDuration:', error);
      return '0m';
    }
  }

  /**
   * Converts nanoseconds to milliseconds
   */
  private static nanosToMillis(nanos: number | bigint): number {
    if (typeof nanos === 'bigint') {
      return Number(nanos) * this.NANOS_TO_MILLIS;
    }
    return nanos * this.NANOS_TO_MILLIS;
  }

  /**
   * Converts milliseconds to nanoseconds
   */
  private static millisToNanos(millis: number): number {
    return Math.floor(millis * this.MILLIS_TO_NANOS);
  }

  /**
   * Validates a timestamp
   */
  static isValidTimestamp(timestamp: number | bigint): boolean {
    try {
      const milliseconds = this.nanosToMillis(timestamp);
      const date = new Date(milliseconds);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }
}

// Calendar Formatter with improved error handling
class CalendarFormatter {
  static formatForPrompt(calendar: any): string {
    try {
      const sections: string[] = [];

      if (Array.isArray(calendar.events) && calendar.events.length > 0) {
        sections.push(this.formatEvents(calendar.events));
      }

      if (Array.isArray(calendar.availabilities) && calendar.availabilities.length > 0) {
        sections.push(this.formatAvailabilities(calendar.availabilities));
      }

      return sections.join('\n\n') || 'No events or availabilities scheduled.';
    } catch (error) {
      console.error('Error formatting calendar:', error);
      return 'Error formatting calendar data.';
    }
  }

  private static formatEvents(events: any[]): string {
    try {
      return 'Events:\n' + events
        .filter(event => TimeFormatter.isValidTimestamp(event.start_time) && 
                        TimeFormatter.isValidTimestamp(event.end_time))
        .map(event => {
          try {
            return `- "${event.title}" on ${TimeFormatter.toUTCDate(event.date)} at ` +
                   `${TimeFormatter.toUTCTime(event.start_time)} to ${TimeFormatter.toUTCTime(event.end_time)}
              ID: ${event.id}
              Description: ${event.description || 'None'}
              Duration: ${TimeFormatter.formatDuration(BigInt(event.end_time) - BigInt(event.start_time))}
              Attendees: ${event.attendees?.length ? event.attendees.join(', ') : 'None'}`;
          } catch (error) {
            console.error('Error formatting event:', error);
            return `- Error formatting event with ID: ${event.id || 'unknown'}`;
          }
        })
        .join('\n');
    } catch (error) {
      console.error('Error in formatEvents:', error);
      return 'Events: Error formatting events data.';
    }
  }

  private static formatAvailabilities(availabilities: any[]): string {
    try {
      return 'Availabilities:\n' + availabilities
        .filter(avail => Array.isArray(avail.time_slots))
        .map(avail => {
          try {
            const timeSlots = avail.time_slots
              .filter((slot: any) => TimeFormatter.isValidTimestamp(slot.start_time) && 
                                   TimeFormatter.isValidTimestamp(slot.end_time))
              .map((slot: any) => 
                `${TimeFormatter.toUTCTime(slot.start_time)} to ${TimeFormatter.toUTCTime(slot.end_time)}`
              )
              .join(', ');

            const status = avail.is_blocked ? 'Blocked' : 'Available';
            return `- ${avail.title?.[0] || status} (ID: ${avail.id})
              Schedule: ${timeSlots || 'No valid time slots'}
              Status: ${status}`;
          } catch (error) {
            console.error('Error formatting availability:', error);
            return `- Error formatting availability with ID: ${avail.id || 'unknown'}`;
          }
        })
        .join('\n');
    } catch (error) {
      console.error('Error in formatAvailabilities:', error);
      return 'Availabilities: Error formatting availabilities data.';
    }
  }
}




// Types
type TimeSlot = {
  start_time: number;
  end_time: number;
};

type Availability = {
  id: string;
  title?: string;
  schedule_type: string;
  time_slots: TimeSlot[];
  is_blocked: boolean;
};

type CalendarAction = {
  type: string;
  event?: any;
  availability?: any;
};

// Constants
const VALID_ACTION_TYPES = new Set([
  "ADD_EVENT",
  "UPDATE_EVENT",
  "DELETE_EVENT",
  "ADD_AVAILABILITY",
  "UPDATE_AVAILABILITY",
  "DELETE_AVAILABILITY",
]);

class ActionProcessor {
  static processAction(action: any): CalendarAction {
    if (!VALID_ACTION_TYPES.has(action.type)) {
      throw new Error(`Invalid action type: ${action.type}`);
    }

    const processedAction: CalendarAction = { type: action.type };

    try {
      if (action.event) {
        processedAction.event = this.processEvent(action.event);
      }

      if (action.availability) {
        processedAction.availability = this.processAvailability(action.availability);
      }

      return processedAction;
    } catch (error) {
      console.error('Error processing action:', error);
      throw new Error(`Failed to process ${action.type}: ${error.message}`);
    }
  }

  private static processEvent(event: any) {
    try {
      // First process the date to get the base timestamp for the day
      const dateTimestamp = TimeFormatter.parseDateToNanos(event.date);

      // Validate the date timestamp
      if (!TimeFormatter.isValidTimestamp(dateTimestamp)) {
        throw new Error(`Invalid date: ${event.date}`);
      }

      return {
        id: event.id,
        title: event.title,
        date: dateTimestamp,
        start_time: TimeFormatter.parseTimeToNanos(event.start_time, dateTimestamp),
        end_time: TimeFormatter.parseTimeToNanos(event.end_time, dateTimestamp),
        recurrence: event.recurrence || [],
        description: event.description || "",
        attendees: event.attendees || [],
        created_by: "",
        owner: "",
      };
    } catch (error) {
      console.error('Error processing event:', error);
      throw new Error(`Failed to process event: ${error.message}`);
    }
  }

  private static processAvailability(availability: any) {
    try {
      const now = Date.now() * 1e6; // Current time in nanoseconds

      return {
        id: availability.id,
        title: availability.title ? [availability.title] : [],
        schedule_type: availability.schedule_type || "weekly",
        is_blocked: availability.is_blocked || false,
        time_slots: availability.slots.map((slot: any) => {
          try {
            return {
              start_time: TimeFormatter.parseTimeToNanos(slot.start_time, now),
              end_time: TimeFormatter.parseTimeToNanos(slot.end_time, now),
            };
          } catch (error) {
            console.error('Error processing time slot:', error);
            throw new Error(`Invalid time slot format: ${JSON.stringify(slot)}`);
          }
        }),
      };
    } catch (error) {
      console.error('Error processing availability:', error);
      throw new Error(`Failed to process availability: ${error.message}`);
    }
  }
}

export { ActionProcessor, VALID_ACTION_TYPES };
export type { CalendarAction, Availability, TimeSlot };

export { TimeFormatter, CalendarFormatter };
