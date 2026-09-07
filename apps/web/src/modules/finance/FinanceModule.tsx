import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { FinanceProvider } from './financeContext';
import { FinanceDashboard } from './dashboard/FinanceDashboard';
import { InvoicesPage } from './invoices/InvoicesPage';
import { PaymentsPage } from './payments/PaymentsPage';
import { ExpensesPage } from './expenses/ExpensesPage';
import { AccountsPage } from './accounts/AccountsPage';

export type FinanceTab = 'dashboard' | 'invoices' | 'payments' | 'expenses' | 'accounts';

interface FinanceModuleProps {
  initialTab?: FinanceTab;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>(initialTab);

  const tabs: { id: FinanceTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Finance Dashboard', icon: '📊' },
    { id: 'invoices', label: 'Invoices', icon: '📄' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'expenses', label: 'Expenses', icon: '📉' },
    { id: 'accounts', label: 'Accounts', icon: '🏛️' },
  ];

  return (
    <AppShell>
      <FinanceProvider>
        {/* Module Sub-Header Navigation */}
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.id ? '3px solid #3B82F6' : '3px solid transparent',
                color: activeTab === t.id ? '#2563EB' : '#64748B',
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'dashboard' && <FinanceDashboard />}
          {activeTab === 'invoices' && <InvoicesPage />}
          {activeTab === 'payments' && <PaymentsPage />}
          {activeTab === 'expenses' && <ExpensesPage />}
          {activeTab === 'accounts' && <AccountsPage />}
        </div>
      </FinanceProvider>
    </AppShell>
  );
};

export default FinanceModule;
