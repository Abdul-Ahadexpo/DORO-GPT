import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${
        isLatest ? 'animate-slide-in' : ''
      }`}
    >
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-slate-800 text-white border border-slate-700'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-purple-200' : 'text-slate-400'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}