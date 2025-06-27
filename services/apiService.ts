// services/apiService.ts

import { supabase } from './supabaseClient';
import { Account, Transaction, Goal, Car, Refueling, ServiceRecord, NewTransactionData, NewGoalData, UserProfile } from "../types";

/**
 * Вспомогательная функция для получения текущего пользователя.
 */
const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in.");
    return user;
}

// --- API FUNCTIONS ---

export const getAccounts = async (): Promise<Account[]> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase.from('accounts').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data || [];
};

export const getTransactions = async (): Promise<Transaction[]> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data || [];
};

export const getGoals = async (): Promise<Goal[]> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase.from('goals').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data || [];
};

export const getCars = async (): Promise<Car[]> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase.from('cars').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data || [];
};

export const getRefuelings = async (): Promise<Refueling[]> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase.from('refuelings').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data || [];
};

export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase.from('service_records').select('*').eq('user_id', user.id);
    if (error) throw error;
    return data || [];
};

export const addTransaction = async (data: NewTransactionData): Promise<Transaction> => {
    const user = await getCurrentUser();
    const recordToInsert = { ...data, user_id: user.id };
    
    const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert(recordToInsert)
        .select()
        .single();

    if (error) throw error;
    return newTransaction;
};

export const addGoal = async (data: NewGoalData): Promise<Goal> => {
    const user = await getCurrentUser();
    const recordToInsert = { ...data, user_id: user.id, currentAmount: 0 };

    const { data: newGoal, error } = await supabase
        .from('goals')
        .insert(recordToInsert)
        .select()
        .single();

    if (error) throw error;
    return newGoal;
}

export const deleteGoal = async (id: string): Promise<void> => {
    const user = await getCurrentUser();
    const { error } = await supabase
        .from('goals')
        .delete()
        .match({ id: id, user_id: user.id }); // Удаляем только если ID и user_id совпадают

    if (error) throw error;
};

// --- ✅ НОВЫЕ ФУНКЦИИ ДЛЯ ПРОФИЛЯ ---

/**
 * Получает профиль (настройки) текущего пользователя.
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
    const user = await getCurrentUser();
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single(); // .single() вернет один объект или null

    if (error && error.code !== 'PGRST116') { // Игнорируем ошибку "не найдено строк"
        console.error('Error fetching user profile:', error);
        throw error;
    }
    return data;
}

/**
 * Обновляет профиль (настройки) текущего пользователя.
 */
export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const user = await getCurrentUser();
    const profileUpdates = { ...updates, id: user.id, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileUpdates) // .upsert() создаст или обновит запись
        .select()
        .single();

    if (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
    return data;
}