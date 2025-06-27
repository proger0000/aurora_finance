
import { Account, Transaction, TransactionType, Goal, Car, Refueling, ServiceRecord, NewTransactionData, NewGoalData, Currency } from "../types";

// --- MOCK DATABASE ---
let MOCK_ACCOUNTS: Account[] = [
    { id: 'acc1', name: 'Main Bank', balance: 7850.55, currency: 'USD' },
    { id: 'acc2', name: 'Savings', balance: 12340.00, currency: 'USD' },
    { id: 'acc3', name: 'Cash', balance: 320.10, currency: 'UAH' },
];

let MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: TransactionType.EXPENSE, amount: 75.50, category: 'Groceries', accountId: 'acc1', date: '2023-10-26T10:00:00Z' },
    { id: 't2', type: TransactionType.EXPENSE, amount: 12.00, category: 'Coffee', accountId: 'acc1', date: '2023-10-26T08:30:00Z' },
    { id: 't3', type: TransactionType.INCOME, amount: 2500.00, category: 'Salary', accountId: 'acc1', date: '2023-10-25T09:00:00Z' },
    { id: 't4', type: TransactionType.EXPENSE, amount: 250.00, category: 'Utilities', accountId: 'acc2', date: '2023-10-24T14:00:00Z' },
    { id: 't5', type: TransactionType.EXPENSE, amount: 45.99, category: 'Restaurants', accountId: 'acc1', date: '2023-10-23T19:45:00Z' },
    { id: 't6', type: TransactionType.EXPENSE, amount: 1200.00, category: 'Rent', accountId: 'acc1', date: '2023-10-20T12:00:00Z' },
    { id: 't7', type: TransactionType.INCOME, amount: 9000.00, category: 'Freelance', accountId: 'acc3', date: '2023-10-18T18:00:00Z' },
];

let MOCK_GOALS: Goal[] = [
    { id: 'g1', name: 'Vacation to Japan', currentAmount: 3500, targetAmount: 8000, endDate: '2024-07-01' },
    { id: 'g2', name: 'New Laptop', currentAmount: 1200, targetAmount: 2000 },
    { id: 'g3', name: 'Emergency Fund', currentAmount: 5000, targetAmount: 10000, endDate: '2025-01-01' },
];

let MOCK_CARS: Car[] = [{
    id: 'c1',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    photoUrl: 'https://picsum.photos/seed/teslay/400/200'
}];

let MOCK_REFUELINGS: Refueling[] = [
    { id: 'r1', carId: 'c1', date: '2023-10-01', mileage: 1500, liters: 40, pricePerLiter: 0.15 },
    { id: 'r2', carId: 'c1', date: '2023-10-10', mileage: 1950, liters: 42, pricePerLiter: 0.16 },
    { id: 'r3', carId: 'c1', date: '2023-10-22', mileage: 2400, liters: 38, pricePerLiter: 0.15 },
];

let MOCK_SERVICES: ServiceRecord[] = [
    { id: 's1', carId: 'c1', date: '2023-09-15', mileage: 1000, type: 'Tire Rotation', partsCost: 0, laborCost: 50, notes: 'Standard rotation.' },
    { id: 's2', carId: 'c1', date: '2023-10-20', mileage: 2350, type: 'Wiper Fluid Refill', partsCost: 5, laborCost: 0, notes: 'Topped up.' },
];
// --- END MOCK DATABASE ---

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- API FUNCTIONS ---

export const getAccounts = async (): Promise<Account[]> => {
    await simulateDelay(200);
    return JSON.parse(JSON.stringify(MOCK_ACCOUNTS));
};

export const getTransactions = async (): Promise<Transaction[]> => {
    await simulateDelay(300);
    return JSON.parse(JSON.stringify(MOCK_TRANSACTIONS));
};

export const getGoals = async (): Promise<Goal[]> => {
    await simulateDelay(400);
    return JSON.parse(JSON.stringify(MOCK_GOALS));
};

export const getCars = async (): Promise<Car[]> => {
    await simulateDelay(150);
    return JSON.parse(JSON.stringify(MOCK_CARS));
};

export const getRefuelings = async (): Promise<Refueling[]> => {
    await simulateDelay(250);
    return JSON.parse(JSON.stringify(MOCK_REFUELINGS));
};

export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
    await simulateDelay(280);
    return JSON.parse(JSON.stringify(MOCK_SERVICES));
};

export const addTransaction = async (data: NewTransactionData): Promise<Transaction> => {
    await simulateDelay(500);
    const newTransaction: Transaction = {
        ...data,
        id: `t${Date.now()}`
    };
    
    // Update account balance
    const account = MOCK_ACCOUNTS.find(acc => acc.id === data.accountId);
    if (account) {
        if (data.type === TransactionType.INCOME) {
            account.balance += data.amount;
        } else {
            account.balance -= data.amount;
        }
    }

    MOCK_TRANSACTIONS.push(newTransaction);
    return newTransaction;
};

export const addGoal = async (data: NewGoalData): Promise<Goal> => {
    await simulateDelay(500);
    const newGoal: Goal = {
        ...data,
        id: `g${Date.now()}`,
        currentAmount: 0,
    };
    MOCK_GOALS.push(newGoal);
    return newGoal;
}

export const deleteGoal = async (id: string): Promise<void> => {
    await simulateDelay(500);
    MOCK_GOALS = MOCK_GOALS.filter(g => g.id !== id);
    return;
}
