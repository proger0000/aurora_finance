
import React, { useMemo } from 'react';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ICONS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';
import { UseDataReturn } from '../hooks/useData';
import { TransactionType } from '../types';

const exportService = {
  exportToExcel: (data: any[], fileName: string) => {
    // @ts-ignore
    const ws = XLSX.utils.json_to_sheet(data);
    // @ts-ignore
    const wb = XLSX.utils.book_new();
    // @ts-ignore
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    // @ts-ignore
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
};

interface ReportsProps {
    data: UseDataReturn;
}

const Reports: React.FC<ReportsProps> = ({ data }) => {
    const { t, theme, formatCurrency } = useSettings();
    const { transactions } = data;

    const handleExport = () => {
        const formattedForExport = transactions.map(t => ({
            date: new Date(t.date).toLocaleDateString(),
            category: t.category,
            type: t.type,
            amount: t.amount,
            notes: t.notes || '',
        }));
        exportService.exportToExcel(formattedForExport, `aura_finance_report_${new Date().toISOString().split('T')[0]}`);
    };

    const reportData = useMemo(() => {
        const months: { [key: string]: { name: string, income: number, expenses: number } } = {};
        const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

        transactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!months[monthKey]) {
                months[monthKey] = {
                    name: monthFormatter.format(date),
                    income: 0,
                    expenses: 0,
                };
            }
            if (t.type === TransactionType.INCOME) {
                months[monthKey].income += t.amount;
            } else {
                months[monthKey].expenses += t.amount;
            }
        });
        
        return Object.values(months).sort((a,b) => new Date(a.name + ' 1, 2023').getMonth() - new Date(b.name + ' 1, 2023').getMonth()); // Simple sort for demo

    }, [transactions]);

    const tooltipBackgroundColor = theme === 'dark' ? 'rgba(38, 44, 58, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorderColor = theme === 'dark' ? '#4D5566' : '#D9DDE3';
    const axisStrokeColor = theme === 'dark' ? '#B8BEC9' : '#4D5566';
    const gridStrokeColor = theme === 'dark' ? '#4D5566' : '#D9DDE3';


    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('reports.title')}</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center bg-aura-accent text-aura-gray-950 font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all"
                >
                    {ICONS.export}
                    {t('reports.export')}
                </button>
            </div>
            
            <Card>
                <h2 className="text-lg font-bold mb-4">{t('reports.incomeVsExpense')}</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={reportData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                            <XAxis dataKey="name" stroke={axisStrokeColor} />
                            <YAxis stroke={axisStrokeColor} tickFormatter={(tick) => formatCurrency(tick)} />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{
                                    backgroundColor: tooltipBackgroundColor,
                                    borderColor: tooltipBorderColor,
                                    borderRadius: '0.75rem'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="income" fill="#00F5D4" name={t('reports.income')} />
                            <Bar dataKey="expenses" fill="#F72585" name={t('reports.expenses')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="mt-6">
                 <h2 className="text-lg font-bold mb-4">{t('reports.analyticsComingSoon')}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-aura-gray-200/60 dark:bg-aura-gray-800/50 rounded-lg">
                        <h3 className="font-semibold text-aura-gray-800 dark:text-aura-gray-200">{t('reports.periodComparison')}</h3>
                        <p className="text-sm text-aura-gray-600 dark:text-aura-gray-400">{t('reports.periodComparisonDesc')}</p>
                    </div>
                     <div className="p-4 bg-aura-gray-200/60 dark:bg-aura-gray-800/50 rounded-lg">
                        <h3 className="font-semibold text-aura-gray-800 dark:text-aura-gray-200">{t('reports.budgetForecasting')}</h3>
                        <p className="text-sm text-aura-gray-600 dark:text-aura-gray-400">{t('reports.budgetForecastingDesc')}</p>
                    </div>
                 </div>
            </Card>
        </div>
    );
};

export default Reports;
