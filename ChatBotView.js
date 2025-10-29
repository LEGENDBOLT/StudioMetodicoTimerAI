import React, { useState, useEffect, useRef } from 'react';
import { getChatHistory, saveChatHistory } from '../services/storageService.js';
import { getChatbotResponse } from '../services/geminiService.js';
import { PaperAirplaneIcon } from './Icons.js';
import { marked } from 'marked';

const ChatBotView = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const history = getChatHistory();
    if (history.length === 0) {
        const initialBotMessage = {
            role: 'model',
            text: "Ciao! Sono il tuo mental coach AI. Come ti senti riguardo ai tuoi studi oggi?",
        };
        setMessages([initialBotMessage]);
    } else {
        setMessages(history);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const startTime = Date.now();
      const responseText = await getChatbotResponse(messages, currentInput);
      const duration = (Date.now() - startTime) / 1000;
      
      const modelMessage = { role: 'model', text: responseText, duration };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      setError(err.message || 'Impossibile ottenere una risposta.');
      setMessages(prev => prev.slice(0, -1)); 
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (text) => {
    const safeText = typeof text === 'string' ? text : '';
    return { __html: marked.parse(safeText, { breaks: true, gfm: true }) };
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-center text-cyan-300 mb-4">Mental Coach AI</h1>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
                <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${
                    msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}
                >
                <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
                </div>
            </div>
            {msg.role === 'model' && msg.duration && (
                <p className="text-xs text-slate-500 mt-1 ml-10">
                    Risposta in {msg.duration.toFixed(2)}s
                </p>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
             <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
	                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
	                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-auto pt-4 flex items-center gap-2 bg-slate-900">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Chiedi un consiglio..."
          className="flex-1 p-3 bg-slate-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || input.trim() === ''}
          className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
        >
          <div className="w-6 h-6"><PaperAirplaneIcon /></div>
        </button>
      </div>
    </div>
  );
};

export default ChatBotView;
