import React, { useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { TeachBotModal } from './components/TeachBotModal';
import { useChat } from './hooks/useChat';
import { QuickMessages } from './components/QuickMessages';

function App() {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    showTeachModal, 
    lastUnknownQuestion, 
    onCloseTeachModal, 
    onTeachBot 
  } = useChat();
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

      <TeachBotModal
        isOpen={showTeachModal}
        question={lastUnknownQuestion}
        onClose={onCloseTeachModal}
        onTeach={onTeachBot}
      />

      {isLoading && (
        <div className="fixed bottom-16 sm:bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg z-50 animate-bounce-in backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
            <span className="text-xs sm:text-sm">SenTorial is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;