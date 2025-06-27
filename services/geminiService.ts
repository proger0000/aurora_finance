
import { GoogleGenAI } from "@google/genai";
import { Language, Transaction, Goal, Car } from "../types";
import { UseDataReturn } from "../hooks/useData";

const formatFinancialDataForPrompt = (data: UseDataReturn): string => {
    const totalBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const summary = {
        totalBalance: totalBalance,
        recentTransactions: data.transactions?.slice(0, 5) || [],
        activeGoals: data.goals || [],
        cars: data.cars?.map((c: Car) => `${c.make} ${c.model}`) || [],
    };

    return `
---FINANCIAL CONTEXT---
This is a snapshot of the user's financial data. Use this to answer their questions.
- Total Balance across all accounts: ${data.formatCurrency(summary.totalBalance)}
- Active Goals: ${summary.activeGoals.map((g: Goal) => `${g.name} (${data.formatCurrency(g.currentAmount)}/${data.formatCurrency(g.targetAmount)})`).join(', ') || 'No active goals.'}
- Cars in Garage: ${summary.cars.join(', ') || 'No cars in garage.'}
- Recent Transactions (up to 5):
${summary.recentTransactions.map((t: Transaction) => `  - [${new Date(t.date).toLocaleDateString()}] ${t.type === 'expense' ? '-' : '+'}${data.formatCurrency(t.amount)} (${t.category})`).join('\n') || 'No recent transactions.'}
-----------------------
    `;
};

const getApiKey = () => {
    try {
        const key = process.env.API_KEY;
        if (!key) {
            console.warn("API_KEY not found. Using a placeholder. AI features will not work without a valid key.");
            return "YOUR_API_KEY_HERE";
        }
        return key;
    } catch (e) {
        console.error("Could not access process.env. Using a placeholder.", e);
        return "YOUR_API_KEY_HERE";
    }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getAuraInsightStream = async (
    query: string,
    financialData: UseDataReturn,
    language: Language,
    onChunk: (text: string) => void,
    onError: (error: string) => void,
    onComplete: () => void,
) => {
    try {
        const financialContext = formatFinancialDataForPrompt(financialData);
        
        const systemInstruction = `You are "Aura", a friendly, supportive, and brilliant financial mentor. Your tone is encouraging and clear. You are integrated into a personal finance app called Aura Finance. Your goal is to help users understand their finances and make smarter decisions. You must only answer questions related to finance, cars, and budget based on the provided context. If the user asks something off-topic, politely decline. You must be concise. The user's current language is '${language}'. YOU MUST RESPOND IN THE USER'S LANGUAGE.`;

        const contents = `${financialContext}\n\nUser's question: "${query}"`;
        
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash-preview-04-17",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        for await (const chunk of responseStream) {
            onChunk(chunk.text);
        }

    } catch (error) {
        console.error("Error getting insight from Gemini:", error);
        onError("Sorry, I'm having trouble connecting to my brain right now. Please try again later.");
    } finally {
        onComplete();
    }
};
