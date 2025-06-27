// components/Login.tsx

import React, { useState } from 'react';
import { ICONS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../services/supabaseClient';

const Login: React.FC = () => {
    const { t } = useSettings();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setError(error.message);
        setIsLoading(false);
    };

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);
        
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) setError(error.message);
        else setMessage("Check your email for the confirmation link!");
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-aura-gray-100 dark:bg-aura-gray-950 p-4">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-aura-gray-300/[0.5] dark:bg-grid-aura-gray-800/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-aura-accent/20 mb-4">
                        <span className="w-12 h-12 text-aura-accent">{ICONS.logo}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-aura-gray-900 dark:text-white">{t('login.title')}</h1>
                    <p className="text-aura-gray-600 dark:text-aura-gray-300">{t('login.subtitle')}</p>
                </div>
                
                <form onSubmit={handleLogin} className="bg-white/60 dark:bg-aura-gray-900/50 backdrop-blur-lg rounded-xl border border-aura-gray-200/50 dark:border-aura-gray-800/50 shadow-lg dark:shadow-black/20 p-8 space-y-6">
                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-center text-sm">{message}</p>}
                    <div>
                        <label className="text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('login.email')}</label>
                        <input 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2.5 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('login.password')}</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                             value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-2.5 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2">
                         <button type="submit" disabled={isLoading} className="flex-1 w-full py-3 px-4 bg-aura-accent text-aura-gray-950 font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50">
                            {isLoading ? '...' : t('login.loginButton')}
                        </button>
                         <button type="button" onClick={handleSignup} disabled={isLoading} className="flex-1 w-full py-3 px-4 bg-aura-gray-300 dark:bg-aura-gray-700 font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50">
                             {t('login.signupLink')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;