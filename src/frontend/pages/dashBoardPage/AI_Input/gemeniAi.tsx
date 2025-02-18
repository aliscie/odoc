import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calendar } from "../../../../declarations/backend/backend.did";

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

// Time formatting utilities
class TimeFormatter {
  private static MICROSECONDS_MULTIPLIER = 1e6;

  static toUTCTime(timestamp: number): string {
    const date = new Date(timestamp / this.MICROSECONDS_MULTIPLIER);
    return date.toISOString().slice(11, 16); // Returns HH:mm in UTC
  }

  static toUTCDate(timestamp: number): string {
    const date = new Date(timestamp / this.MICROSECONDS_MULTIPLIER);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  static parseTimeToMicroseconds(
    timeStr: string,
    dateTimestamp: number,
  ): number {
    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        throw new Error("Invalid time format");
      }

      // Use the provided date timestamp to get the base date
      const baseDate = new Date(dateTimestamp / this.MICROSECONDS_MULTIPLIER);

      // Create new date with the same day but specified time
      const dateWithTime = new Date(
        Date.UTC(
          baseDate.getUTCFullYear(),
          baseDate.getUTCMonth(),
          baseDate.getUTCDate(),
          hours,
          minutes,
          0,
          0,
        ),
      );

      return dateWithTime.getTime() * this.MICROSECONDS_MULTIPLIER;
    } catch (error) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }
  }

  static parseDateToMicroseconds(dateStr: string): number {
    try {
      const [day, month, year] = dateStr.split("-").map(Number);
      // Set time to midnight UTC for the specified date
      const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.getTime() * this.MICROSECONDS_MULTIPLIER;
    } catch (error) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }
  }
}
// Calendar formatter
class CalendarFormatter {
  static formatForPrompt(calendar: Calendar): string {
    const sections: string[] = [];

    if (calendar.events?.length) {
      sections.push(this.formatEvents(calendar.events));
    }

    if (calendar.availabilities?.length) {
      sections.push(this.formatAvailabilities(calendar.availabilities));
    }

    return sections.join("\n\n");
  }

  private static formatEvents(events: any[]): string {
    return (
      "Events:\n" +
      events
        .map(
          (event) =>
            `- "${event.title}" on ${TimeFormatter.toUTCDate(event.date)} at ${TimeFormatter.toUTCTime(event.start_time)} to ${TimeFormatter.toUTCTime(event.end_time)}
        ID: ${event.id}
        Description: ${event.description || "None"}
        recurrence: ${event.recurrence ? event.recurrence.join(", ") : "None"}
        Attendees: ${event.attendees?.length ? event.attendees.join(", ") : "None"}`,
        )
        .join("\n")
    );
  }

  private static formatAvailabilities(availabilities: any[]): string {
    return (
      "Availabilities:\n" +
      availabilities
        .map((avail) => {
          const timeSlots = avail.time_slots
            .map(
              (slot: TimeSlot) =>
                `${TimeFormatter.toUTCTime(Number(slot.start_time))} to ${TimeFormatter.toUTCTime(Number(slot.end_time))}`,
            )
            .join(", ");
          const status = avail.is_blocked ? "Blocked" : "Available";
          return `- ${avail.title?.[0] || status} (ID: ${avail.id})
        Schedule: ${timeSlots}
        Status: ${status}`;
        })
        .join("\n")
    );
  }
}

// Main processor
export async function processCalendarText(
  text: string,
  oldCalendar: Calendar,
  dispatch: any,
): Promise<CalendarAction[]> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error("Gemini API key is missing");
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const now = Date.now() * 1e6;

    const prompt = `
      Current UTC time: ${TimeFormatter.toUTCTime(now)} ${TimeFormatter.toUTCDate(now)}
      
      Current Calendar: ${CalendarFormatter.formatForPrompt(oldCalendar)}
      
      User input: ${text}
      
      Generate a JSON array response. All times should be in UTC.
      For availability, use this format:
      {
        "type": "ADD_AVAILABILITY",
        "availability": {
          "id": "avail_${Date.now()}",
          "title": "Regular Availability",
          "schedule_type": "weekly",
          "is_blocked": false,
          "slots": [
            {
              "start_time": "09:00",
              "end_time": "13:00"
            }
          ]
        }
      }

      Times must be in "HH:mm" 24-hour format UTC (e.g. "09:00", "14:30")
      Dates must be in "DD-MM-YYYY" format
      
      Response must be a JSON array with ONLY these action types:
      - For single events: "ADD_EVENT", "UPDATE_EVENT", "DELETE_EVENT"
      - For availability: "ADD_AVAILABILITY", "UPDATE_AVAILABILITY", "DELETE_AVAILABILITY"
      
      Note: Use is_blocked: true to indicate blocked time slots
    `;

    let result;
    try {
      result = await model.generateContent(prompt);
      if (!result || !result.response) {
        throw new Error("No response from Gemini API");
      }
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }

    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json\n|\n```|```/g, "").trim();

    let parsed: any[];
    try {
      parsed = JSON.parse(cleanedText);
      dispatch({
        type: "SET_TRAINING_DATA",
        training_data: { input: prompt, output: parsed },
      });
    } catch (error) {
      throw new Error(`Invalid JSON response: ${error.message}`);
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Response must be an array");
    }

    return parsed.map((action) => ActionProcessor.processAction(action));
  } catch (error) {
    console.error("Error processing calendar text:", error);
    throw error;
  }
}

// Updated Action Processor
class ActionProcessor {
  static processAction(action: any): CalendarAction {
    if (!VALID_ACTION_TYPES.has(action.type)) {
      throw new Error(`Invalid action type: ${action.type}`);
    }

    const processedAction: CalendarAction = { type: action.type };

    if (action.event) {
      processedAction.event = this.processEvent(action.event);
    }

    if (action.availability) {
      processedAction.availability = this.processAvailability(
        action.availability,
      );
    }

    return processedAction;
  }

  private static processEvent(event: any) {
    // First process the date to get the base timestamp for the day
    const dateTimestamp = TimeFormatter.parseDateToMicroseconds(event.date);

    return {
      id: event.id,
      title: event.title,
      date: dateTimestamp, // Add the date field
      start_time: TimeFormatter.parseTimeToMicroseconds(
        event.start_time,
        dateTimestamp,
      ),
      end_time: TimeFormatter.parseTimeToMicroseconds(
        event.end_time,
        dateTimestamp,
      ),
      recurrence: event.recurrence || [],
      description: event.description || "",
      attendees: event.attendees || [],
      created_by: "",
      owner: "", // Added owner field as per the Rust struct
    };
  }

  private static processAvailability(availability: any) {
    return {
      id: availability.id,
      title: availability.title ? [availability.title] : [],
      schedule_type: availability.schedule_type || "weekly",
      is_blocked: availability.is_blocked || false,
      time_slots: availability.slots.map((slot: any) => ({
        start_time: TimeFormatter.parseTimeToMicroseconds(slot.start_time),
        end_time: TimeFormatter.parseTimeToMicroseconds(slot.end_time),
      })),
    };
  }
}
