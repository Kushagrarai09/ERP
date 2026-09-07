import React, { useState } from 'react';
import { Quotation, QuotationStatus, SalesItem } from '../../../types/sales';
import { useSales } from '../salesContext';
import { MOCK_COMPANIES } from '../../../mock-data/crm';

interface QuotationFormModalProps {
  quotation?: Quotation | null;
  onClose: () => void;
}

export const QuotationFormModal: React.FC<QuotationFormModalProps> = ({ quotation, onClose }) => {
  const { addQuotation, updateQuotation } = useSales();

  const [customerName, setCustomerName] = useState(quotation?.customerName || MOCK_COMPANIES[0].name);
  const [status, setStatus] = useState<QuotationStatus>(quotation?.status || 'draft');
  const [owner, setOwner] = useState(quotation?.owner || 'Amit Sharma');
  const [notes, setNotes] = useState(quotation?.notes || '');
  const [items, setItems] = useState<SalesItem[]>(
    quotation?.items || [
      { id: '1', productName: 'ERP Software Suite', quantity: 5, unitPrice: 50000, total: 250000 },
    ]
  );

  const handleItemChange = (index: number, field: keyof SalesItem, val: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      item.total = Number(item.quantity) * Number(item.unitPrice);
    }
    newItems[index] = item;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, productName: 'Service Module', quantity: 1, unitPrice: 25000, total: 25000 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedComp = MOCK_COMPANIES.find((c) => c.name.toLowerCase() === customerName.toLowerCase());

    if (quotation) {
      updateQuotation(quotation.id, {
        customerName,
        companyId: matchedComp?.id || quotation.companyId,
        status,
        owner,
        items,
        subtotal,
        tax,
        total,
        notes,
      });
    } else {
      addQuotation({
        customerName,
        companyId: matchedComp?.id,
        status,
        owner,
        items,
        subtotal,
        tax,
        total,
        currency: '₹',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
          maxWidth: '640px',
          width: '92%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {quotation ? `Edit Quotation (${quotation.code})` : 'Create New Quotation'}
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuotationStatus)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Line Items Section */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Products & Line Items</h4>
              <button
                type="button"
                onClick={handleAddItem}
                style={{ padding: '0.25rem 0.5rem', background: '#DBEAFE', color: '#1D4ED8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
              >
                + Add Item
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Product description"
                  value={item.productName}
                  onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                  style={{ padding: '0.375rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                  style={{ padding: '0.375rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                  style={{ padding: '0.375rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>₹{item.total.toLocaleString()}</span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 700 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div style={{ background: '#FFFBEB', padding: '0.875rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
              <span>GST Tax (18%):</span>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#059669', paddingTop: '0.375rem', borderTop: '1px solid #FDE68A' }}>
              <span>Grand Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
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
              {quotation ? 'Save Changes' : 'Create Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
