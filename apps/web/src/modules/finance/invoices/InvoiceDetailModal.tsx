import React from 'react';
import { Invoice, InvoiceStatus } from '../../../types/finance';
import { useFinance } from '../financeContext';

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
  onEdit: () => void;
  onRecordPayment: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onEdit,
  onRecordPayment,
}) => {
  const { updateInvoiceStatus } = useFinance();

  const statuses: { status: InvoiceStatus; label: string }[] = [
    { status: 'draft', label: 'Draft' },
    { status: 'sent', label: 'Sent' },
    { status: 'paid', label: 'Paid' },
    { status: 'overdue', label: 'Overdue' },
  ];

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
                Invoice {invoice.code}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  background:
                    invoice.status === 'paid'
                      ? '#D1FAE5'
                      : invoice.status === 'sent'
                      ? '#DBEAFE'
                      : invoice.status === 'overdue'
                      ? '#FEE2E2'
                      : '#F1F5F9',
                  color:
                    invoice.status === 'paid'
                      ? '#065F46'
                      : invoice.status === 'sent'
                      ? '#1E40AF'
                      : invoice.status === 'overdue'
                      ? '#991B1B'
                      : '#475569',
                }}
              >
                {invoice.status}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Customer: <strong style={{ color: '#0F172A' }}>{invoice.customerName}</strong>
              {invoice.salesOrderCode && <span> • Linked Order: <strong>{invoice.salesOrderCode}</strong></span>}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Invoice Status Progression Buttons */}
        <div style={{ margin: '1rem 0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
            Lifecycle Status:
          </span>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {statuses.map((st) => {
              const isActive = invoice.status === st.status;
              return (
                <button
                  key={st.status}
                  onClick={() => updateInvoiceStatus(invoice.id, st.status)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isActive ? '#3B82F6' : '#F8FAFC',
                    color: isActive ? 'white' : '#475569',
                  }}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Invoice Items Table */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.625rem 0.875rem' }}>Description</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Qty</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Unit Price</th>
                <th style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>{it.description}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>{it.quantity}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>₹{it.unitPrice.toLocaleString()}</td>
                  <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    ₹{it.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal, Tax, Total, Paid, Outstanding Summary */}
          <div style={{ background: '#F8FAFC', padding: '0.875rem 1rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748B' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{invoice.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748B' }}>
              <span>GST 18%:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{invoice.tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#059669', paddingTop: '0.25rem', borderTop: '1px solid #CBD5E1' }}>
              <span>Total Amount:</span>
              <span>₹{invoice.total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#2563EB', paddingTop: '0.25rem' }}>
              <span>Paid Amount:</span>
              <span style={{ fontWeight: 700 }}>₹{invoice.paidAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: invoice.outstandingAmount > 0 ? '#DC2626' : '#059669', fontWeight: 700 }}>
              <span>Outstanding Balance:</span>
              <span>₹{invoice.outstandingAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          {invoice.outstandingAmount > 0 ? (
            <button
              onClick={() => {
                onClose();
                onRecordPayment();
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                background: '#10B981',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              💳 Record Payment
            </button>
          ) : (
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
              ✓ Invoice Settled
            </span>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              style={{ padding: '0.5rem 0.875rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Edit
            </button>
            <button
              onClick={onClose}
              style={{ padding: '0.5rem 0.875rem', borderRadius: '6px', border: 'none', background: '#F1F5F9', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
