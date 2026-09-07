import React, { useState } from 'react';
import { useFinance } from '../financeContext';

export const AccountsPage: React.FC = () => {
  const { accounts } = useFinance();
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredAccounts = accounts.filter((acc) => {
    return typeFilter === 'all' || acc.type === typeFilter;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Accounts Directory (Chart of Accounts Foundation)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Core financial accounts establishing assets, liabilities, revenue streams, and expense ledgers.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
        }}
      >
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
          <option value="all">All Account Types</option>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* Accounts Directory Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Account Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Account Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Account Type</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Current Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr key={acc.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#2563EB' }}>
                  {acc.code}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                  🏛️ {acc.name}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background:
                        acc.type === 'Asset'
                          ? '#DBEAFE'
                          : acc.type === 'Revenue'
                          ? '#D1FAE5'
                          : acc.type === 'Expense'
                          ? '#FEE2E2'
                          : '#FEF3C7',
                      color:
                        acc.type === 'Asset'
                          ? '#1E40AF'
                          : acc.type === 'Revenue'
                          ? '#065F46'
                          : acc.type === 'Expense'
                          ? '#991B1B'
                          : '#92400E',
                    }}
                  >
                    {acc.type}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                  ₹{(acc.balance / 100000).toFixed(2)} Lakhs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
