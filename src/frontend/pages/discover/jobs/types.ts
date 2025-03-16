export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: string[];
}

export interface FileItem {
  originFileObj: File;
  name: string;
  type: string;
}