import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function fineTuneGemeni() {
  const parts = [
    {
      text: 'input: Convert this text into a calendar JSON object: "Postpone the Meeting with David to 1 PM"\n\nNote: my original calendar shows the meeting with David is currently 30 minutes long.',
    },
    {
      text: 'output: { "events": [{ "id": "evt_3", "title": "Meeting with David", "description": "Discuss something", "start_time": "17-02-2025T13:00", "end_time": "17-02-2025T13:30", "created_by": "", "attendees": ["David"], "recurrence": null }] }',
    },
    // Example 2: Postpone meeting with Klover
    {
      text: 'input: Convert this text into a calendar JSON object: "Postpone the Meeting with Klover to 10 PM"\n\nNote: my original calendar shows the meeting with Klover is currently 30 minutes long.',
    },
    {
      text: 'output: { "events": [{ "id": "evt_3", "title": "Meeting with Klover", "description": null, "start_time": "17-02-2025T22:00", "end_time": "17-02-2025T22:30", "created_by": "", "attendees": ["Klover"], "recurrence": null }] }',
    },
    // Example 3: Another variation
    {
      text: 'input: Convert this text into a calendar JSON object: "Postpone the Meeting with Alex to 3 PM"\n\nNote: my original calendar shows the meeting with Alex is currently 30 minutes long.',
    },
    {
      text: 'output: { "events": [{ "id": "evt_1", "title": "Meeting with Alex", "description": "Discuss oDoc", "start_time": "17-02-2025T15:00", "end_time": "17-02-2025T15:30", "created_by": "", "attendees": ["Alex"], "recurrence": null }] }',
    },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
  });
  console.log(result.response.text());
}
export default fineTuneGemeni;
