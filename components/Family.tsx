
import React from 'react';
import Card from './ui/Card';
import { useSettings } from '../contexts/SettingsContext';
import { ICONS } from '../constants';

const Family: React.FC = () => {
    const { t } = useSettings();

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">{t('family.title')}</h1>
            <Card>
                <div className="text-center py-10">
                    <div className="inline-block p-4 bg-aura-accent/10 rounded-full mb-4">
                        <span className="w-12 h-12 text-aura-accent">{ICONS.family}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">{t('family.comingSoon')}</h2>
                    <p className="max-w-md mx-auto text-aura-gray-600 dark:text-aura-gray-400">
                        {t('family.description')}
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Family;
