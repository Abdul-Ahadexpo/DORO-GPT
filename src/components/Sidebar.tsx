import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Settings, Bot, X, Menu } from 'lucide-react';
import { Chat } from '../types';
import { ChatStorageService } from '../services/chatStorageService';

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onAdminClick: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ 
  chats, 
  activeChat, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat, 
  onAdminClick,
  isOpen,
  onToggle 
}: SidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('Delete this chat?')) {
      onDeleteChat(chatId);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:relative md:z-auto`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transition-all duration-300 hover:from-purple-600/30 hover:to-blue-600/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-12">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white transition-all duration-300 hover:text-purple-300">SenTorial</h1>
                <p className="text-sm text-slate-400 transition-all duration-300 hover:text-blue-300">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            disabled={chats.length >= 4}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-lg"
          >
            <Plus size={18} />
            <span>New Chat</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {chats.length}/4
            </span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Recent Chats
          </h3>
          
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No chats yet</p>
              <p className="text-slate-600 text-xs">Start a new conversation</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-800/60 ${
                  activeChat?.id === chat.id 
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30' 
                    : 'hover:bg-slate-700/50'
                }`}
                onClick={() => onChatSelect(chat.id)}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-600">
                        <MessageSquare size={14} className={`${
                          activeChat?.id === chat.id ? 'text-purple-400' : 'text-slate-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate transition-all duration-300 ${
                          activeChat?.id === chat.id ? 'text-white' : 'text-slate-300'
                        }`}>
                          {chat.title}
                        </h4>
                        <p className="text-xs text-slate-400 transition-all duration-300 group-hover:text-blue-300">
                          {chat.messages.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {(hoveredChat === chat.id || activeChat?.id === chat.id) && chats.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 rounded transition-all duration-300 hover:scale-125 transform"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/50 transition-all duration-300 hover:bg-slate-800/70">
          <button
            onClick={onAdminClick}
            className="w-full bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
          >
            <Settings size={16} />
            <span className="text-sm font-medium">Admin Panel</span>
          </button>
          
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse transition-all duration-300 hover:scale-150"></div>
              <span className="text-xs text-slate-400 transition-all duration-300 hover:text-green-400">Online</span>
            </div>
            <a 
              href="https://www.facebook.com/Nazim.AbdulAhad" 
              className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Abdul Ahad
            </a>
          </div>
        </div>
      </div>
    </>
  );
}