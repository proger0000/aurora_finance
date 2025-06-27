
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { Theme, Language, Currency } from '../types';

// The user-provided error is about resolving module specifiers.
// In a browser-native ESM setup without a bundler, importing JSON files directly
// is problematic. The simplest and most robust fix is to embed the translation
// data directly into the script, eliminating the problematic import.
const en = {
  "nav": { "dashboard": "Dashboard", "transactions": "Transactions", "reports": "Reports", "goals": "Goals", "garage": "Garage", "family": "Family", "ai": "Aura AI", "settings": "Settings", "logout": "Logout" },
  "common": { "save": "Save", "saving": "Saving...", "cancel": "Cancel", "delete": "Delete" },
  "login": { "title": "Welcome to Aura Finance", "subtitle": "Your personal financial mentor.", "email": "Email Address", "password": "Password", "loginButton": "Login", "signupPrompt": "Don't have an account?", "signupLink": "Sign Up", "guestButton": "Continue as Guest" },
  "dashboard": { "title": "Dashboard", "totalBalance": "Total Balance", "incomeMonth": "Income (Month)", "expensesMonth": "Expenses (Month)", "monthlySpending": "Monthly Spending", "savingsGoals": "Savings Goals", "toGo": "to go", "accounts": "Accounts", "recentTransactions": "Recent Transactions", "noGoals": "No savings goals yet. Create one!", "noTransactions": "No transactions recorded yet." },
  "transactions": { "title": "Transactions", "addIncome": "Add Income", "addExpense": "Add Expense", "date": "Date", "category": "Category", "account": "Account", "amount": "Amount", "form": { "amount": "Amount", "category": "Category (e.g., Groceries, Salary)", "account": "Account", "date": "Date", "notes": "Notes" } },
  "reports": { "title": "Reports", "export": "Export to Excel", "incomeVsExpense": "Income vs. Expense", "income": "Income", "expenses": "Expenses", "analyticsComingSoon": "Analytics (Coming Soon)", "periodComparison": "Period Comparison", "periodComparisonDesc": "Compare spending between this month and last.", "budgetForecasting": "Budget Forecasting", "budgetForecastingDesc": "Predict future balances based on your habits." },
  "goals": { "title": "Savings Goals", "newGoal": "New Goal", "addGoalButton": "Add Goal", "of": "of", "complete": "complete", "toGo": "to go", "targetDate": "Target Date", "noGoals": "You have no savings goals. Why not add one?", "deleteConfirm": "Are you sure you want to delete the goal \"{{name}}\"?", "form": { "name": "Goal Name (e.g., Vacation to Japan)", "targetAmount": "Target Amount", "targetDate": "Target Date", "optional": "Optional" } },
  "garage": { "title": "Garage", "noCar": "No cars added to your garage yet.", "totalCost": "Total Cost", "costPerKm": "Cost / km", "avgConsumption": "Avg. Consumption", "monthlyCosts": "Monthly Costs", "energyConsumption": "Energy Consumption", "consumption": "Consumption", "refuelingHistory": "Refueling History", "serviceHistory": "Service History", "fuel": "Fuel", "service": "Service" },
  "family": { "title": "Family", "comingSoon": "Family sharing features are coming soon!", "description": "Invite family members to manage shared accounts and budgets together." },
  "ai": { "title": "Aura AI Assistant", "initialGreeting": "Hello! I'm Aura, your personal financial mentor. How can I help you understand your finances today?", "inputPlaceholder": "Ask about your spending, goals, or car expenses..." },
  "settings": { "title": "Settings", "appearance": { "title": "Appearance", "description": "Customize the look and feel of the application.", "light": "Light", "dark": "Dark" }, "language": { "title": "Language", "description": "Choose the language for the application interface.", "english": "English", "ukrainian": "Ukrainian" }, "currency": { "title": "Currency", "description": "Select your primary currency for all financial data." } }
};
const uk = {
  "nav": { "dashboard": "Панель", "transactions": "Транзакції", "reports": "Звіти", "goals": "Цілі", "garage": "Гараж", "family": "Сім'я", "ai": "Aura AI", "settings": "Налаштування", "logout": "Вийти" },
  "common": { "save": "Зберегти", "saving": "Збереження...", "cancel": "Скасувати", "delete": "Видалити" },
  "login": { "title": "Ласкаво просимо в Aura Finance", "subtitle": "Ваш особистий фінансовий ментор.", "email": "Електронна пошта", "password": "Пароль", "loginButton": "Увійти", "signupPrompt": "Немає акаунту?", "signupLink": "Зареєструватися", "guestButton": "Продовжити як гість" },
  "dashboard": { "title": "Інформаційна панель", "totalBalance": "Загальний баланс", "incomeMonth": "Дохід (місяць)", "expensesMonth": "Витрати (місяць)", "monthlySpending": "Щомісячні витрати", "savingsGoals": "Цілі накопичень", "toGo": "залишилось", "accounts": "Рахунки", "recentTransactions": "Останні транзакції", "noGoals": "Цілей накопичень ще немає. Створіть одну!", "noTransactions": "Транзакцій ще не записано." },
  "transactions": { "title": "Транзакції", "addIncome": "Додати дохід", "addExpense": "Додати витрату", "date": "Дата", "category": "Категорія", "account": "Рахунок", "amount": "Сума", "form": { "amount": "Сума", "category": "Категорія (напр., Продукти, Зарплата)", "account": "Рахунок", "date": "Дата", "notes": "Нотатки" } },
  "reports": { "title": "Звіти", "export": "Експорт в Excel", "incomeVsExpense": "Доходи проти Витрат", "income": "Доходи", "expenses": "Витрати", "analyticsComingSoon": "Аналітика (незабаром)", "periodComparison": "Порівняння періодів", "periodComparisonDesc": "Порівняйте витрати цього та минулого місяця.", "budgetForecasting": "Прогнозування бюджету", "budgetForecastingDesc": "Прогнозуйте майбутні баланси на основі ваших звичок." },
  "goals": { "title": "Цілі Накопичень", "newGoal": "Нова ціль", "addGoalButton": "Додати Ціль", "of": "з", "complete": "завершено", "toGo": "залишилось", "targetDate": "Кінцева дата", "noGoals": "У вас немає цілей накопичень. Чому б не додати одну?", "deleteConfirm": "Ви впевнені, що хочете видалити ціль \"{{name}}\"?", "form": { "name": "Назва цілі (напр., Відпустка в Японії)", "targetAmount": "Бажана сума", "targetDate": "Кінцева дата", "optional": "Необов'язково" } },
  "garage": { "title": "Гараж", "noCar": "До вашого гаража ще не додано автомобілів.", "totalCost": "Загальна вартість", "costPerKm": "Вартість / км", "avgConsumption": "Середнє споживання", "monthlyCosts": "Щомісячні витрати", "energyConsumption": "Споживання енергії", "consumption": "Споживання", "refuelingHistory": "Історія заправок", "serviceHistory": "Історія обслуговування", "fuel": "Пальне", "service": "Обслуговування" },
  "family": { "title": "Сім'я", "comingSoon": "Функції сімейного доступу з'являться незабаром!", "description": "Запрошуйте членів сім'ї для спільного управління рахунками та бюджетами." },
  "ai": { "title": "AI-асистент Aura", "initialGreeting": "Привіт! Я Aura, ваш особистий фінансовий ментор. Чим можу допомогти вам розібратися у фінансах сьогодні?", "inputPlaceholder": "Запитайте про ваші витрати, цілі чи видатки на авто..." },
  "settings": { "title": "Налаштування", "appearance": { "title": "Вигляд", "description": "Налаштуйте зовнішній вигляд та відчуття додатку.", "light": "Світла", "dark": "Темна" }, "language": { "title": "Мова", "description": "Оберіть мову інтерфейсу додатку.", "english": "Англійська", "ukrainian": "Українська" }, "currency": { "title": "Валюта", "description": "Оберіть основну валюту для всіх фінансових даних." } }
};

type Translations = typeof en;

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, values?: Record<string, string>) => string;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatCurrency: (amount: number) => string;
}

const translations: Record<Language, Translations> = { en, uk };

const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => 
        getFromLocalStorage<Theme>('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT)
    );
    const [language, setLanguage] = useState<Language>(() => getFromLocalStorage<Language>('language', 'en'));
    const [currency, setCurrency] = useState<Currency>(() => getFromLocalStorage<Currency>('currency', 'USD'));

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(Theme.LIGHT, Theme.DARK);
        root.classList.add(theme);
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);
    
    useEffect(() => {
        localStorage.setItem('language', JSON.stringify(language));
    }, [language]);

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);
    
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const t = (key: string, values?: Record<string, string>): string => {
        const keys = key.split('.');
        let result: any = translations[language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                let fallbackResult: any = translations.en;
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                }
                return fallbackResult || key;
            }
        }
        
        let S = result as string || key;
        if (values) {
            Object.keys(values).forEach(valueKey => {
                S = S.replace(`{{${valueKey}}}`, values[valueKey]);
            });
        }
        return S;
    };
    
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const value = useMemo(() => ({
        theme,
        setTheme,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatCurrency,
    }), [theme, language, currency]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
