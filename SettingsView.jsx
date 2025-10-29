import React, { useRef, useState, useEffect } from 'react';
import { getAllData, importData } from './storageService.js';
import { resetChat } from './geminiService.js';

const API_KEY_STORAGE_KEY = 'focusflow_api_key';

const SettingsView = () => {
    const fileInputRef = useRef(null);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [savedApiKey, setSavedApiKey] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const key = localStorage.getItem(API_KEY_STORAGE_KEY);
        setSavedApiKey(key);
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };
    
    const handleSaveApiKey = () => {
        if (apiKeyInput.trim()) {
            localStorage.setItem(API_KEY_STORAGE_KEY, apiKeyInput.trim());
            setSavedApiKey(apiKeyInput.trim());
            showNotification('success', 'Chiave API salvata con successo!');
            setApiKeyInput('');
            resetChat(); 
        } else {
            showNotification('error', 'Il campo della chiave API non può essere vuoto.');
        }
    };
    
    const handleResetChat = () => {
        localStorage.removeItem('focusflow_chat_history');
        resetChat();
        showNotification('success', 'La cronologia della chat è stata cancellata.');
    };

    const handleExport = () => {
        try {
            const data = getAllData();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `focusflow_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('success', 'Dati esportati con successo!');
        } catch (error) {
            console.error("Errore nell'esportazione dei dati", error);
            showNotification('error', "Impossibile esportare i dati.");
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                const result = importData(text);
                if (result.success) {
                    showNotification('success', result.message);
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showNotification('error', result.message);
                }
            }
        };
        reader.onerror = () => {
            showNotification('error', 'Impossibile leggere il file.');
        };
        reader.readAsText(file);
        
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-center text-cyan-300">Impostazioni</h1>

            {notification && (
                 <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-[100] animate-fade-in-down`}>
                    {notification.message}
                </div>
            )}

            <div className="space-y-8">
                 <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-cyan-200 mb-3">Gestione Chiave API Gemini</h2>
                     <p className="text-slate-400 mb-4">Per utilizzare le funzionalità AI, incolla qui la tua chiave API di Google Gemini. La chiave verrà salvata solo nel tuo browser.</p>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="Incolla la tua chiave API qui"
                            className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                        />
                        <button onClick={handleSaveApiKey} className="bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20">
                            Salva
                        </button>
                    </div>
                     {savedApiKey && (
                         <p className="text-sm text-green-400 mt-3">Chiave API salvata correttamente.</p>
                     )}
                     <p className="text-xs text-slate-500 mt-3">
                         Ottieni la tua chiave API da <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a>.
                     </p>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-cyan-200 mb-4">Gestione Dati</h2>
                    <p className="text-slate-400 mb-6">Esegui il backup dei tuoi dati o importali da un file. Puoi anche cancellare la cronologia della chat.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={handleExport}
                            className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-500 transition-colors"
                        >
                            Esporta Dati
                        </button>
                        <button
                            onClick={handleImportClick}
                            className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-500 transition-colors"
                        >
                            Importa Dati
                        </button>
                         <button
                            onClick={handleResetChat}
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-500 transition-colors"
                        >
                            Resetta Chat
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
