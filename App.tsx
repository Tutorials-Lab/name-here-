
import React, { useState } from 'react';
import { ActiveTab } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatTool from './components/ChatTool';
import ImageTool from './components/ImageTool';
import SpeechTool from './components/SpeechTool';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTool />;
      case 'images':
        return <ImageTool />;
      case 'speech':
        return <SpeechTool />;
      default:
        return <ChatTool />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header activeTab={activeTab} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
