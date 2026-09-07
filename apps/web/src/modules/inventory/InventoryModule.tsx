import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { InventoryProvider } from './inventoryContext';
import { InventoryDashboard } from './dashboard/InventoryDashboard';
import { ProductsPage } from './products/ProductsPage';
import { WarehousesPage } from './warehouses/WarehousesPage';
import { StockPage } from './stock/StockPage';
import { MovementsPage } from './movements/MovementsPage';

export type InventoryTab = 'dashboard' | 'products' | 'warehouses' | 'stock' | 'movements';

interface InventoryModuleProps {
  initialTab?: InventoryTab;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>(initialTab);

  const tabs: { id: InventoryTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Inventory Dashboard', icon: '📊' },
    { id: 'products', label: 'Products Catalog', icon: '📦' },
    { id: 'warehouses', label: 'Warehouses', icon: '🏭' },
    { id: 'stock', label: 'Stock Matrix', icon: '📈' },
    { id: 'movements', label: 'Stock Movements', icon: '🔄' },
  ];

  return (
    <AppShell>
      <InventoryProvider>
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
          {activeTab === 'dashboard' && <InventoryDashboard />}
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'warehouses' && <WarehousesPage />}
          {activeTab === 'stock' && <StockPage />}
          {activeTab === 'movements' && <MovementsPage />}
        </div>
      </InventoryProvider>
    </AppShell>
  );
};

export default InventoryModule;
