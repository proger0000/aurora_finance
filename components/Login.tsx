
import React from 'react';
import { ICONS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const { t } = useSettings();

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

                <div className="bg-white/60 dark:bg-aura-gray-900/50 backdrop-blur-lg rounded-xl border border-aura-gray-200/50 dark:border-aura-gray-800/50 shadow-lg dark:shadow-black/20 p-8 space-y-6">
                    <div>
                        <label className="text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('login.email')}</label>
                        <input type="email" placeholder="you@example.com" className="mt-1 block w-full p-2.5 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('login.password')}</label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full p-2.5 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
                    </div>
                     <button className="w-full py-3 px-4 bg-aura-accent text-aura-gray-950 font-bold rounded-lg hover:bg-opacity-90 transition-all">
                        {t('login.loginButton')}
                    </button>
                    <div className="text-center text-sm text-aura-gray-600 dark:text-aura-gray-400">
                        {t('login.signupPrompt')} <a href="#" className="font-semibold text-aura-accent/90 hover:text-aura-accent">{t('login.signupLink')}</a>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button onClick={onLoginSuccess} className="text-sm font-semibold text-aura-gray-600 dark:text-aura-gray-300 hover:text-aura-accent transition-colors">
                        {t('login.guestButton')} &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
