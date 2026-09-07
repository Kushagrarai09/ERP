import React, { useState } from 'react';
import { useFinance } from '../financeContext';
import { Expense } from '../../../types/finance';
import { ExpenseFormModal } from './ExpenseFormModal';

export const ExpensesPage: React.FC = () => {
  const { expenses, deleteExpense } = useFinance();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.vendor.toLowerCase().includes(search.toLowerCase()) ||
      exp.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Operating Expenses
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Track company operating costs, office rent, software licenses, travel allowances, and utilities.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsFormOpen(true);
          }}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          + Record Expense
        </button>
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
          placeholder="Search by expense title, vendor, code..."
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Categories</option>
          <option value="Office">Office</option>
          <option value="Travel">Travel</option>
          <option value="Software">Software</option>
          <option value="Equipment">Equipment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Expenses Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Expense Title</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Vendor</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Amount (₹)</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No expense records found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#2563EB' }}>
                    {exp.code}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    📉 {exp.title}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#E2E8F0',
                        color: '#334155',
                      }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{exp.vendor}</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#DC2626' }}>
                    ₹{exp.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedExpense(exp);
                          setIsFormOpen(true);
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #CBD5E1',
                          background: 'white',
                          color: '#475569',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#FEE2E2',
                          color: '#991B1B',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isFormOpen && (
        <ExpenseFormModal
          expense={selectedExpense}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
};
