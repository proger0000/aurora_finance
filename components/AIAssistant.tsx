
import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import { ICONS } from '../constants';
import { ChatMessage } from '../types';
import { getAuraInsightStream } from '../services/geminiService';
import { useSettings } from '../contexts/SettingsContext';
import { UseDataReturn } from '../hooks/useData';

interface AIAssistantProps {
    data: UseDataReturn;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
    const { t, language } = useSettings();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial', sender: 'ai', text: t('ai.initialGreeting') }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Update initial message if language changes
        setMessages(msgs => msgs.map(m => m.id === 'initial' ? {...m, text: t('ai.initialGreeting')} : m));
    }, [t]);

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        const aiResponseId = (Date.now() + 1).toString();
        const aiMessage: ChatMessage = { id: aiResponseId, sender: 'ai', text: '', isLoading: true };

        setMessages(prev => [...prev, userMessage, aiMessage]);
        setInput('');
        setIsLoading(true);

        await getAuraInsightStream(
            input,
            data,
            language,
            (chunk) => {
                setMessages(prev => prev.map(msg => 
                    msg.id === aiResponseId ? { ...msg, text: msg.text + chunk, isLoading: true } : msg
                ));
            },
            (error) => {
                 setMessages(prev => prev.map(msg => 
                    msg.id === aiResponseId ? { ...msg, text: error, isLoading: false } : msg
                ));
            },
            () => {
                setIsLoading(false);
                 setMessages(prev => prev.map(msg => 
                    msg.id === aiResponseId ? { ...msg, isLoading: false } : msg
                ));
            }
        );
    };

    return (
        <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">{t('ai.title')}</h1>
            <Card className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 flex-shrink-0 rounded-full bg-aura-accent/20 text-aura-accent p-1.5">{ICONS.ai}</div>}
                            <div className={`max-w-md p-3 rounded-xl ${msg.sender === 'ai' ? 'bg-aura-gray-200 dark:bg-aura-gray-800 text-aura-gray-800 dark:text-aura-gray-200' : 'bg-aura-accent text-aura-gray-950 font-medium'}`}>
                                {msg.text}
                                {msg.isLoading && <span className="inline-block w-2 h-2 ml-2 bg-current rounded-full animate-pulse"></span>}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 pt-4 border-t border-aura-gray-300 dark:border-aura-gray-700">
                    <div className="flex items-center bg-aura-gray-200 dark:bg-aura-gray-800 rounded-lg p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('ai.inputPlaceholder')}
                            className="flex-1 bg-transparent focus:outline-none px-2 text-aura-gray-900 dark:text-white"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 rounded-md bg-aura-accent text-aura-gray-950 disabled:bg-aura-gray-600 disabled:cursor-not-allowed transition-colors">
                            {ICONS.send}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AIAssistant;
