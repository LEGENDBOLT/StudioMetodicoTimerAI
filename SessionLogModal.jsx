import React, { useState } from 'react';

const SessionLogModal = ({ isOpen, onClose, onSubmit }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(notes || "Completata una sessione di studio.");
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-black/30 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-cyan-300 mb-4">Sessione Completata!</h2>
        <p className="text-slate-300 mb-6">Ottimo lavoro! Prenditi un momento per riflettere. Com'è andata la sessione di studio?</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Es: 'Mi sentivo concentrato e ho capito bene l'argomento.' o 'Ho faticato a causa delle distrazioni.'"
            className="w-full h-28 p-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 mb-6 transition-shadow"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors text-white font-semibold"
            >
              Salta
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-colors text-white font-bold shadow-lg shadow-cyan-500/20"
            >
              Salva Nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionLogModal;
