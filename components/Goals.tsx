
import React, { useState } from 'react';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import { Goal, NewGoalData } from '../types';
import { ICONS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';
import { UseDataReturn } from '../hooks/useData';
import Modal from './ui/Modal';

interface GoalCardProps {
    goal: Goal;
    onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete }) => {
    const { t, formatCurrency } = useSettings();
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;

    const handleDelete = () => {
        if (window.confirm(t('goals.deleteConfirm', { name: goal.name }))) {
            onDelete(goal.id);
        }
    }

    return (
        <Card className="flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
                     <button onClick={handleDelete} className="text-aura-gray-500 hover:text-red-500 transition-colors">
                        {ICONS.trash}
                    </button>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-2xl font-semibold text-aura-accent">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-sm text-aura-gray-600 dark:text-aura-gray-400">{t('goals.of')} {formatCurrency(goal.targetAmount)}</span>
                </div>
                <ProgressBar progress={progress} />
                <div className="flex justify-between items-center mt-3 text-sm text-aura-gray-700 dark:text-aura-gray-300">
                    <span>{progress.toFixed(1)}% {t('goals.complete')}</span>
                    <span>{formatCurrency(remaining)} {t('goals.toGo')}</span>
                </div>
            </div>
            {goal.endDate && <p className="text-xs text-aura-gray-500 dark:text-aura-gray-400 mt-2 self-start">{t('goals.targetDate')}: {new Date(goal.endDate).toLocaleDateString()}</p>}
        </Card>
    );
};

const AddGoalForm: React.FC<{onAddGoal: (goal: NewGoalData) => void, onCancel: () => void}> = ({ onAddGoal, onCancel }) => {
    const { t } = useSettings();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newGoal: NewGoalData = {
            name,
            targetAmount: parseFloat(targetAmount),
            endDate: endDate || undefined,
        };
        onAddGoal(newGoal);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{t('goals.newGoal')}</h2>
            <div>
                <label className="block text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('goals.form.name')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
            <div>
                <label className="block text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('goals.form.targetAmount')}</label>
                <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
             <div>
                <label className="block text-sm font-medium text-aura-gray-700 dark:text-aura-gray-300">{t('goals.form.targetDate')} ({t('goals.form.optional')})</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onCancel} className="py-2 px-4 rounded-lg bg-aura-gray-300 dark:bg-aura-gray-700 font-semibold">{t('common.cancel')}</button>
                <button type="submit" className="py-2 px-4 rounded-lg bg-aura-accent text-aura-gray-950 font-bold">{t('goals.addGoalButton')}</button>
            </div>
        </form>
    );
};


interface GoalsProps {
    data: UseDataReturn;
}

const Goals: React.FC<GoalsProps> = ({ data }) => {
    const { t } = useSettings();
    const { goals, addGoal, deleteGoal } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddGoal = async (newGoal: NewGoalData) => {
        await addGoal(newGoal);
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('goals.title')}</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center bg-aura-accent text-aura-gray-950 font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all"
                >
                    {ICONS.plus}
                    <span className='ml-2'>{t('goals.newGoal')}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
                ))}
            </div>

            {goals.length === 0 && (
                <Card className="text-center py-10">
                    <p className="text-aura-gray-600 dark:text-aura-gray-400">{t('goals.noGoals')}</p>
                </Card>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddGoalForm onAddGoal={handleAddGoal} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Goals;
