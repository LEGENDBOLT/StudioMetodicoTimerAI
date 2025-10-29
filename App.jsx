import React, { useState } from 'react';
import TimerView from './TimerView.jsx';
import AnalysisView from './AnalysisView.jsx';
import ChatBotView from './ChatBotView.jsx';
import SettingsView from './SettingsView.jsx';
import BottomNav from './BottomNav.jsx';

const App = () => {
  const [currentView, setCurrentView] = useState('timer');

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <TimerView />;
      case 'analysis':
        return <AnalysisView />;
      case 'chat':
        return <ChatBotView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TimerView />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-900 text-slate-100">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {renderView()}
        </div>
      </main>
      <footer className="fixed bottom-24 left-0 right-0 text-center text-xs text-slate-500 pb-2 z-40 pointer-events-none">
        Creato da Gabriele Ottonelli
      </footer>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
