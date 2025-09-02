import React from 'react';
import { Bot, Settings } from 'lucide-react';

interface ChatHeaderProps {
  onAdminClick: () => void;
}

export function ChatHeader({ onAdminClick }: ChatHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-slate-800 text-white p-4 shadow-lg border-b border-slate-700">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-500/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">SenTorial-CHAT</h1>
            <p className="text-slate-300 text-sm">
  Made By{" "}
  <a 
    href="https://www.facebook.com/Nazim.AbdulAhad" 
    className="text-purple-400 hover:text-purple-300 underline"
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
          className="bg-purple-500/20 hover:bg-purple-500/30 p-2 rounded-full transition-colors duration-200"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}