import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { SalesProvider } from './salesContext';
import { SalesDashboard } from './dashboard/SalesDashboard';
import { CustomersPage } from './customers/CustomersPage';
import { QuotationsPage } from './quotations/QuotationsPage';
import { OrdersPage } from './orders/OrdersPage';

export type SalesTab = 'dashboard' | 'customers' | 'quotations' | 'orders';

interface SalesModuleProps {
  initialTab?: SalesTab;
}

export const SalesModule: React.FC<SalesModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<SalesTab>(initialTab);

  const tabs: { id: SalesTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Sales Dashboard', icon: '📊' },
    { id: 'customers', label: 'Customers', icon: '🛍️' },
    { id: 'quotations', label: 'Quotations', icon: '📋' },
    { id: 'orders', label: 'Sales Orders', icon: '📦' },
  ];

  return (
    <AppShell>
      <SalesProvider>
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
          {activeTab === 'dashboard' && <SalesDashboard />}
          {activeTab === 'customers' && <CustomersPage />}
          {activeTab === 'quotations' && <QuotationsPage />}
          {activeTab === 'orders' && <OrdersPage />}
        </div>
      </SalesProvider>
    </AppShell>
  );
};

export default SalesModule;
