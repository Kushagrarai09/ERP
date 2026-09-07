import React from 'react';
import { Warehouse } from '../../../types/inventory';
import { useInventory } from '../inventoryContext';

interface WarehouseDetailModalProps {
  warehouse: Warehouse;
  onClose: () => void;
}

export const WarehouseDetailModal: React.FC<WarehouseDetailModalProps> = ({ warehouse, onClose }) => {
  const { stocks, products } = useInventory();

  const warehouseStocks = stocks.filter((s) => s.warehouseId === warehouse.id || s.warehouseName.includes(warehouse.code.replace('WH-', '')));

  const totalValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0) / 3;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.75rem',
          maxWidth: '580px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                🏭 {warehouse.name}
              </h2>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: '#DBEAFE', color: '#1E40AF' }}>
                {warehouse.code}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Location: {warehouse.location}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Hub Manager</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{warehouse.manager}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Contact Phone</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{warehouse.phone}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Corporate Email</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{warehouse.email}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Stock Valuation</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>₹{(totalValue / 100000).toFixed(2)} Lakhs</span>
          </div>
        </div>

        {/* Stock Summary Table */}
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
            Stock Item Inventory Summary
          </h4>
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', color: '#475569' }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Product</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Available</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Reserved</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {warehouseStocks.map((ws) => (
                  <tr key={ws.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: '#0F172A' }}>{ws.productName}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#059669', fontWeight: 600 }}>{ws.available}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#D97706' }}>{ws.reserved}</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>{ws.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#F1F5F9', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
