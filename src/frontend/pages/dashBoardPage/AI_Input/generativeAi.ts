import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../../../DevUtils/logData";

const timestampToFormattedString = (timestamp) => {
  const date = new Date(Math.floor(timestamp / 1000000)); // Convert from nanoseconds to milliseconds
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year}T${hours}:${minutes}`;
};

async function generateCalendarData(inputText: string, originalCalendar: any) {
  const formattedCalendar = {
    ...originalCalendar,
    events: originalCalendar.events.map((event) => ({
      ...event,
      start_time: timestampToFormattedString(event.start_time),
      end_time: timestampToFormattedString(event.end_time),
    })),
    availabilities: originalCalendar.availabilities.map((avail) => ({
      ...avail,
      schedule_type: {
        DateRange: {
          start_date: timestampToFormattedString(
            avail.schedule_type.DateRange.start_date,
          ),
          end_date: timestampToFormattedString(
            avail.schedule_type.DateRange.end_date,
          ),
        },
      },
    })),
    blocked_times: originalCalendar.blocked_times.map((block) => ({
      ...block,
      block_type: {
        SingleBlock: {
          start_time: timestampToFormattedString(
            block.block_type.SingleBlock.start_time,
          ),
          end_time: timestampToFormattedString(
            block.block_type.SingleBlock.end_time,
          ),
        },
      },
    })),
  };

  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    if (!inputText || typeof inputText !== "string") {
      throw new Error("Invalid input text");
    }

    const prompt = `Convert this text into a calendar JSON object: "${inputText}"

Only return a valid JSON object with these time formats:
- For specific times of day use format "HH:mm" (e.g., "09:00", "14:30")
- For full dates use format "DD-MM-YYYYTHH:mm" (e.g., "01-01-2025T09:00")
- DO NOT return timestamps in nanoseconds format
- Both start_time and end_time must use the same format

All dates should:
- Use 24-hour time format
- Include leading zeros for single digit numbers
- For dates, use format DD-MM-YYYY
- Include the 'T' separator between date and time

Example JSON for "meeting tomorrow morning":
{
  "events": [
    {
      "id": "evt_1",
      "title": "Meeting",
      "description": "Scheduled meeting",
      "start_time": "17-02-2025T09:00",
      "end_time": "17-02-2025T10:00",
      "created_by": "",
      "attendees": [],
      "recurrence": null
    }
  ]
}

To delete events, include them in a "deletions" object like this:
{
  "deletions": {
    "events": ["evt_1", "evt_2"],  // IDs of events to delete
    "availabilities": ["avl_1"],
    "blocked_times": ["blk_1"]
  }
}

Example JSON for "delete the meeting with id evt_123":
{
  "deletions": {
    "events": ["evt_123"],
    "availabilities": [],
    "blocked_times": []
  }
}

Example JSON for "delete all events":
{
  "deletions": {
    "events": "ALL",
    "availabilities": [],
    "blocked_times": []
  }
}

