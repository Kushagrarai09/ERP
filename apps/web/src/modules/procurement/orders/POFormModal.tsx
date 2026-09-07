import React, { useState } from 'react';
import { PurchaseOrder, POStatus, POItem } from '../../../types/procurement';
import { useProcurement } from '../procurementContext';
import { MOCK_SUPPLIERS } from '../../../mock-data/procurement';

interface POFormModalProps {
  po?: PurchaseOrder | null;
  onClose: () => void;
}

export const POFormModal: React.FC<POFormModalProps> = ({ po, onClose }) => {
  const { addPO, updatePO } = useProcurement();

  const [supplierName, setSupplierName] = useState(po?.supplierName || MOCK_SUPPLIERS[0].name);
  const [status, setStatus] = useState<POStatus>(po?.status || 'draft');
  const [owner, setOwner] = useState(po?.owner || 'Rajesh Kumar');
  const [notes, setNotes] = useState(po?.notes || '');
  const [items, setItems] = useState<POItem[]>(
    po?.items || [
      { id: '1', productId: 'prod-1', productName: 'Laptop Pro 15"', quantity: 20, unitCost: 65000, total: 1300000 },
      { id: '2', productId: 'prod-2', productName: '4K Monitor 27"', quantity: 20, unitCost: 12000, total: 240000 },
    ]
  );

  const handleItemChange = (index: number, field: keyof POItem, val: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: val };
    if (field === 'quantity' || field === 'unitCost') {
      item.total = Number(item.quantity) * Number(item.unitCost);
    }
    newItems[index] = item;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, productId: 'prod-3', productName: 'Mechanical Keyboard RGB', quantity: 10, unitCost: 2800, total: 28000 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSup = MOCK_SUPPLIERS.find((s) => s.name.toLowerCase() === supplierName.toLowerCase());

    if (po) {
      updatePO(po.id, {
        supplierName,
        supplierId: matchedSup?.id || po.supplierId,
        status,
        owner,
        items,
        subtotal,
        tax,
        total,
        notes,
      });
    } else {
      addPO({
        supplierName,
        supplierId: matchedSup?.id || 'sup-1',
        status,
        owner,
        items,
        subtotal,
        tax,
        total,
        currency: '₹',
        expectedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
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
            {po ? `Edit Purchase Order (${po.code})` : 'Create Purchase Order'}
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
                Supplier Vendor *
              </label>
              <select
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                {MOCK_SUPPLIERS.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Lifecycle Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as POStatus)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="approved">Approved</option>
                <option value="received">Received</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Purchasing Items</h4>
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
                  placeholder="Product name"
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
                  placeholder="Cost (₹)"
                  value={item.unitCost}
                  onChange={(e) => handleItemChange(idx, 'unitCost', Number(e.target.value))}
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

          {/* Totals */}
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
              <span>Total Purchase Value:</span>
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
              {po ? 'Save Order' : 'Create PO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
