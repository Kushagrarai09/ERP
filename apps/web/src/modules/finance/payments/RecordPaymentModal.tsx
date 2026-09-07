import React, { useState } from 'react';
import { Invoice, PaymentMethod } from '../../../types/finance';
import { useFinance } from '../financeContext';

interface RecordPaymentModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ invoice, onClose }) => {
  const { recordPayment } = useFinance();

  const [amount, setAmount] = useState<number>(invoice.outstandingAmount);
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment(invoice.code, amount, method, referenceNumber);
    setSuccessNotice(true);
    setTimeout(() => {
      onClose();
    }, 1500);
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
        zIndex: 1100,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              Record Payment: {invoice.code}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Customer: <strong style={{ color: '#0F172A' }}>{invoice.customerName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Outstanding Balance Banner */}
          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.875rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#92400E' }}>Current Outstanding Balance:</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#B45309' }}>₹{invoice.outstandingAmount.toLocaleString()}</span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              required
              max={invoice.outstandingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '1rem', fontWeight: 700, color: '#059669' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Payment Method *
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash Deposit</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Ref / Transaction No.
              </label>
              <input
                type="text"
                placeholder="e.g. UTR / UPI Ref ID"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          {successNotice && (
            <div style={{ background: '#D1FAE5', border: '1px solid #34D399', padding: '0.875rem', borderRadius: '6px', fontSize: '0.875rem', color: '#065F46', fontWeight: 600 }}>
              ✓ <strong>Payment Logged & Outstanding Reduced:</strong> Recorded ₹{amount.toLocaleString()} payment for {invoice.code}.
            </div>
          )}

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
              disabled={successNotice}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#10B981', color: 'white', cursor: 'pointer', fontWeight: 700, opacity: successNotice ? 0.6 : 1 }}
            >
              Submit & Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
