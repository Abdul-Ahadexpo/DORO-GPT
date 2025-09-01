import React from 'react';
import { Bot, Settings } from 'lucide-react';

interface ChatHeaderProps {
  onAdminClick: () => void;
}

export function ChatHeader({ onAdminClick }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Doro GPT</h1>
           <p className="text-purple-100 text-sm">
  Made By{" "}
  <a 
    href="https://www.facebook.com/Nazim.AbdulAhad" 
    className="text-purple-300 hover:text-purple-500 underline"
    target="_blank" 
    rel="noopener noreferrer"
  >
    Abdul Ahad
  </a>
</p>
          </div>
        </div>
        <button
          onClick={onAdminClick}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}