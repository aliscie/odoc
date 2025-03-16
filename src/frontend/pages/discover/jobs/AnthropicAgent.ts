import Anthropic from '@anthropic-ai/sdk';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export class AnthropicAgent {
  private anthropic: Anthropic;
  private model: string;
  private conversationHistory: Message[];

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
    this.model = 'claude-3-opus-20240229';
    this.conversationHistory = [];
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });
      
      // Use Anthropic SDK for the API request
      const response = await this.anthropic.messages.create({
        model: this.model,
        messages: this.conversationHistory,
        max_tokens: 4096,
        temperature: 0.6
      });

      // Extract the assistant's response
      const assistantMessage = response.content[0].text;
      
      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });
      
      return assistantMessage;
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      
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