import React, { useState } from 'react';
import { useProcurement } from '../procurementContext';

export const GoodsReceiptsPage: React.FC = () => {
  const { goodsReceipts } = useProcurement();
  const [search, setSearch] = useState('');

  const filteredGRs = goodsReceipts.filter((gr) => {
    return (
      gr.code.toLowerCase().includes(search.toLowerCase()) ||
      gr.poCode.toLowerCase().includes(search.toLowerCase()) ||
      gr.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      gr.warehouseName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Goods Receipts (Inbound Stock Log)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Official inbound inventory slips, received item counts, and warehouse location logs.
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
        }}
      >
        <input
          type="text"
          placeholder="Search GR code (GR-00124), PO code, supplier, warehouse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
          }}
        />
      </div>

      {/* Receipts Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>GR Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ref PO Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Supplier Vendor</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Receiving Warehouse</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Received Date</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Received By</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredGRs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No goods receipts recorded yet.
                </td>
              </tr>
            ) : (
              filteredGRs.map((gr) => (
                <tr key={gr.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    📦 {gr.code}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#2563EB' }}>
                    {gr.poCode}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {gr.supplierName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                    🏭 {gr.warehouseName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(gr.receivedDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{gr.receivedBy}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#D1FAE5',
                        color: '#065F46',
                      }}
                    >
                      ✓ Stock Increased
                    </span>
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
