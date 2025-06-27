
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { Account, Transaction, Goal, Car, Refueling, ServiceRecord, NewTransactionData, NewGoalData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export interface UseDataReturn {
    isLoading: boolean;
    accounts: Account[];
    transactions: Transaction[];
    goals: Goal[];
    cars: Car[];
    refuelings: Refueling[];
    serviceRecords: ServiceRecord[];
    addTransaction: (data: NewTransactionData) => Promise<void>;
    addGoal: (data: NewGoalData) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    // Exposing this for convenience in other services like Gemini
    formatCurrency: (amount: number) => string;
}

export const useData = (isLoggedIn: boolean): UseDataReturn => {
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [refuelings, setRefuelings] = useState<Refueling[]>([]);
    const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
    const { formatCurrency } = useSettings();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                accountsData,
                transactionsData,
                goalsData,
                carsData,
                refuelingsData,
                serviceRecordsData
            ] = await Promise.all([
                api.getAccounts(),
                api.getTransactions(),
                api.getGoals(),
                api.getCars(),
                api.getRefuelings(),
                api.getServiceRecords(),
            ]);
            setAccounts(accountsData);
            setTransactions(transactionsData);
            setGoals(goalsData);
            setCars(carsData);
            setRefuelings(refuelingsData);
            setServiceRecords(serviceRecordsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        } else {
            // Clear data on logout
            setAccounts([]);
            setTransactions([]);
            setGoals([]);
            setCars([]);
            setRefuelings([]);
            setServiceRecords([]);
            setIsLoading(false);
        }
    }, [isLoggedIn, fetchData]);

    const addTransaction = async (data: NewTransactionData) => {
        await api.addTransaction(data);
        await fetchData(); // Refetch all data to keep it simple
    };

    const addGoal = async (data: NewGoalData) => {
        await api.addGoal(data);
        await fetchData();
    };

    const deleteGoal = async (id: string) => {
        await api.deleteGoal(id);
        await fetchData();
    };

    return {
        isLoading,
        accounts,
        transactions,
        goals,
        cars,
        refuelings,
        serviceRecords,
        addTransaction,
        addGoal,
        deleteGoal,
        formatCurrency,
    };
};
