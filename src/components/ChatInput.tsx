import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800 border-t border-slate-700 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message…"
            disabled={disabled}
            className="flex-1 border border-slate-600 rounded-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}