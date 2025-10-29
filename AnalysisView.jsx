import React, { useState, useEffect } from 'react';
import { getSessions } from "../services/storageService.js";
import { analyzeStudySessions } from "../services/geminiService.js";

const IndicatorBar = ({ label, value, colorClass }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <span className={`text-sm font-bold text-white`}>{value}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div 
                className={`h-2.5 rounded-full ${colorClass}`} 
                style={{ width: `${value}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
        </div>
    </div>
);

const AnalysisView = () => {
    const [sessions, setSessions] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setSessions(getSessions());
    }, []);

    const handleAnalyze = async () => {
        if (sessions.length === 0) {
            setError("Non ci sono sessioni di studio da analizzare. Usa il timer per registrarne una!");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeStudySessions(sessions);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || "Si è verificato un errore durante l'analisi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-center text-cyan-300">Analisi Studio</h1>
            
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg text-center">
                <p className="text-slate-300 mb-4">
                    Ottieni un'analisi delle tue sessioni di studio basata sulle tue note. L'AI fornirà un riassunto, un consiglio e valuterà i tuoi livelli di stress, felicità e concentrazione.
                </p>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || sessions.length === 0}
                    className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analisi in corso...' : 'Analizza le mie sessioni'}
                </button>
                {sessions.length === 0 && <p className="text-yellow-400 text-sm mt-4">Nessuna sessione trovata. Usa prima il timer!</p>}
            </div>

            {isLoading && (
                 <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-slate-400">L'AI sta analizzando i tuoi dati...</p>
                 </div>
            )}

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                    <strong className="font-bold">Errore: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {analysis && !isLoading && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-cyan-200 mb-3">📝 Riassunto</h2>
                        <p className="text-slate-300 prose prose-invert max-w-none">{analysis.summary}</p>
                    </div>
                    
                    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-cyan-200 mb-3">💡 Consiglio del Coach</h2>
                        <p className="text-slate-300 prose prose-invert max-w-none">{analysis.tip}</p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold text-cyan-200 mb-4">📊 Indicatori Chiave</h2>
                        <div className="space-y-4">
                            <IndicatorBar label="Concentrazione" value={analysis.indicators.concentration} colorClass="bg-green-500" />
                            <IndicatorBar label="Felicità" value={analysis.indicators.happiness} colorClass="bg-yellow-400" />
                            <IndicatorBar label="Fatica" value={analysis.indicators.fatigue} colorClass="bg-orange-500" />
                            <IndicatorBar label="Stress" value={analysis.indicators.stress} colorClass="bg-red-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisView;
