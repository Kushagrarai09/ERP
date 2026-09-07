import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../../../types/finance';
import { useFinance } from '../financeContext';

interface ExpenseFormModalProps {
  expense?: Expense | null;
  onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ expense, onClose }) => {
  const { addExpense, updateExpense } = useFinance();

  const [title, setTitle] = useState(expense?.title || '');
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || 'Office');
  const [amount, setAmount] = useState<number>(expense?.amount || 0);
  const [vendor, setVendor] = useState(expense?.vendor || '');
  const [description, setDescription] = useState(expense?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expense) {
      updateExpense(expense.id, {
        title,
        category,
        amount,
        vendor,
        description,
      });
    } else {
      addExpense({
        title,
        category,
        amount,
        vendor,
        description,
        status: 'Approved',
      });
    }
    onClose();
  };

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
          maxWidth: '520px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {expense ? 'Edit Expense Record' : 'Record New Expense'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Expense Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Office Space Rent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Expense Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="Office">Office</option>
                <option value="Travel">Travel</option>
                <option value="Software">Software</option>
                <option value="Equipment">Equipment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 700, color: '#DC2626' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Payee Vendor / Service Provider *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS India / Realty Trust"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Description & Purpose
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#3B82F6', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            >
              {expense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
