import { GoogleGenAI, Type } from "@google/genai";

const API_KEY_STORAGE_KEY = 'focusflow_api_key';

const getApiKey = () => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
        return storedKey;
    }
    throw new Error("Chiave API non trovata. Impostala nelle Impostazioni.");
};

let ai = null;
let currentApiKey = null;
let chat = null;

const getAI = () => {
    const apiKey = getApiKey();
    if (!ai || currentApiKey !== apiKey) {
        ai = new GoogleGenAI({ apiKey });
        currentApiKey = apiKey;
        chat = null; 
    }
    return ai;
}

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Un riassunto conciso e incoraggiante della giornata di studio dell'utente basato sulle sue note di sessione."
    },
    tip: {
      type: Type.STRING,
      description: "Un consiglio pratico e positivo per migliorare la prossima giornata di studio."
    },
    indicators: {
      type: Type.OBJECT,
      properties: {
        stress: {
          type: Type.NUMBER,
          description: "Una valutazione da 0 (nessuno stress) a 100 (stress molto alto) basata sulle note della sessione."
        },
        happiness: {
          type: Type.NUMBER,
          description: "Una valutazione da 0 (molto infelice) a 100 (molto felice) basata sulle note della sessione."
        },
        concentration: {
          type: Type.NUMBER,
          description: "Una valutazione da 0 (molto distratto) a 100 (pienamente concentrato) basata sulle note della sessione."
        },
        fatigue: {
          type: Type.NUMBER,
          description: "Una valutazione da 0 (molto energico) a 100 (molto affaticato) basata sulle note della sessione."
        }
      },
      required: ["stress", "happiness", "concentration", "fatigue"]
    },
  },
  required: ["summary", "tip", "indicators"]
};

export const analyzeStudySessions = async (sessions) => {
  const ai = getAI();
  const model = "gemini-2.5-pro";

  const prompt = `Analizza i seguenti log di sessioni di studio. L'utente ha scritto delle note dopo ogni sessione su come è andata. 
  Fornisci un riassunto conciso, un consiglio pratico e valuta stress, felicità, concentrazione e stanchezza da 0 a 100.
  
  Log: ${JSON.stringify(sessions.map(s => ({ durata: s.duration, note: s.notes })))}`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisResponseSchema
      }
    });
    const parsedResult = JSON.parse(response.text);
    return parsedResult;

  } catch (error) {
    console.error("Errore durante l'analisi delle sessioni di studio:", error);
    throw new Error("Impossibile analizzare le sessioni. Controlla la tua chiave API e riprova.");
  }
};

export const getChatbotResponse = async (history, newMessage) => {
    const ai = getAI();
    if (!chat) {
        let historyForApi = history;
        if (historyForApi.length > 0 && historyForApi[0].role === 'model') {
            historyForApi = historyForApi.slice(1);
        }

        chat = ai.chats.create({
            model: 'gemini-flash-lite-latest',
            history: historyForApi.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            })),
            config: {
                systemInstruction: "Sei un Mental Coach AI amichevole e pratico per studenti. Il tuo obiettivo è fornire consigli concisi, di supporto e attuabili. Mantieni le tue risposte brevi, facili da leggere e dirette. Usa un tono caldo e incoraggiante. Non dare consigli medici. Usa markdown per la formattazione se aiuta la leggibilità.",
            },
        });
    }

    try {
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        chat = null; // Reset chat on error
        console.error("Errore nella risposta del chatbot:", error);
        throw new Error("Impossibile ottenere una risposta. Controlla la tua chiave API e riprova.");
    }
};

export const resetChat = () => {
    chat = null;
};
