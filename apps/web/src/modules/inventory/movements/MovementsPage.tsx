import React, { useState } from 'react';
import { useInventory } from '../inventoryContext';
import { StockMovementType } from '../../../types/inventory';

export const MovementsPage: React.FC = () => {
  const { movements } = useInventory();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      (m.referenceCode && m.referenceCode.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Stock Movements Audit Log
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Historical record of inventory ins, outs, sales dispatches, transfers, and stock adjustments.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search by product, SKU, reference code (SO-00124)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '220px',
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Movement Types</option>
          <option value="Purchase">Purchase (IN)</option>
          <option value="Sale">Sale (OUT)</option>
          <option value="Adjustment">Adjustment</option>
          <option value="Transfer">Transfer</option>
          <option value="Return">Return</option>
        </select>
      </div>

      {/* Movements Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Date & Time</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Product Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Warehouse</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Movement Type</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Quantity</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reference</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No stock movements found.
                </td>
              </tr>
            ) : (
              filteredMovements.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(m.date).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    📦 {m.productName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#2563EB', fontWeight: 600 }}>
                    {m.sku}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                    🏭 {m.warehouseName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background:
                          m.type === 'Purchase'
                            ? '#D1FAE5'
                            : m.type === 'Sale'
                            ? '#FEE2E2'
                            : m.type === 'Transfer'
                            ? '#DBEAFE'
                            : '#FEF3C7',
                        color:
                          m.type === 'Purchase'
                            ? '#065F46'
                            : m.type === 'Sale'
                            ? '#991B1B'
                            : m.type === 'Transfer'
                            ? '#1E40AF'
                            : '#92400E',
                      }}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: m.quantity > 0 ? '#059669' : '#DC2626' }}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {m.referenceCode || 'Direct'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
