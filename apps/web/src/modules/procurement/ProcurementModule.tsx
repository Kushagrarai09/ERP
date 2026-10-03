import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { ProcurementDashboard } from './dashboard/ProcurementDashboard';
import { SuppliersPage } from './suppliers/SuppliersPage';
import { PurchaseOrdersPage } from './orders/PurchaseOrdersPage';
import { GoodsReceiptsPage } from './receipt/GoodsReceiptsPage';
import { useProcurement } from './procurementContext';

export type ProcurementTab = 'dashboard' | 'suppliers' | 'orders' | 'receipts';

interface ProcurementModuleProps {
  initialTab?: ProcurementTab;
}

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<ProcurementTab>(initialTab);
  const { loading, error, reload } = useProcurement();

  const tabs: { id: ProcurementTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Procurement Dashboard', icon: '📊' },
    { id: 'suppliers', label: 'Suppliers Directory', icon: '🤝' },
    { id: 'orders', label: 'Purchase Orders', icon: '📝' },
    { id: 'receipts', label: 'Goods Receipts', icon: '📬' },
  ];

  return (
    <AppShell>
      <div className="module-container">
        {loading && (
          <div className="module-banner info">
            <span className="banner-spinner"></span>
            <span>Loading procurement records...</span>
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
            <span className="module-brand-icon">🔗</span>
            <div className="module-title-group">
              <h2 className="module-title">Procurement & Sourcing</h2>
              <span className="module-subtitle">Manage vendors, create purchase orders & inspect goods receipts</span>
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
          {activeTab === 'dashboard' && <ProcurementDashboard />}
          {activeTab === 'suppliers' && <SuppliersPage />}
          {activeTab === 'orders' && <PurchaseOrdersPage />}
          {activeTab === 'receipts' && <GoodsReceiptsPage />}
        </div>
      </div>
    </AppShell>
  );
};

export default ProcurementModule;
