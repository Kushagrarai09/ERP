import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { ProcurementProvider } from './procurementContext';
import { ProcurementDashboard } from './dashboard/ProcurementDashboard';
import { SuppliersPage } from './suppliers/SuppliersPage';
import { PurchaseOrdersPage } from './orders/PurchaseOrdersPage';
import { GoodsReceiptsPage } from './receipt/GoodsReceiptsPage';

export type ProcurementTab = 'dashboard' | 'suppliers' | 'orders' | 'receipts';

interface ProcurementModuleProps {
  initialTab?: ProcurementTab;
}

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<ProcurementTab>(initialTab);

  const tabs: { id: ProcurementTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Procurement Dashboard', icon: '📊' },
    { id: 'suppliers', label: 'Suppliers', icon: '🤝' },
    { id: 'orders', label: 'Purchase Orders', icon: '📝' },
    { id: 'receipts', label: 'Goods Receipts', icon: '📦' },
  ];

  return (
    <AppShell>
      <ProcurementProvider>
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
          {activeTab === 'dashboard' && <ProcurementDashboard />}
          {activeTab === 'suppliers' && <SuppliersPage />}
          {activeTab === 'orders' && <PurchaseOrdersPage />}
          {activeTab === 'receipts' && <GoodsReceiptsPage />}
        </div>
      </ProcurementProvider>
    </AppShell>
  );
};

export default ProcurementModule;
