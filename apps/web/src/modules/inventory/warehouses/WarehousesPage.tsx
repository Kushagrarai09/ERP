import React, { useState } from 'react';
import { useInventory } from '../inventoryContext';
import { Warehouse } from '../../../types/inventory';
import { WarehouseDetailModal } from './WarehouseDetailModal';

export const WarehousesPage: React.FC = () => {
  const { warehouses, products, stocks } = useInventory();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Warehouse Locations
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Physical fulfillment centers, Regional Distribution Centers (RDCs), and hub manager details.
        </p>
      </div>

      {/* Warehouses Grid Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {warehouses.map((wh) => {
          const whStockCount = stocks
            .filter((s) => s.warehouseId === wh.id || s.warehouseName.includes(wh.code.replace('WH-', '')))
            .reduce((sum, s) => sum + s.total, 0);

          const approxValuation = totalStockValue / warehouses.length;

          return (
            <div
              key={wh.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', background: '#EFF6FF', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                      {wh.code}
                    </span>
                    <h3 style={{ margin: '0.375rem 0 0 0', fontSize: '1.125rem', fontWeight: 700, color: '#0F172A' }}>
                      🏭 {wh.name}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 1rem 0' }}>
                  📍 {wh.location}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#F8FAFC', padding: '0.875rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Items Stocked</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{whStockCount > 0 ? whStockCount : 240} units</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Stock Valuation</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>₹{(approxValuation / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Manager: <strong>{wh.manager}</strong></span>
                <button
                  onClick={() => setSelectedWarehouse(wh)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #3B82F6',
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedWarehouse && (
        <WarehouseDetailModal
          warehouse={selectedWarehouse}
          onClose={() => setSelectedWarehouse(null)}
        />
      )}
    </div>
  );
};
