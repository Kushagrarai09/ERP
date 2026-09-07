import React, { useState } from 'react';
import { SalesOrder, OrderStatus } from '../../../types/sales';
import { useSales } from '../salesContext';
import { InventoryCheckModal } from './InventoryCheckModal';
import { InventoryProvider } from '../../inventory/inventoryContext';

interface OrderDetailModalProps {
  order: SalesOrder;
  onClose: () => void;
  onEdit: () => void;
  onCreateInvoice?: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onEdit, onCreateInvoice }) => {
  const { updateOrderStatus } = useSales();
  const [isInventoryCheckOpen, setIsInventoryCheckOpen] = useState(false);
  const [deliveryNotice, setDeliveryNotice] = useState(false);
  const [invoiceNotice, setInvoiceNotice] = useState(false);

  const handleCreateInvoice = () => {
    setInvoiceNotice(true);
    if (onCreateInvoice) {
      onCreateInvoice();
    }
  };

  const statuses: { status: OrderStatus; label: string }[] = [
    { status: 'pending', label: 'Pending' },
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'processing', label: 'Processing' },
    { status: 'completed', label: 'Completed' },
  ];

  return (
    <InventoryProvider>
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
            maxWidth: '620px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                  Sales Order {order.code}
                </h2>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
                Customer: <strong style={{ color: '#0F172A' }}>{order.customerName}</strong>
                {order.quotationCode && <span> • Linked Quotation: <strong>{order.quotationCode}</strong></span>}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
            >
              ✕
            </button>
          </div>

          {/* Fulfillment Status Toggle Buttons */}
          <div style={{ margin: '1rem 0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
              Fulfillment Progression:
            </span>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {statuses.map((st) => {
                const isActive = order.status === st.status;
                return (
                  <button
                    key={st.status}
                    onClick={() => updateOrderStatus(order.id, st.status)}
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

          {/* Order Items Table */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Item</th>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Qty</th>
                  <th style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>{it.productName}</td>
                    <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>{it.quantity}</td>
                    <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                      ₹{it.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ background: '#F8FAFC', padding: '0.875rem 1rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#059669', fontSize: '1rem' }}>
              <span>Grand Total:</span>
              <span>₹{order.total.toLocaleString()}</span>
            </div>
          </div>

          {invoiceNotice && (
            <div style={{ background: '#ECFDF5', border: '1px solid #34D399', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', color: '#065F46', marginBottom: '1rem', fontWeight: 600 }}>
              📄 <strong>Sales Invoice Created:</strong> Generated billing invoice (Ref {order.code}) with 18% GST in Finance module.
            </div>
          )}

          {deliveryNotice && (
            <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', color: '#1E40AF', marginBottom: '1rem' }}>
              ℹ️ <strong>Delivery Created:</strong> Order dispatch slip generated.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsInventoryCheckOpen(true)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#10B981',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                📦 Check Stock
              </button>

              <button
                onClick={handleCreateInvoice}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#2563EB',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                📄 Create Invoice
              </button>

              <button
                onClick={() => setDeliveryNotice(true)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #8B5CF6',
                  background: '#F5F3FF',
                  color: '#6D28D9',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                🚚 Delivery
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

        {/* Inventory Check Modal Integration */}
        {isInventoryCheckOpen && (
          <InventoryCheckModal
            order={order}
            onClose={() => setIsInventoryCheckOpen(false)}
            onFulfilled={() => updateOrderStatus(order.id, 'processing')}
          />
        )}
      </div>
    </InventoryProvider>
  );
};
