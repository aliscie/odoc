import { GoogleGenerativeAI } from "@google/generative-ai";

interface GeminiMessage {
  role: 'user' | 'model';
  parts: string[];
}

export class GeminiAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationHistory: GeminiMessage[];

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-1219" });
    this.conversationHistory = [];
  }

  async sendMessage(message: string, files: any[] = []): Promise<string> {
    try {
      // Create a chat session with existing history
      const chat = this.model.startChat({
        history: this.conversationHistory
      });
      
      // Send the message to Gemini
      const response = await chat.sendMessage(message);
      
      // Extract the assistant's response
      const assistantMessage = response.response.text();
      
      // Log the response from Gemini
      console.log('Gemini API response:', assistantMessage);
      
      // Add both user message and assistant response to conversation history
      if (message.trim()) {
        this.conversationHistory.push({
          role: 'user',
          parts: [message]
        });
      }
      
      this.conversationHistory.push({
        role: 'model',
        parts: [assistantMessage]
      });
      
      return assistantMessage;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      let errorMessage = 'Failed to get response from AI';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  clearConversation(): void {
    this.conversationHistory = [];
  }
}