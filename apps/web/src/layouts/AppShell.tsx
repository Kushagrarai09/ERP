import React from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <Topbar />
      <div className="app-container">
        <Sidebar />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
