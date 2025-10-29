import React from 'react';
import { TimerIcon, ChartBarIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from './Icons.js';

const BottomNav = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: 'timer', label: 'Timer', icon: <TimerIcon /> },
    { view: 'analysis', label: 'Analisi', icon: <ChartBarIcon /> },
    { view: 'chat', label: 'Coach', icon: <ChatBubbleLeftRightIcon /> },
    { view: 'settings', label: 'Impostazioni', icon: <Cog6ToothIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="mx-auto max-w-sm bg-slate-800/80 backdrop-blur-sm rounded-full shadow-2xl shadow-black/30">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-full transition-colors duration-300 ${
                currentView === item.view
                  ? 'text-cyan-400'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              aria-label={item.label}
            >
              <div className="w-7 h-7 mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
