import React, { useState, useEffect, useRef } from 'react';
import { saveSession } from '../services/storageService.js';
import SessionLogModal from './SessionLogModal.js';
import { PlayIcon, PauseIcon, PlusIcon } from './Icons.js';

const workerCode = `
  let timerId;
  let remainingTime;

  self.onmessage = (e) => {
    const { command, seconds } = e.data;

    switch (command) {
      case 'start':
        if (timerId) return;
        timerId = self.setInterval(() => {
          if (remainingTime > 0) {
              remainingTime--;
              self.postMessage({ type: 'tick', time: remainingTime });
          }
          if (remainingTime <= 0) {
            clearInterval(timerId);
            timerId = undefined;
            self.postMessage({ type: 'finished' });
          }
        }, 1000);
        break;
      case 'pause':
        if (timerId) {
          clearInterval(timerId);
          timerId = undefined;
        }
        break;
      case 'setTime':
        if (timerId) {
          clearInterval(timerId);
          timerId = undefined;
        }
        remainingTime = seconds || 0;
        self.postMessage({ type: 'tick', time: remainingTime });
        break;
    }
  };
`;

const TimerView = () => {
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workerError, setWorkerError] = useState(null);
  const workerRef = useRef(null);
  const workerUrlRef = useRef(null);

  useEffect(() => {
    try {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      workerUrlRef.current = URL.createObjectURL(blob);
      workerRef.current = new Worker(workerUrlRef.current);

      setWorkerError(null);

      workerRef.current.onmessage = (e) => {
        if (e.data.type === 'tick') {
          setTimeLeft(e.data.time);
        } else if (e.data.type === 'finished') {
          setIsActive(false);
          setIsModalOpen(true);
        }
      };

      workerRef.current.onerror = (err) => {
        console.error("Worker error:", err);
        setWorkerError("Impossibile avviare il timer. Questa funzione potrebbe non essere supportata in questo ambiente.");
        setIsActive(false);
      };

      workerRef.current.postMessage({ command: 'setTime', seconds: duration });
    } catch (error) {
      console.error("Failed to initialize worker:", error);
      setWorkerError("Impossibile avviare il timer in background. Questo ambiente non supporta questa funzionalità.");
    }
    
    return () => {
      workerRef.current?.terminate();
      if (workerUrlRef.current) {
        URL.revokeObjectURL(workerUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
        setTimeLeft(duration);
        workerRef.current?.postMessage({ command: 'setTime', seconds: duration });
    }
  }, [duration, isActive]);

  const handleStartPause = () => {
    if (timeLeft <= 0 || workerError) return;
    if (isActive) {
      workerRef.current?.postMessage({ command: 'pause' });
    } else {
      workerRef.current?.postMessage({ command: 'start' });
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    if (workerError) return;
    setIsActive(false);
    setTimeLeft(duration);
    workerRef.current?.postMessage({ command: 'setTime', seconds: duration });
  };
  
  const handleDurationChange = (newDurationInMinutes) => {
    if (isActive || workerError) return;
    const newDurationInSeconds = newDurationInMinutes * 60;
    setDuration(newDurationInSeconds);
  }

  const handleModalSubmit = (notes) => {
    saveSession({ duration: duration, notes });
    setIsModalOpen(false);
    handleReset();
  };

  const handleModalClose = () => {
    saveSession({ duration: duration, notes: 'Completata una sessione di studio.' });
    setIsModalOpen(false);
    handleReset();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const durationOptions = [15, 25, 50];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in pt-4">
      <h1 className="text-3xl font-bold text-center text-cyan-300">Focus Timer</h1>
      
      {workerError && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg text-center max-w-md" role="alert">
          <strong className="font-bold">Attenzione: </strong>
          <span className="block sm:inline">{workerError}</span>
        </div>
      )}

      <div className="flex space-x-2 bg-slate-800 p-2 rounded-full shadow-lg">
        {durationOptions.map(d => (
             <button
                key={d}
                onClick={() => handleDurationChange(d)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    duration === d * 60
                    ? 'bg-cyan-500 text-white'
                    : 'bg-transparent text-slate-400 hover:bg-slate-700/50'
                }`}
                disabled={isActive || !!workerError}
            >
                {d} min
             </button>
        ))}
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-slate-700"
            strokeWidth="7"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
          />
          <circle
            className="text-cyan-400"
            strokeWidth="7"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute text-5xl md:text-6xl font-bold font-mono tracking-tighter">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors disabled:opacity-50"
          aria-label="Reset Timer"
          disabled={isActive && timeLeft > 0 || !!workerError}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5m11 7v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9a9 9 0 0114.13-5.22M20 15a9 9 0 01-14.13 5.22" /></svg>
        </button>

        <button
          onClick={handleStartPause}
          className="w-20 h-20 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          aria-label={isActive ? 'Pausa' : 'Avvia'}
          disabled={!!workerError}
        >
          <div className="w-10 h-10">
            {isActive ? <PauseIcon /> : <PlayIcon />}
          </div>
        </button>
        
        <button 
          className="p-4 rounded-full bg-slate-700 text-slate-300 transition-colors opacity-50 cursor-not-allowed"
          aria-label="Aggiungi Tempo"
          disabled
        >
          <div className="w-6 h-6"><PlusIcon/></div>
        </button>
      </div>

      <SessionLogModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default TimerView;
