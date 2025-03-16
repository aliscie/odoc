// Remove axios import and add Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';

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

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class JobsAgent {
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
      
      // Add files if present
      for (const file of files) {
        try {
          const fileData = await this.convertFileToBase64(file.originFileObj);
          const mediaType = file.type || 'application/octet-stream';
          
          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: fileData
            }
          });
        } catch (error) {
          console.error('Error processing file:', error);
        }
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
  
  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }
  
  clearConversation(): void {
    this.conversationHistory = [];
  }
}