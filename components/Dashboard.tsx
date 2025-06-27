
import React from 'react';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import { TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';
import { UseDataReturn } from '../hooks/useData';

const COLORS = ['#00F5D4', '#00B4D8', '#4895EF', '#F72585', '#B5179E'];

interface DashboardProps {
    data: UseDataReturn;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const { t, formatCurrency, theme } = useSettings();
    const { accounts, transactions, goals } = data;

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyIncome = transactions
        .filter(t => t.type === TransactionType.INCOME && new Date(t.date) >= firstDayOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
        .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date) >= firstDayOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseData = transactions
        .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date) >= firstDayOfMonth)
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category, value: t.amount });
            }
            return acc;
        }, [] as { name: string; value: number }[]);

    const tooltipBackgroundColor = theme === 'dark' ? 'rgba(38, 44, 58, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorderColor = theme === 'dark' ? '#4D5566' : '#D9DDE3';
    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    <Card className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <h3 className="text-sm font-medium text-aura-gray-500 dark:text-aura-gray-300">{t('dashboard.totalBalance')}</h3>
                            <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-medium text-aura-gray-500 dark:text-aura-gray-300">{t('dashboard.incomeMonth')}</h3>
                            <p className="text-3xl font-bold text-green-500">{formatCurrency(monthlyIncome)}</p>
                        </div>
                         <div>
                            <h3 className="text-sm font-medium text-aura-gray-500 dark:text-aura-gray-300">{t('dashboard.expensesMonth')}</h3>
                            <p className="text-3xl font-bold text-red-500">{formatCurrency(monthlyExpenses)}</p>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-lg font-bold mb-4">{t('dashboard.monthlySpending')}</h2>
                         <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={60} fill="#8884d8" paddingAngle={5}>
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{
                                            backgroundColor: tooltipBackgroundColor,
                                            borderColor: tooltipBorderColor,
                                            borderRadius: '0.75rem'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                     <Card>
                        <h2 className="text-lg font-bold mb-4">{t('dashboard.savingsGoals')}</h2>
                        <div className="space-y-4">
                            {goals.length > 0 ? goals.map(goal => (
                                <div key={goal.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium">{goal.name}</span>
                                        <span className="text-sm text-aura-gray-600 dark:text-aura-gray-300">
                                            {formatCurrency(goal.currentAmount)} / <span className="text-aura-gray-500 dark:text-aura-gray-400">{formatCurrency(goal.targetAmount)}</span>
                                        </span>
                                    </div>
                                    <ProgressBar progress={(goal.currentAmount / goal.targetAmount) * 100} />
                                </div>
                            )) : <p className="text-sm text-aura-gray-500">{t('dashboard.noGoals')}</p>}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold mb-4">{t('dashboard.accounts')}</h2>
                        <div className="space-y-4">
                            {accounts.map(account => (
                                <div key={account.id} className="flex justify-between items-center">
                                    <span className="font-medium text-aura-gray-800 dark:text-aura-gray-200">{account.name}</span>
                                    <span className="font-semibold">{formatCurrency(account.balance)}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card>
                         <h2 className="text-lg font-bold mb-4">{t('dashboard.recentTransactions')}</h2>
                         <div className="space-y-3">
                            {recentTransactions.length > 0 ? recentTransactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{t.category}</p>
                                        <p className="text-xs text-aura-gray-500 dark:text-aura-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                                    </p>
                                </div>
                            )) : <p className="text-sm text-aura-gray-500">{t('dashboard.noTransactions')}</p>}
                         </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
