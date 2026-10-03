import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { FinanceDashboard } from './dashboard/FinanceDashboard';
import { InvoicesPage } from './invoices/InvoicesPage';
import { PaymentsPage } from './payments/PaymentsPage';
import { ExpensesPage } from './expenses/ExpensesPage';
import { AccountsPage } from './accounts/AccountsPage';
import { useFinance } from './financeContext';

export type FinanceTab = 'dashboard' | 'invoices' | 'payments' | 'expenses' | 'accounts';

interface FinanceModuleProps {
  initialTab?: FinanceTab;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>(initialTab);
  const { loading, error, reload } = useFinance();

  const tabs: { id: FinanceTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Finance Dashboard', icon: '📊' },
    { id: 'invoices', label: 'Invoices', icon: '📄' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'expenses', label: 'Expenses', icon: '📉' },
    { id: 'accounts', label: 'Chart of Accounts', icon: '🏛️' },
  ];

  return (
    <AppShell>
      <div className="module-container">
        {loading && (
          <div className="module-banner info">
            <span className="banner-spinner"></span>
            <span>Loading finance records...</span>
          </div>
        )}
        {error && (
          <div className="module-banner error">
            <span>{error}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => void reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Module Sub-Header Navigation */}
        <div className="module-subnav">
          <div className="module-subnav-left">
            <span className="module-brand-icon">💳</span>
            <div className="module-title-group">
              <h2 className="module-title">Finance & Accounting</h2>
              <span className="module-subtitle">Manage customer billing, payments received, corporate expenses & accounts</span>
            </div>
          </div>

          <div className="module-tabs-list">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`module-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{t.icon}</span>
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Views */}
        <div className="module-tab-content">
          {activeTab === 'dashboard' && <FinanceDashboard />}
          {activeTab === 'invoices' && <InvoicesPage />}
          {activeTab === 'payments' && <PaymentsPage />}
          {activeTab === 'expenses' && <ExpensesPage />}
          {activeTab === 'accounts' && <AccountsPage />}
        </div>
      </div>
    </AppShell>
  );
};

export default FinanceModule;
