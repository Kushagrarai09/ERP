import React from 'react';
import { Quotation } from '../../../types/sales';
import { useSales } from '../salesContext';

interface QuotationDetailModalProps {
  quotation: Quotation;
  onClose: () => void;
  onEdit: () => void;
  onConvertToOrder: () => void;
}

export const QuotationDetailModal: React.FC<QuotationDetailModalProps> = ({
  quotation,
  onClose,
  onEdit,
  onConvertToOrder,
}) => {
  const { updateQuotationStatus } = useSales();

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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                Quotation {quotation.code}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  background:
                    quotation.status === 'accepted'
                      ? '#D1FAE5'
                      : quotation.status === 'sent'
                      ? '#DBEAFE'
                      : quotation.status === 'rejected'
                      ? '#FEE2E2'
                      : '#F1F5F9',
                  color:
                    quotation.status === 'accepted'
                      ? '#065F46'
                      : quotation.status === 'sent'
                      ? '#1E40AF'
                      : quotation.status === 'rejected'
                      ? '#991B1B'
                      : '#475569',
                }}
              >
                {quotation.status}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Customer: <strong style={{ color: '#0F172A' }}>{quotation.customerName}</strong> • Owner: {quotation.owner}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Product Line Items */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.625rem 0.875rem' }}>Product / Service</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Qty</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Unit Price</th>
                <th style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>{item.productName}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>{item.quantity}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>₹{item.unitPrice.toLocaleString()}</td>
                  <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    ₹{item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal, Tax, Total */}
          <div style={{ background: '#F8FAFC', padding: '0.875rem 1rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748B' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{quotation.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748B' }}>
              <span>GST Tax (18%):</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{quotation.tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#059669', paddingTop: '0.25rem', borderTop: '1px solid #CBD5E1' }}>
              <span>Total Amount:</span>
              <span>₹{quotation.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {quotation.status === 'draft' && (
              <button
                onClick={() => updateQuotationStatus(quotation.id, 'sent')}
                style={{ padding: '0.5rem 0.875rem', borderRadius: '6px', border: '1px solid #3B82F6', background: '#EFF6FF', color: '#1D4ED8', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
              >
                ✉ Mark Sent
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onConvertToOrder();
              }}
              style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#10B981', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
            >
              ⚡ Convert to Order
            </button>
          </div>

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
