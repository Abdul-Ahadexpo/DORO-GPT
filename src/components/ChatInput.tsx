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

    // Auto-focus on keypress for desktop only (not mobile)
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only on desktop (screen width > 640px) and not touch devices
      if (window.innerWidth <= 640 || 'ontouchstart' in window) return;
      
      // Don't interfere if user is already typing in an input/textarea
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      // Don't interfere with keyboard shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      // Don't interfere with special keys
      if (e.key.length > 1 && !['Backspace', 'Delete'].includes(e.key)) return;

      // Focus the input and let the character be typed
      if (inputRef.current && !disabled) {
        inputRef.current.focus();
        
        // If it's a printable character, add it to the input
        if (e.key.length === 1) {
          setMessage(prev => prev + e.key);
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-md border-t border-slate-700 p-2 sm:p-3 md:p-4 shadow-lg animate-slide-in">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-2 md:space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message…"
            disabled={disabled}
            className="flex-1 border border-slate-600 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white placeholder-slate-400 focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base min-h-[44px]"
            style={{ fontSize: '16px' }}
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 sm:p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover-lift focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}