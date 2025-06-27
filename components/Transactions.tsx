
import React, { useState } from 'react';
import Card from './ui/Card';
import { Transaction, TransactionType, NewTransactionData } from '../types';
import { ICONS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';
import { UseDataReturn } from '../hooks/useData';
import Modal from './ui/Modal';

interface AddTransactionFormProps {
    type: TransactionType;
    onAddTransaction: (transaction: NewTransactionData) => Promise<void>;
    onCancel: () => void;
    accounts: UseDataReturn['accounts'];
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ type, onAddTransaction, onCancel, accounts }) => {
    const { t } = useSettings();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const newTransaction: NewTransactionData = {
            type,
            amount: parseFloat(amount),
            category,
            accountId,
            date: new Date(date).toISOString(),
            notes: notes || undefined,
        };
        await onAddTransaction(newTransaction);
        setIsSubmitting(false);
    };

    const title = type === TransactionType.INCOME ? t('transactions.addIncome') : t('transactions.addExpense');

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <div>
                <label className="block text-sm font-medium">{t('transactions.form.amount')}</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
            <div>
                <label className="block text-sm font-medium">{t('transactions.form.category')}</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
             <div>
                <label className="block text-sm font-medium">{t('transactions.form.account')}</label>
                <select value={accountId} onChange={e => setAccountId(e.target.value)} required className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent">
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium">{t('transactions.form.date')}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
             <div>
                <label className="block text-sm font-medium">{t('transactions.form.notes')} ({t('goals.form.optional')})</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full p-2 rounded-lg bg-aura-gray-200 dark:bg-aura-gray-800 border border-aura-gray-300 dark:border-aura-gray-700 focus:outline-none focus:ring-2 focus:ring-aura-accent" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onCancel} disabled={isSubmitting} className="py-2 px-4 rounded-lg bg-aura-gray-300 dark:bg-aura-gray-700 font-semibold disabled:opacity-50">{t('common.cancel')}</button>
                <button type="submit" disabled={isSubmitting} className="py-2 px-4 rounded-lg bg-aura-accent text-aura-gray-950 font-bold disabled:opacity-50 disabled:cursor-wait">
                    {isSubmitting ? t('common.saving') : title}
                </button>
            </div>
        </form>
    )
}

interface TransactionsProps {
    data: UseDataReturn;
}

const Transactions: React.FC<TransactionsProps> = ({ data }) => {
    const { t, formatCurrency } = useSettings();
    const { transactions, accounts, addTransaction } = data;
    const [modalType, setModalType] = useState<TransactionType | null>(null);

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleAddTransaction = async (newTransaction: NewTransactionData) => {
        await addTransaction(newTransaction);
        setModalType(null);
    }
    
    const getAccountName = (accountId: string) => {
        return accounts.find(a => a.id === accountId)?.name || 'Unknown';
    }

    return (
        <div className="animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">{t('transactions.title')}</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setModalType(TransactionType.INCOME)} className="flex items-center justify-center bg-aura-accent text-aura-gray-950 font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all">
                        {ICONS.plus}
                        <span className='ml-2'>{t('transactions.addIncome')}</span>
                    </button>
                     <button onClick={() => setModalType(TransactionType.EXPENSE)} className="flex items-center justify-center bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all">
                        {ICONS.plus}
                        <span className='ml-2'>{t('transactions.addExpense')}</span>
                    </button>
                </div>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-aura-gray-300 dark:border-aura-gray-700">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-aura-gray-500 dark:text-aura-gray-300">{t('transactions.date')}</th>
                                <th className="p-3 text-sm font-semibold text-aura-gray-500 dark:text-aura-gray-300">{t('transactions.category')}</th>
                                <th className="p-3 text-sm font-semibold text-aura-gray-500 dark:text-aura-gray-300 hidden md:table-cell">{t('transactions.account')}</th>
                                <th className="p-3 text-sm font-semibold text-aura-gray-500 dark:text-aura-gray-300 text-right">{t('transactions.amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.map((t) => (
                                <tr key={t.id} className="border-b border-aura-gray-200 dark:border-aura-gray-800 last:border-none hover:bg-aura-gray-100/50 dark:hover:bg-aura-gray-800/50">
                                    <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="p-3 font-medium">{t.category}</td>
                                    <td className="p-3 text-aura-gray-700 dark:text-aura-gray-300 hidden md:table-cell">{getAccountName(t.accountId)}</td>
                                    <td className={`p-3 font-semibold text-right ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={modalType !== null} onClose={() => setModalType(null)}>
                {modalType && (
                    <AddTransactionForm
                        type={modalType}
                        onAddTransaction={handleAddTransaction}
                        onCancel={() => setModalType(null)}
                        accounts={accounts}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Transactions;
