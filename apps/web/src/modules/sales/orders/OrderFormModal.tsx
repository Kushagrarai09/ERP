import React, { useState } from 'react';
import { SalesOrder, OrderStatus, SalesItem } from '../../../types/sales';
import { useSales } from '../salesContext';
import { MOCK_COMPANIES } from '../../../mock-data/crm';

interface OrderFormModalProps {
  order?: SalesOrder | null;
  onClose: () => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ order, onClose }) => {
  const { addOrder, updateOrder } = useSales();

  const [customerName, setCustomerName] = useState(order?.customerName || MOCK_COMPANIES[0].name);
  const [quotationCode, setQuotationCode] = useState(order?.quotationCode || '');
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'confirmed');
  const [owner, setOwner] = useState(order?.owner || 'Amit Sharma');
  const [notes, setNotes] = useState(order?.notes || '');
  const [items, setItems] = useState<SalesItem[]>(
    order?.items || [
      { id: '1', productName: 'ERP Suite Enterprise', quantity: 1, unitPrice: 700000, total: 700000 },
    ]
  );

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedComp = MOCK_COMPANIES.find((c) => c.name.toLowerCase() === customerName.toLowerCase());

    if (order) {
      updateOrder(order.id, {
        customerName,
        companyId: matchedComp?.id || order.companyId,
        quotationCode,
        status,
        owner,
        items,
        subtotal,
        tax,
        total,
        notes,
      });
    } else {
      addOrder({
        customerName,
        companyId: matchedComp?.id,
        quotationCode,
        status,
        owner,
        items,
        subtotal,
        tax,
        total,
        currency: '₹',
        expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes,
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
          maxWidth: '560px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {order ? `Edit Sales Order (${order.code})` : 'Create Sales Order'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Customer Account *
              </label>
              <select
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                {MOCK_COMPANIES.map((comp) => (
                  <option key={comp.id} value={comp.name}>{comp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Fulfillment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Ref Quotation Code
              </label>
              <input
                type="text"
                placeholder="e.g. QT-00124"
                value={quotationCode}
                onChange={(e) => setQuotationCode(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Sales Rep Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ background: '#FFFBEB', padding: '0.875rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Total Order Value:</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#059669' }}>₹{total.toLocaleString()}</span>
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
              {order ? 'Save Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
