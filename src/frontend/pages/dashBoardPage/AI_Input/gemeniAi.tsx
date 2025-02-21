import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calendar } from "../../../../declarations/backend/backend.did";

// Types for the calendar actions
type CalendarActionType =
  | "ADD_EVENT"
  | "UPDATE_EVENT"
  | "DELETE_EVENT"
  | "ADD_AVAILABILITY"
  | "UPDATE_AVAILABILITY"
  | "DELETE_AVAILABILITY"
  | "UPDATE_BLOCKED_TIME"
  | "DELETE_BLOCKED_TIME";

interface CalendarAction {
  type: CalendarActionType;
  event?: any;
  availability?: any;
  blocked_time?: any;
  id?: string;
  id?: string;
}

// Time formatting utilities
class TimeFormatter {
  private static readonly TIME_FORMAT: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  private static readonly DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  static formatTime(timestamp: number): string {
    try {
      const date = new Date(timestamp / 1e6);
      return date.toLocaleTimeString("en-US", this.TIME_FORMAT);
    } catch (error) {
      throw new Error(
        `Invalid timestamp for time formatting: ${error.message}`,
      );
    }
  }

  static formatDate(timestamp: number): string {
    try {
      const date = new Date(timestamp / 1e6);
      const formatted = date.toLocaleDateString("en-GB", this.DATE_FORMAT);
      return formatted.split("/").join("-");
    } catch (error) {
      throw new Error(
        `Invalid timestamp for date formatting: ${error.message}`,
      );
    }
  }

  static parseTime(timeStr: string, dateObj: Date = new Date()): number {
    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time format");
      }
      const newDate = new Date(dateObj);
      newDate.setHours(hours, minutes, 0, 0);
      return newDate.getTime() * 1e6;
    } catch (error) {
      throw new Error(`Failed to parse time string: ${error.message}`);
    }
  }

  static parseDate(dateStr: string): number {
    try {
      const [day, month, year] = dateStr.split("-").map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Invalid date format");
      }
      const date = new Date(year, month - 1, day);
      if (date.toString() === "Invalid Date") {
        throw new Error("Invalid date components");
      }
      return date.getTime() * 1e6;
    } catch (error) {
      throw new Error(`Failed to parse date string: ${error.message}`);
    }
  }
}

// Calendar formatter for AI prompt
class CalendarFormatter {
  static formatCalendarForPrompt(calendar: Calendar): string {

    const sections: string[] = [];
    if (calendar?.events?.length) {
      sections.push(
        "Events:\n" +
          calendar?.events
            .map(
              (event) =>
                `- "${event.title}" on ${TimeFormatter.formatDate(event.start_time)} at ${TimeFormatter.formatTime(event.start_time)} to ${TimeFormatter.formatTime(event.end_time)}
        ID: ${event.id}
        Description: ${event.description?.[0] || "None"}
        Attendees: ${event.attendees?.length ? event.attendees.join(", ") : "None"}`,
            )
            .join("\n"),
      );
    }

    if (calendar?.availabilities?.length) {
      sections.push(
        "Availabilities:\n" +
          calendar?.availabilities
            .map((avail) => {
              const timeSlots = avail.time_slots
                .map(
                  (slot) =>
                    `${TimeFormatter.formatTime(Number(slot.start_time))} to ${TimeFormatter.formatTime(Number(slot.end_time))}`,
                )
                .join(", ");
              return `- ${avail.title?.[0] || "Available"} (ID: ${avail.id})
        Schedule: ${timeSlots}`;
            })
            .join("\n"),
      );
    }

    if (calendar.blocked_times?.length) {
      sections.push(
        "Blocked Times:\n" +
          calendar.blocked_times
            .map((block) => {
              if ("SingleBlock" in block.block_type) {
                return `- Blocked on ${TimeFormatter.formatDate(block.block_type.SingleBlock.start_time)} from ${TimeFormatter.formatTime(block.block_type.SingleBlock.start_time)} to ${TimeFormatter.formatTime(block.block_type.SingleBlock.end_time)}
          ID: ${block.id}
          Reason: ${block.reason?.[0] || "None"}`;
              } else if ("FullDayBlock" in block.block_type) {
                return `- Blocked full day on ${TimeFormatter.formatDate(block.block_type.FullDayBlock.date)}
          ID: ${block.id}
          Reason: ${block.reason?.[0] || "None"}`;
              }
              return "";
            })
            .join("\n"),
      );
    }

    return sections.join("\n\n");
  }
}

