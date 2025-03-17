export interface AIResponse {
  feedback: string;
  extractedData?: {
    type: 'add' | 'update' | 'remove';
    field: string;
    value: any;
  };
}