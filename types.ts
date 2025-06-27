
export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export type Language = 'en' | 'uk';

export type Currency = 'USD' | 'EUR' | 'UAH';

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    accountId: string;
    date: string; // ISO string
    notes?: string;
}

export type NewTransactionData = Omit<Transaction, 'id'>;

export interface Account {
    id: string;
    name: string;
    balance: number;
    currency: Currency;
}

export interface Goal {
    id:string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    endDate?: string;
}

export type NewGoalData = Omit<Goal, 'id' | 'currentAmount'>;


export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    licensePlate?: string;
    photoUrl: string;
}

export interface Refueling {
    id: string;
    carId: string;
    date: string;
    mileage: number;
    liters: number;
    pricePerLiter: number;
}

export interface ServiceRecord {
    id: string;
    carId: string;
    date: string;
    mileage: number;
    type: string;
    partsCost: number;
    laborCost: number;
    notes: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    isLoading?: boolean;
}

export interface FamilyMember {
    id: string;
    name: string;
    role: 'owner' | 'member';
    avatarUrl?: string;
}
