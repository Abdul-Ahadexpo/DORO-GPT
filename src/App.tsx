import React, { useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { useChat } from './hooks/useChat';
import { QuickMessages } from './components/QuickMessages';

function App() {
  const { messages, sendMessage, isLoading } = useChat();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAdminLogin = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <ChatHeader onAdminClick={handleAdminClick} />
      
      <ChatWindow messages={messages} />
      
      <QuickMessages onSendMessage={sendMessage} />
      
      <ChatInput onSendMessage={sendMessage} disabled={isLoading} />

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />

      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />

      {isLoading && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">SenTorial is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;