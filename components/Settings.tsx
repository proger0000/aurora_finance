
import React from 'react';
import Card from './ui/Card';
import { useSettings } from '../contexts/SettingsContext';
import { Theme, Language, Currency } from '../types';

const Settings: React.FC = () => {
    const { 
        theme, setTheme, 
        language, setLanguage, 
        currency, setCurrency, 
        t 
    } = useSettings();

    const Section: React.FC<{title: string, description: string, children: React.ReactNode}> = ({title, description, children}) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
            <div className="md:col-span-1">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-aura-gray-600 dark:text-aura-gray-400">{description}</p>
            </div>
            <div className="md:col-span-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>
            <Card>
                <div className="space-y-8">
                    {/* Appearance Settings */}
                    <Section title={t('settings.appearance.title')} description={t('settings.appearance.description')}>
                        <div className="flex gap-2 p-1 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800">
                           <button onClick={() => setTheme(Theme.LIGHT)} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${theme === Theme.LIGHT ? 'bg-white shadow text-aura-gray-900' : 'text-aura-gray-600 dark:text-aura-gray-300'}`}>
                               {t('settings.appearance.light')}
                           </button>
                           <button onClick={() => setTheme(Theme.DARK)} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${theme === Theme.DARK ? 'bg-aura-gray-950 shadow text-white' : 'text-aura-gray-600 dark:text-aura-gray-300'}`}>
                               {t('settings.appearance.dark')}
                           </button>
                        </div>
                    </Section>
                    
                    <hr className="border-aura-gray-200 dark:border-aura-gray-800" />

                    {/* Language Settings */}
                    <Section title={t('settings.language.title')} description={t('settings.language.description')}>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent"
                        >
                            <option value="en">{t('settings.language.english')}</option>
                            <option value="uk">{t('settings.language.ukrainian')}</option>
                        </select>
                    </Section>
                    
                    <hr className="border-aura-gray-200 dark:border-aura-gray-800" />
                    
                    {/* Currency Settings */}
                    <Section title={t('settings.currency.title')} description={t('settings.currency.description')}>
                         <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as Currency)}
                            className="w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent"
                        >
                            <option value="USD">USD - United States Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="UAH">UAH - Ukrainian Hryvnia</option>
                        </select>
                    </Section>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