// Action processor
class ActionProcessor {
  static validateEventAction(action: any): boolean {
    return (
      action.event &&
      typeof action.event.date === "string" &&
      typeof action.event.start_time === "string" &&
      typeof action.event.end_time === "string"
    );
  }

  static validateAvailabilityAction(action: any): boolean {
    return (
      action.availability &&
      Array.isArray(action.availability.slots) &&
      action.availability.slots.every(
        (slot: any) =>
          typeof slot.start_time === "string" &&
          typeof slot.end_time === "string",
      )
    );
  }

  static validateBlockedTimeAction(action: any): boolean {
    return (
      action.blocked_time &&
      typeof action.blocked_time.date === "string" &&
      typeof action.blocked_time.start_time === "string" &&
      typeof action.blocked_time.end_time === "string"
    );
  }

  static processAction(action: any): CalendarAction {
    const newAction: CalendarAction = { type: action.type };

    try {
      // Process event actions
      if (action.type.includes("EVENT")) {
        if (action.type === "DELETE_EVENT") {
          newAction.id = action.id;
          return newAction;
        }

        if (!this.validateEventAction(action)) {
          throw new Error(
            `Invalid event data in action: ${JSON.stringify(action)}`,
          );
        }

        const dateTimestamp = TimeFormatter.parseDate(action.event.date);
        newAction.event = {
          recurrence: action.event.recurrence || [],
          id: action.event.id || `evt_${Date.now()}`,
          title: action.event.title || "",
          start_time: TimeFormatter.parseTime(
            action.event.start_time,
            new Date(dateTimestamp / 1e6),
          ),
          end_time: TimeFormatter.parseTime(
            action.event.end_time,
            new Date(dateTimestamp / 1e6),
          ),
          description: String(action.event.description),
          attendees: action.event.attendees || [],
          created_by: "",
        };
      }

      // Process availability actions
      if (action.type.includes("AVAILABILITY")) {
        if (action.type === "DELETE_AVAILABILITY") {
          newAction.id = action.id;
          return newAction;
        }

        if (!this.validateAvailabilityAction(action)) {
          throw new Error(
            `Invalid availability data in action: ${JSON.stringify(action)}`,
          );
        }

        newAction.availability = {
          id: action.availability.id || `avail_${Date.now()}`,
          title: action.availability.title ? [action.availability.title] : [],
          is_blocked: action.availability.is_blocked || false, // Add missing field
          schedule_type: action.availability.schedule_type || "WEEKLY",
          time_slots: action.availability.slots.map((slot: any) => ({
            start_time: TimeFormatter.parseTime(slot.start_time),
            end_time: TimeFormatter.parseTime(slot.end_time),
          })),
        };
      }

      // Process blocked time actions
      if (action.type.includes("BLOCKED_TIME")) {
        if (action.type === "DELETE_BLOCKED_TIME") {
          newAction.id = action.id;
          return newAction;
        }

        if (!this.validateBlockedTimeAction(action)) {
          throw new Error(
            `Invalid blocked time data in action: ${JSON.stringify(action)}`,
          );
        }

        const dateTimestamp = TimeFormatter.parseDate(action.blocked_time.date);
        newAction.blocked_time = {
          id: action.blocked_time.id || `block_${Date.now()}`,
          block_type: {
            SingleBlock: {
              start_time: TimeFormatter.parseTime(
                action.blocked_time.start_time,
                new Date(dateTimestamp / 1e6),
              ),
              end_time: TimeFormatter.parseTime(
                action.blocked_time.end_time,
                new Date(dateTimestamp / 1e6),
              ),
            },
          },
          reason: action.blocked_time.reason
            ? [action.blocked_time.reason]
            : [],
        };
      }

      return newAction;
    } catch (error) {
      throw new Error(
        `Failed to process action ${action.type}: ${error.message}`,
      );
    }
  }
}

