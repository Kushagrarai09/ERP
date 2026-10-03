import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { SalesDashboard } from './dashboard/SalesDashboard';
import { CustomersPage } from './customers/CustomersPage';
import { QuotationsPage } from './quotations/QuotationsPage';
import { OrdersPage } from './orders/OrdersPage';
import { useSales } from './salesContext';

export type SalesTab = 'dashboard' | 'customers' | 'quotations' | 'orders';

interface SalesModuleProps {
  initialTab?: SalesTab;
}

export const SalesModule: React.FC<SalesModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<SalesTab>(initialTab);
  const { loading, error, reload } = useSales();

  const tabs: { id: SalesTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Sales Dashboard', icon: '📊' },
    { id: 'customers', label: 'Customers', icon: '🛍️' },
    { id: 'quotations', label: 'Quotations', icon: '📋' },
    { id: 'orders', label: 'Sales Orders', icon: '📦' },
  ];

  return (
    <AppShell>
      <div className="module-container">
        {loading && (
          <div className="module-banner info">
            <span className="banner-spinner"></span>
            <span>Loading sales records...</span>
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
            <span className="module-brand-icon">💰</span>
            <div className="module-title-group">
              <h2 className="module-title">Sales & Orders</h2>
              <span className="module-subtitle">Generate quotations, track customer purchases & sales fulfillment</span>
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
          {activeTab === 'dashboard' && <SalesDashboard />}
          {activeTab === 'customers' && <CustomersPage />}
          {activeTab === 'quotations' && <QuotationsPage />}
          {activeTab === 'orders' && <OrdersPage />}
        </div>
      </div>
    </AppShell>
  );
};

export default SalesModule;
