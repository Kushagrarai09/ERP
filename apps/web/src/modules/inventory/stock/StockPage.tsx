import React, { useState } from 'react';
import { useInventory } from '../inventoryContext';

export const StockPage: React.FC = () => {
  const { stocks, warehouses, products } = useInventory();

  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  const filteredStocks = stocks.filter((s) => {
    const matchesSearch =
      s.productName.toLowerCase().includes(search.toLowerCase()) ||
      s.sku.toLowerCase().includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'all' || s.warehouseId === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Stock Matrix & Availability
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Real-time product inventory distribution showing available, reserved, and total quantities.
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
          placeholder="Search by product name, SKU..."
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
          value={warehouseFilter}
          onChange={(e) => setWarehouseFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Warehouses</option>
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>{wh.name}</option>
          ))}
        </select>
      </div>

      {/* Stock Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Product Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Warehouse Location</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Available Qty</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reserved Qty</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Qty</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No stock records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredStocks.map((st) => {
                const prod = products.find((p) => p.sku === st.sku || p.name === st.productName);
                const isLow = st.available <= (prod?.reorderLevel || 15);

                return (
                  <tr key={st.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#2563EB' }}>
                      {st.sku}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                      📦 {st.productName}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                      🏭 {st.warehouseName}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                      {st.available}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#D97706' }}>
                      {st.reserved}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                      {st.total}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: isLow ? '#FEE2E2' : '#D1FAE5',
                          color: isLow ? '#991B1B' : '#065F46',
                        }}
                      >
                        {isLow ? '⚠️ Low Stock' : '✓ In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
