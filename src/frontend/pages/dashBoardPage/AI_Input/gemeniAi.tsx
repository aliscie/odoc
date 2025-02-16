import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calendar } from "../../../../declarations/backend/backend.did";
import { logger } from "../../../DevUtils/logData";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper function to convert microsecond timestamp to formatted time
function formatTime(timestamp: number): string {
  const date = new Date(timestamp / 1e6);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper function to convert microsecond timestamp to formatted date
function formatDate(timestamp: number): string {
  const date = new Date(timestamp / 1e6);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}

// Helper function to parse time string to Date
function parseTime(timeStr: string, dateObj: Date = new Date()): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj.getTime() * 1e6;
}

// Helper function to parse date string to timestamp
function parseDate(dateStr: string): number {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).getTime() * 1e6;
}

// Format calendar data for the prompt
function formatCalendarForPrompt(calendar: Calendar): string {
  let formattedData = '';

  if (calendar.events?.length) {
    formattedData += '\nEvents:\n';
    calendar.events.forEach(event => {
      formattedData += `- "${event.title}" on ${formatDate(event.start_time)} at ${formatTime(event.start_time)} to ${formatTime(event.end_time)}
        ID: ${event.id}
        Description: ${event.description?.[0] || 'None'}
        Attendees: ${event.attendees?.length ? event.attendees.join(', ') : 'None'}\n`;
    });
  }

  if (calendar.availabilities?.length) {
    formattedData += '\nAvailabilities:\n';
    calendar.availabilities.forEach(avail => {
      const timeSlots = avail.time_slots.map(slot =>
        `${formatTime(Number(slot.start_time))} to ${formatTime(Number(slot.end_time))}`
      ).join(', ');
      formattedData += `- ${avail.title?.[0] || 'Available'} (ID: ${avail.id})
        Schedule: ${timeSlots}\n`;
    });
  }

  if (calendar.blocked_times?.length) {
    formattedData += '\nBlocked Times:\n';
    calendar.blocked_times.forEach(block => {
      if ('SingleBlock' in block.block_type) {
        formattedData += `- Blocked on ${formatDate(block.block_type.SingleBlock.start_time)} from ${formatTime(block.block_type.SingleBlock.start_time)} to ${formatTime(block.block_type.SingleBlock.end_time)}
          ID: ${block.id}
          Reason: ${block.reason?.[0] || 'None'}\n`;
      } else if ('FullDayBlock' in block.block_type) {
        formattedData += `- Blocked full day on ${formatDate(block.block_type.FullDayBlock.date)}
          ID: ${block.id}
          Reason: ${block.reason?.[0] || 'None'}\n`;
      }
    });
  }

  return formattedData;
}

export async function processCalendarText(
  text: string,
  oldCalendar: Calendar,
): Promise<CalendarAction[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const now = Date.now() * 1e6;

    const prompt = `
      Current time: ${formatTime(now)} ${formatDate(now)}
      
      Current Calendar: ${formatCalendarForPrompt(oldCalendar)}
      
      User input: ${text}
      
      Generate a JSON array response. Events MUST use these formats:
      - Dates: "DD-MM-YYYY" (e.g. "01-01-2025")
      - Times: "HH:mm" in 24-hour format (e.g. "09:00", "14:30")
      
      Response must be a JSON array with actions. Each action must have a "type":
      - For events: "ADD_EVENT", "UPDATE_EVENT", "DELETE_EVENT"
      - For availability: "ADD_AVAILABILITY", "UPDATE_AVAILABILITY", "DELETE_AVAILABILITY"
      - For blocked times: "ADD_BLOCKED_TIME", "UPDATE_BLOCKED_TIME", "DELETE_BLOCKED_TIME"
      
      Example response:
      [
        {
          "type": "ADD_EVENT",
          "event": {
            "id": "evt_${Date.now()}",
            "title": "Team Meeting",
            "date": "17-02-2025",
            "start_time": "09:00",
            "end_time": "10:00",
            "description": "Weekly sync",
            "attendees": ["John", "Sarah"]
          }
        },
        {
          "type": "ADD_BLOCKED_TIME",
          "blocked_time": {
            "id": "block_${Date.now()}",
            "date": "17-02-2025",
            "start_time": "14:00",
            "end_time": "15:00",
            "reason": "Focus time"
          }
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json\n|\n```|```/g, "").trim();

    let parsed: any[];
    try {
      parsed = JSON.parse(cleanedText);
      logger("Parsed response:", parsed);
    } catch (error) {
      throw new Error(`Invalid JSON response: ${error.message}`);
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Response must be an array");
    }

    // Convert the parsed actions to proper format with timestamps
    return parsed.map(action => {
      const newAction: any = { type: action.type };

      if (action.event) {
        const dateTimestamp = parseDate(action.event.date);
        newAction.event = {
          id: action.event.id,
          title: action.event.title,
          start_time: parseTime(action.event.start_time, new Date(dateTimestamp / 1e6)),
          end_time: parseTime(action.event.end_time, new Date(dateTimestamp / 1e6)),
          description: action.event.description ? [action.event.description] : [],
          attendees: action.event.attendees || [],
          created_by: ""
        };
      }

      if (action.blocked_time) {
        const dateTimestamp = parseDate(action.blocked_time.date);
        newAction.blocked_time = {
          id: action.blocked_time.id,
          block_type: {
            SingleBlock: {
              start_time: parseTime(action.blocked_time.start_time, new Date(dateTimestamp / 1e6)),
              end_time: parseTime(action.blocked_time.end_time, new Date(dateTimestamp / 1e6))
            }
          },
          reason: action.blocked_time.reason ? [action.blocked_time.reason] : []
        };
      }

      if (action.availability) {
        newAction.availability = {
          id: action.availability.id,
          title: action.availability.title ? [action.availability.title] : [],
          schedule_type: action.availability.schedule_type,
          time_slots: action.availability.slots.map((slot: any) => ({
            start_time: parseTime(slot.start_time),
            end_time: parseTime(slot.end_time)
          }))
        };
      }

      return newAction;
    });
  } catch (error) {
    logger("Error processing calendar text:", error);
    throw error;
  }
}
