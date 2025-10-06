import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 p-1 sm:p-2 md:p-4 pt-12 sm:pt-14 md:pt-16 lg:pt-20 pb-24 sm:pb-28 md:pb-32"
      style={{ 
        height: 'calc(100vh - 120px)', 
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full animate-fade-in">
            <div className="text-center text-slate-400 max-w-xs sm:max-w-sm md:max-w-md mx-auto px-2 sm:px-4">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover-lift animate-bounce-in">
                <div className="bg-purple-500/20 p-2 sm:p-3 rounded-full w-fit mx-auto mb-3 sm:mb-4 animate-pulse-slow">
                  <Bot size={24} className="sm:w-8 sm:h-8 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-white">Welcome to SenTorial-CHAT!</h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mb-3 sm:mb-4">Start a conversation by typing a message below. I'm powered by Gemini AI!</p>
                <div className="text-xs sm:text-xs text-slate-400 space-y-1">
                  <p>✨ I can chat about anything naturally</p>
                  <p>✨ I can solve math problems</p>
                  <p className="hidden sm:block">🔗 I can handle clickable links</p>
                  <p>🧠 I learn from your teachings</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}