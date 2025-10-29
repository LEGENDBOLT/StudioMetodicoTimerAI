const SESSIONS_KEY = 'focusflow_sessions';
const CHAT_HISTORY_KEY = 'focusflow_chat_history';

// Study Sessions
export const getSessions = () => {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error("Failed to parse sessions from localStorage", error);
    return [];
  }
};

export const saveSession = (session) => {
  const sessions = getSessions();
  const newSession = {
    ...session,
    id: new Date().toISOString(),
    date: new Date().toISOString(),
  };
  sessions.push(newSession);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

// Chat History
export const getChatHistory = () => {
    try {
        const historyJson = localStorage.getItem(CHAT_HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
        return [];
    }
};

export const saveChatHistory = (history) => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
};

// General Data Management
export const getAllData = () => {
    return {
        sessions: getSessions(),
        chatHistory: getChatHistory(),
    };
};

export const importData = (jsonData) => {
    try {
        const data = JSON.parse(jsonData);
        if (data.sessions && Array.isArray(data.sessions)) {
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(data.sessions));
        }
        if (data.chatHistory && Array.isArray(data.chatHistory)) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(data.chatHistory));
        }
        return { success: true, message: "Dati importati con successo!" };
    } catch (error) {
        console.error("Errore nell'importazione dei dati", error);
        return { success: false, message: "File di dati non valido." };
    }
};
