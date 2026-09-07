import React, { useState } from 'react';
import { useFinance } from '../financeContext';

export const PaymentsPage: React.FC = () => {
  const { payments } = useFinance();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceCode.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Customer Payments Log
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Audit trail of customer cash collections, bank transfers, UPI transactions, and card payments.
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
          placeholder="Search by Payment ID (PAY-00124), Invoice code, Customer, UTR Ref..."
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
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Payment Methods</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      {/* Payments Log Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Payment ID</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ref Invoice</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Payment Method</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Collected Amount</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Payment Date</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reference UTR</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No payment transactions logged matching your search.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    💳 {p.code}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#2563EB' }}>
                    {p.invoiceCode}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {p.customerName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background:
                          p.method === 'Bank Transfer'
                            ? '#DBEAFE'
                            : p.method === 'UPI'
                            ? '#D1FAE5'
                            : p.method === 'Card'
                            ? '#F3E8FF'
                            : '#FEF3C7',
                        color:
                          p.method === 'Bank Transfer'
                            ? '#1E40AF'
                            : p.method === 'UPI'
                            ? '#065F46'
                            : p.method === 'Card'
                            ? '#6B21A8'
                            : '#92400E',
                      }}
                    >
                      {p.method}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569', fontWeight: 500 }}>
                    {p.referenceNumber || 'N/A'}
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
