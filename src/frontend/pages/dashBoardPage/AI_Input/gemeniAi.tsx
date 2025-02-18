import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calendar } from "../../../../declarations/backend/backend.did";
import {ActionProcessor, CalendarAction, CalendarFormatter, TimeFormatter} from "./utiles";

// Types
type TimeSlot = {
  start_time: number;
  end_time: number;
};



// Constants

// Time formatting utilities
// Calendar formatter

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
