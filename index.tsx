// index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>      {/* AuthProvider теперь снаружи */}
      <SettingsProvider>  {/* SettingsProvider теперь внутри */}
        <App />
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);