Note: my original calendar is ${JSON.stringify(formattedCalendar)}`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 40,
      },
    });

    const response = await result.response;
    const responseText = response.text();

    // Find and parse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const calendarData = JSON.parse(jsonMatch[0]);
    console.log({ calendarData, prompt });

    // Helper function to convert time strings to nanoseconds
    const convertToNanoseconds = (timeStr: string | number): number => {
      if (typeof timeStr === "number") {
        return timeStr;
      }

      if (!timeStr || typeof timeStr !== "string") {
        throw new Error(`Invalid time string format: ${timeStr}`);
      }

      try {
        let date: Date;

        if (timeStr.includes("T")) {
          const [datePart, timePart] = timeStr.split("T");
          const [day, month, year] = datePart.split("-").map(Number);
          const [hours, minutes] = timePart.split(":").map(Number);

          if (!day || !month || !year || !hours || minutes === undefined) {
            throw new Error(`Invalid date-time parts: ${timeStr}`);
          }

          date = new Date();
          date.setFullYear(year, month - 1, day);
          date.setHours(hours, minutes, 0, 0);
        } else {
          const [hours, minutes] = timeStr.split(":").map(Number);

          if (!hours || minutes === undefined) {
            throw new Error(`Invalid time parts: ${timeStr}`);
          }

          date = new Date();
          date.setHours(hours, minutes, 0, 0);
        }

        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date created from: ${timeStr}`);
        }

        return date.getTime() * 1000000;
      } catch (error) {
        console.error("Error converting time string:", error);
        throw new Error(`Failed to convert time string: ${timeStr}`);
      }
    };

    // Process events
    const processEvents = (events: any[]) => {
      return events.map((event) => {
        if (!event.start_time || !event.end_time) {
          throw new Error(
            `Missing time fields in event: ${JSON.stringify(event)}`,
          );
        }

        return {
          ...event,
          created_by: "",
          attendees: Array.isArray(event.attendees) ? event.attendees : [],
          recurrence: null,
          start_time: convertToNanoseconds(event.start_time),
          end_time: convertToNanoseconds(event.end_time),
        };
      });
    };

    // Process availabilities
    const processAvailabilities = (availabilities: any[]) => {
      return availabilities.map((avail) => {
        if (
          !avail.schedule_type?.DateRange?.start_date ||
          !avail.schedule_type?.DateRange?.end_date
        ) {
          throw new Error(
            `Missing date range in availability: ${JSON.stringify(avail)}`,
          );
        }

        return {
          ...avail,
          schedule_type: {
            DateRange: {
              start_date: convertToNanoseconds(
                avail.schedule_type.DateRange.start_date,
              ),
              end_date: convertToNanoseconds(
                avail.schedule_type.DateRange.end_date,
              ),
            },
          },
          time_slots: (avail.time_slots || []).map((slot: any) => ({
            start_time: convertToNanoseconds(slot.start_time),
            end_time: convertToNanoseconds(slot.end_time),
          })),
        };
      });
    };

    // Process blocked times
    const processBlockedTimes = (blockedTimes: any[]) => {
      return blockedTimes.map((block) => {
        if (
          !block.block_type?.SingleBlock?.start_time ||
          !block.block_type?.SingleBlock?.end_time
        ) {
          throw new Error(
            `Missing time fields in blocked time: ${JSON.stringify(block)}`,
          );
        }

        return {
          ...block,
          block_type: {
            SingleBlock: {
              start_time: convertToNanoseconds(
                block.block_type.SingleBlock.start_time,
              ),
              end_time: convertToNanoseconds(
                block.block_type.SingleBlock.end_time,
              ),
            },
          },
        };
      });
    };

    // Generate actions
    const actions = [];

    // Handle deletions
    if (calendarData.deletions) {
      // Handle event deletions
      if (calendarData.deletions.events === "ALL") {
        // Delete all events
        originalCalendar.events.forEach((event: any) => {
          actions.push({
            type: "DELETE_EVENT",
            eventId: event.id,
          });
        });
      } else if (Array.isArray(calendarData.deletions.events)) {
        calendarData.deletions.events.forEach((eventId: string) => {
          if (originalCalendar.events.find((e: any) => e.id === eventId)) {
            actions.push({
              type: "DELETE_EVENT",
              eventId,
            });
          }
        });
      }

      // Handle availability deletions
      if (Array.isArray(calendarData.deletions.availabilities)) {
        calendarData.deletions.availabilities.forEach((availId: string) => {
          if (
            originalCalendar.availabilities.find((a: any) => a.id === availId)
          ) {
            actions.push({
              type: "DELETE_AVAILABILITY",
              availabilityId: availId,
            });
          }
        });
      }

      // Handle blocked time deletions
      if (Array.isArray(calendarData.deletions.blocked_times)) {
        calendarData.deletions.blocked_times.forEach((blockId: string) => {
          if (
            originalCalendar.blocked_times.find((b: any) => b.id === blockId)
          ) {
            actions.push({
              type: "DELETE_BLOCKED_TIME",
              blockedTimeId: blockId,
            });
          }
        });
      }
    }

    // Handle events
    if (calendarData.events?.length > 0) {
      const processedEvents = processEvents(calendarData.events);

      // First add the bulk action if there are multiple new events
      const newEvents = processedEvents.filter(
        (event) => !originalCalendar.events.find((e: any) => e.id === event.id),
      );

      if (newEvents.length > 1) {
        // TODO Do not ADD_EVENTS instead make a list of ADD_EVENT
        actions.push({
          type: "ADD_EVENTS",
          events: newEvents,
        });
      } else {
        newEvents.forEach((event) => {
          actions.push({
            type: "ADD_EVENT",
            event,
          });
        });
      }

      // Handle updates separately
      const updatedEvents = processedEvents.filter((event) =>
        originalCalendar.events.find((e: any) => e.id === event.id),
      );

      updatedEvents.forEach((event) => {
        actions.push({
          type: "UPDATE_EVENT",
          event,
        });
      });
    }

    // Handle availabilities
    if (calendarData.availabilities?.length > 0) {
      const processedAvailabilities = processAvailabilities(
        calendarData.availabilities,
      );
      processedAvailabilities.forEach((availability) => {
        const existingAvailability = originalCalendar.availabilities.find(
          (a: any) => a.id === availability.id,
        );
        actions.push({
          type: existingAvailability
            ? "UPDATE_AVAILABILITY"
            : "ADD_AVAILABILITY",
          availability,
        });
      });
    }

    // Handle blocked times
    if (calendarData.blocked_times?.length > 0) {
      const processedBlockedTimes = processBlockedTimes(
        calendarData.blocked_times,
      );
      processedBlockedTimes.forEach((blockedTime) => {
        const existingBlockedTime = originalCalendar.blocked_times.find(
          (b: any) => b.id === blockedTime.id,
        );
        actions.push({
          type: existingBlockedTime
            ? "UPDATE_BLOCKED_TIME"
            : "ADD_BLOCKED_TIME",
          blocked_time: blockedTime,
        });
      });
    }

    return actions;
  } catch (error) {
    console.error("Calendar Generation Error:", error);
    throw error;
  }
}

export default generateCalendarData;
