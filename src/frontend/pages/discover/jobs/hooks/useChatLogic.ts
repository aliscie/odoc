import { useState, useRef, useEffect } from 'react';
import { Message, FileItem } from '../types';
import { JobsAgent } from '../jobsAgent';

export const useChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agent = new JobsAgent();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() && fileList.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: fileList.map(file => file.name)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setFileList([]);
    setIsLoading(true);

    try {
      const response = await agent.sendMessage(inputValue, fileList);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      alert('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (files: FileItem[]) => {
    setFileList(files);
  };

  return {
    messages,
    inputValue,
    isLoading,
    fileList,
    messagesEndRef,
    setInputValue,
    handleSend,
    handleKeyPress,
    handleFileUpload
  };
};