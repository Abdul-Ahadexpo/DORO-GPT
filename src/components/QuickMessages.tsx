import React, { useState, useEffect } from 'react';
import { Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { chatService } from '../services/chatService';

interface QuickMessagesProps {
  onSendMessage: (message: string) => void;
}

export function QuickMessages({ onSendMessage }: QuickMessagesProps) {
  const [quickMessages, setQuickMessages] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = chatService.onQuickMessagesChange(setQuickMessages);
    return unsubscribe;
  }, []);

  if (quickMessages.length === 0) return null;

  const visibleMessages = isExpanded ? quickMessages : quickMessages.slice(0, 3);

  return (
    <div className="fixed bottom-14 sm:bottom-16 md:bottom-20 left-0 right-0 z-40 px-2 sm:px-3 md:px-4 animate-slide-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-t-xl p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Zap size={12} className="sm:w-4 sm:h-4 text-purple-400 animate-pulse-slow" />
              <span className="text-white text-xs sm:text-sm font-medium">Quick Messages</span>
            </div>
            {quickMessages.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white transition-all duration-200 hover-lift"
              >
                {isExpanded ? <ChevronDown size={12} className="sm:w-4 sm:h-4" /> : <ChevronUp size={12} className="sm:w-4 sm:h-4" />}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {visibleMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(message)}
                className="bg-purple-600/20 hover:bg-purple-600/50 text-purple-300 hover:text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs transition-all duration-200 border border-purple-500/30 hover:border-purple-500/80 hover-lift animate-scale-in min-h-[32px] flex items-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="truncate max-w-[120px] sm:max-w-none">{message}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}