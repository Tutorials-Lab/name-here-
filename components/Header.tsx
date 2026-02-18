
import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'chat': return 'Creative Chat';
      case 'images': return 'Visual Studio';
      case 'speech': return 'Vocal Synthesis';
      default: return 'Lumina Studio';
    }
  };

  const getSubTitle = () => {
    switch (activeTab) {
      case 'chat': return 'Brainstorm ideas and write content';
      case 'images': return 'Generate high-fidelity AI imagery';
      case 'speech': return 'Transform text into natural voices';
      default: return '';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 glass sticky top-0 z-20 border-b border-slate-800">
      <div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 uppercase tracking-wider">
          {getTitle()}
        </h1>
        <p className="text-xs text-slate-400 font-medium">{getSubTitle()}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-300">Gemini Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
