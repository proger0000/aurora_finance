// App.tsx

import React, { useState } from 'react';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import Garage from './components/Garage';
import AIAssistant from './components/AIAssistant';
import Reports from './components/Reports';
import Goals from './components/Goals';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Family from './components/Family';
import Login from './components/Login';
import { useSettings } from './contexts/SettingsContext';
import { useData } from './hooks/useData';
import { useAuth } from './contexts/AuthContext'; // Импортируем хук useAuth

type View = 'dashboard' | 'transactions' | 'reports' | 'goals' | 'garage' | 'ai' | 'settings' | 'family';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center md:justify-start flex-1 md:flex-none md:w-full px-2 md:px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group ${
      isActive
        ? 'bg-aura-accent/20 text-aura-accent'
        : 'text-aura-gray-600 dark:text-aura-gray-300 hover:bg-aura-gray-200 dark:hover:bg-aura-gray-800 hover:text-aura-gray-900 dark:hover:text-white'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className="w-6 h-6 md:mr-3">{icon}</span>
    <span className="opacity-0 md:opacity-100">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const { t } = useSettings();
  const { session, signOut } = useAuth(); // Получаем сессию и функцию выхода из контекста
  const isLoggedIn = !!session; // Пользователь в системе, если есть активная сессия

  const data = useData(isLoggedIn);

  const handleLogout = async () => {
    await signOut();
    setActiveView('dashboard');
  };

  const renderView = () => {
    if (data.isLoading && isLoggedIn) {
        return <div className="flex items-center justify-center h-full text-lg">Loading your financial aura...</div>;
    }
    switch (activeView) {
      case 'dashboard': return <Dashboard data={data} />;
      case 'transactions': return <Transactions data={data} />;
      case 'reports': return <Reports data={data} />;
      case 'goals': return <Goals data={data} />;
      case 'garage': return <Garage data={data} />;
      case 'ai': return <AIAssistant data={data} />;
      case 'settings': return <Settings />;
      case 'family': return <Family />;
      default: return <Dashboard data={data} />;
    }
  };
  
  // Если сессии нет, показываем компонент Login
  if (!session) {
      return <Login />;
  }

  return (
    <div className="min-h-screen bg-aura-gray-100 dark:bg-aura-gray-950 bg-grid-aura-gray-300/[0.5] dark:bg-grid-aura-gray-800/[0.2] relative">
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-aura-gray-100 dark:bg-aura-gray-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="fixed bottom-0 md:relative md:w-20 lg:w-64 bg-aura-gray-100/80 dark:bg-aura-gray-950/50 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-t md:border-t-0 md:border-r border-aura-gray-300 dark:border-aura-gray-800 p-2 md:p-4 w-full md:h-screen z-50">
          <div className="flex justify-around md:flex-col md:justify-start h-full">
            <div className="hidden md:flex items-center mb-10 px-2">
              <span className="w-8 h-8 mr-2">{ICONS.logo}</span>
              <h1 className="text-xl font-bold text-aura-gray-900 dark:text-white opacity-0 md:opacity-100">Aura Finance</h1>
            </div>
            <nav className="flex flex-row md:flex-col items-center justify-around md:justify-start w-full md:space-y-2">
              <NavItem icon={ICONS.dashboard} label={t('nav.dashboard')} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
              <NavItem icon={ICONS.transactions} label={t('nav.transactions')} isActive={activeView === 'transactions'} onClick={() => setActiveView('transactions')} />
              <NavItem icon={ICONS.reports} label={t('nav.reports')} isActive={activeView === 'reports'} onClick={() => setActiveView('reports')} />
              <NavItem icon={ICONS.goals} label={t('nav.goals')} isActive={activeView === 'goals'} onClick={() => setActiveView('goals')} />
              <NavItem icon={ICONS.garage} label={t('nav.garage')} isActive={activeView === 'garage'} onClick={() => setActiveView('garage')} />
               <NavItem icon={ICONS.family} label={t('nav.family')} isActive={activeView === 'family'} onClick={() => setActiveView('family')} />
              <NavItem icon={ICONS.ai} label={t('nav.ai')} isActive={activeView === 'ai'} onClick={() => setActiveView('ai')} />
              <div className="contents md:hidden">
                  <NavItem icon={ICONS.settings} label={t('nav.settings')} isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
              </div>
            </nav>
            <div className="hidden md:block mt-auto space-y-2">
               <NavItem icon={ICONS.settings} label={t('nav.settings')} isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
               <NavItem icon={ICONS.logout} label={t('nav.logout')} isActive={false} onClick={handleLogout} />
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 relative z-10">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;