// Main processing function
export async function processCalendarText(
  text: string,
  oldCalendar: Calendar,
  dispatch: (action: any) => void,
): Promise<CalendarAction[]> {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const now = Date.now() * 1e6;

    const prompt = `
      Current time: ${TimeFormatter.formatTime(now)} ${TimeFormatter.formatDate(now)}
      
      Current Calendar: ${CalendarFormatter.formatCalendarForPrompt(oldCalendar)}
      
      User input: ${text}
      
      Generate a JSON array response. Events MUST use these formats:
      - Dates: "DD-MM-YYYY" (e.g. "01-01-2025")
      - Times: "HH:mm" in 24-hour format (e.g. "09:00", "14:30")
      
      Response must be a JSON array with single actions. Each action must have a "type":
      - For events: "ADD_EVENT", "UPDATE_EVENT", "DELETE_EVENT"
      - For availability: "ADD_AVAILABILITY", "UPDATE_AVAILABILITY", "DELETE_AVAILABILITY"
      - For blocked times: "UPDATE_BLOCKED_TIME", "DELETE_BLOCKED_TIME"
      
      For availability actions, use this format:
      {
        "type": "ADD_AVAILABILITY",
        "availability": {
          "id": "avail_timestamp",
          "title": "Working Hours",
          "is_blocked": false,           // <- if I say ai am not available add "is_blocked": false, instead 
          "schedule_type": {
              "WeeklyRecurring": {
                "days": [1, 2, 3, 4],  // Monday=1, Tuesday=2, Wednesday=3, Thursday=4
                "valid_until": []  // <- if user say for example "until next month" then this will be the date [dateTime]
              }
            },
          "slots": [
            {
              "start_time": "09:00",
              "end_time": "17:00"
            }
          ]
        }
      }
      
      For event actions, use this format:
      {
        "type": "ADD_EVENT",
        "event": {
          "id": "evt_timestamp",
          "title": "Team Meeting",
          "date": "17-02-2025",
          "start_time": "09:00",
          "end_time": "10:00",
          "description": "Weekly sync", // or just ""
          "attendees": ["3qisy-ems35-y4kfh-kkiyq-yx6w6-fiuzv-k5qoc-v4efn-ka7er-4ojgh-zae" ], // id of the user
          "recurrence": [{frequency: {Daily:null}}] // or [{interval:2}] or [{until:34343}] or [{count:3}] most times just keep []
        }
      }
      
      For delete/cancel/remove event 
      {
      "type": "DELETE_EVENT",
      "id": "0.7326486663335694"
      }
      For delete/cancel/remove availability
      {
        "type": "DELETE_AVAILABILITY",
        "id": "0.7326486663335694"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json\n|\n```|```/g, "").trim();

    // Store training data before parsing
    try {
      dispatch({
        type: "SET_TRAINING_DATA",
        training_data: {
          input: prompt,
          output: JSON.parse(cleanedText),
        },
      });
    } catch (error) {
      console.log("Failed to store training data:", error);
      // Continue execution even if training data storage fails
    }

    // Parse the response
    let parsed: any[];
    try {
      parsed = JSON.parse(cleanedText);
    } catch (error) {
      console.error("Failed to parse AI response:", cleanedText);
      throw new Error(`Invalid JSON response: ${error.message}`);
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Response must be an array");
    }

    // Process each action and validate
    return parsed.map((action) => {
      if (!action.type || typeof action.type !== "string") {
        throw new Error(`Invalid action type: ${JSON.stringify(action)}`);
      }

      // Explicitly filter out ADD_EVENTS type
      if (action.type === "ADD_EVENTS") {
        throw new Error("ADD_EVENTS action type is not supported");
      }

      return ActionProcessor.processAction(action);
    });
  } catch (error) {
    console.error("Error processing calendar text:", error);
    throw error;
  }
}
