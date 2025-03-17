import { Anthropic } from '@anthropic-ai/sdk';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | Array<{
    type: string;
    text?: string;
    source?: {
      type: string;
      media_type: string;
      data: string;
    };
  }>;
}

export class AnthropicAgent {
  private anthropic: Anthropic;
  private model: string;
  private conversationHistory: AnthropicMessage[];

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
    this.model = 'claude-3-opus-20240229';
    this.conversationHistory = [];
  }

  async sendMessage(message: string, files: any[] = []): Promise<string> {
    try {
      // Prepare the message content
      let content: any[] = [];
      
      // Add text message if present
      if (message.trim()) {
        content.push({
          type: 'text',
          text: message
        });
      }
      
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content
      });
      
      // Use Anthropic SDK for the API request
      const response = await this.anthropic.messages.create({
        model: this.model,
        messages: this.conversationHistory,
        max_tokens: 4096,
        temperature: 0.7
      });

      // Extract the assistant's response - handle multiple content blocks
      let assistantMessage = '';
      for (const contentBlock of response.content) {
        if (contentBlock.type === 'text') {
          assistantMessage += contentBlock.text;
        }
      }
      
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