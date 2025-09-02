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
    <div className="fixed bottom-20 left-0 right-0 z-30 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-t-xl p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap size={16} className="text-purple-400" />
              <span className="text-white text-sm font-medium">Quick Messages</span>
            </div>
            {quickMessages.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {visibleMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(message)}
                className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white px-3 py-1.5 rounded-full text-xs transition-all duration-200 border border-purple-500/30 hover:border-purple-500/60"
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}