import OpenAI from 'openai';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class DeepSeekAgent {
  private openai: OpenAI;
  private model: string;
  private conversationHistory: DeepSeekMessage[];

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
    this.model = 'deepseek-chat';
    this.conversationHistory = [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      }
    ];
  }

  async sendMessage(message: string, files: any[] = []): Promise<string> {
    try {
      // Add user message to conversation history
      if (message.trim()) {
        this.conversationHistory.push({
          role: 'user',
          content: message
        });
      }
      
      // Use OpenAI SDK for the API request to DeepSeek
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: this.conversationHistory,
        max_tokens: 4096,
        temperature: 0.7
      });

      // Extract the assistant's response
      const assistantMessage = response.choices[0].message.content || '';
      
      // Log the response from DeepSeek
      console.log('DeepSeek API response:', assistantMessage);
      
      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });
      
      return assistantMessage;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      
      let errorMessage = 'Failed to get response from AI';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  clearConversation(): void {
    // Reset conversation but keep the system message
    this.conversationHistory = [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      }
    ];
  }
}