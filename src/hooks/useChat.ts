import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { Message } from '../types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize default responses
    chatService.initializeDefaultResponses();

    // Listen for messages
    const unsubscribe = chatService.onMessagesChange(setMessages);
    return unsubscribe;
  }, []);

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    
    try {
      // Send user message
      await chatService.sendMessage(text, 'user');
      
      // Get bot response
      const botResponse = await chatService.getBotResponse(text);
      
      // Send bot message after a short delay for better UX
      setTimeout(async () => {
        await chatService.sendMessage(botResponse, 'bot');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
}