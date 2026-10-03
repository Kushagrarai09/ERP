import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { InventoryDashboard } from './dashboard/InventoryDashboard';
import { ProductsPage } from './products/ProductsPage';
import { WarehousesPage } from './warehouses/WarehousesPage';
import { StockPage } from './stock/StockPage';
import { MovementsPage } from './movements/MovementsPage';
import { useInventory } from './inventoryContext';

export type InventoryTab = 'dashboard' | 'products' | 'warehouses' | 'stock' | 'movements';

interface InventoryModuleProps {
  initialTab?: InventoryTab;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>(initialTab);
  const { loading, error, reload } = useInventory();

  const tabs: { id: InventoryTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Inventory Dashboard', icon: '📊' },
    { id: 'products', label: 'Products Catalog', icon: '📱' },
    { id: 'warehouses', label: 'Warehouses', icon: '🏭' },
    { id: 'stock', label: 'Stock Matrix', icon: '📈' },
    { id: 'movements', label: 'Stock Movements', icon: '🔄' },
  ];

  return (
    <AppShell>
      <div className="module-container">
        {loading && (
          <div className="module-banner info">
            <span className="banner-spinner"></span>
            <span>Loading inventory records...</span>
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
            <span className="module-brand-icon">📦</span>
            <div className="module-title-group">
              <h2 className="module-title">Inventory Operations</h2>
              <span className="module-subtitle">Manage SKUs, warehouses, stock levels & movement logs</span>
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
          {activeTab === 'dashboard' && <InventoryDashboard />}
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'warehouses' && <WarehousesPage />}
          {activeTab === 'stock' && <StockPage />}
          {activeTab === 'movements' && <MovementsPage />}
        </div>
      </div>
    </AppShell>
  );
};

export default InventoryModule;
