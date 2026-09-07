import React from 'react';
import { PurchaseOrder, POStatus } from '../../../types/procurement';
import { useProcurement } from '../procurementContext';

interface PODetailModalProps {
  po: PurchaseOrder;
  onClose: () => void;
  onEdit: () => void;
  onReceiveGoods: () => void;
}

export const PODetailModal: React.FC<PODetailModalProps> = ({
  po,
  onClose,
  onEdit,
  onReceiveGoods,
}) => {
  const { updatePOStatus } = useProcurement();

  const statuses: { status: POStatus; label: string }[] = [
    { status: 'draft', label: 'Draft' },
    { status: 'sent', label: 'Sent' },
    { status: 'approved', label: 'Approved' },
    { status: 'received', label: 'Received' },
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
                Purchase Order {po.code}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  background:
                    po.status === 'received'
                      ? '#D1FAE5'
                      : po.status === 'approved'
                      ? '#E0E7FF'
                      : po.status === 'sent'
                      ? '#FEF3C7'
                      : '#F1F5F9',
                  color:
                    po.status === 'received'
                      ? '#065F46'
                      : po.status === 'approved'
                      ? '#3730A3'
                      : po.status === 'sent'
                      ? '#92400E'
                      : '#475569',
                }}
              >
                {po.status}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Supplier: <strong style={{ color: '#0F172A' }}>{po.supplierName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* PO Status Toggle Buttons */}
        <div style={{ margin: '1rem 0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
            Purchase Order Lifecycle:
          </span>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {statuses.map((st) => {
              const isActive = po.status === st.status;
              return (
                <button
                  key={st.status}
                  onClick={() => updatePOStatus(po.id, st.status)}
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

        {/* PO Items Table */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.625rem 0.875rem' }}>Product Item</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Qty</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Unit Cost</th>
                <th style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>{it.productName}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>{it.quantity}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>₹{it.unitCost.toLocaleString()}</td>
                  <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                    ₹{it.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ background: '#F8FAFC', padding: '0.875rem 1rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748B' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{po.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748B' }}>
              <span>GST 18%:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{po.tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#059669', paddingTop: '0.25rem', borderTop: '1px solid #CBD5E1' }}>
              <span>Total Amount:</span>
              <span>₹{po.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={() => {
              onClose();
              onReceiveGoods();
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
            📦 Receive Goods
          </button>

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
