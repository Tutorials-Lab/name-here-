
import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat' as ActiveTab, label: 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'images' as ActiveTab, label: 'Images', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'speech' as ActiveTab, label: 'Speech', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
  ];

  return (
    <aside className="w-20 md:w-64 glass border-r border-slate-800 flex flex-col transition-all duration-300">
      <div className="p-6 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-xl">L</span>
          </div>
          <span className="hidden md:block font-bold text-xl tracking-tight">Lumina</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <svg
              className={`w-6 h-6 flex-shrink-0 transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            <span className="hidden md:block font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 mt-auto">
        <div className="hidden md:block bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Connected To</p>
          <p className="text-sm font-semibold text-slate-200">Gemini 3 Pro & Flash</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
