import React from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <Topbar />
      <div className="app-body">
        <Sidebar />
        <div className="app-main-wrapper">
          <main className="app-content">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
