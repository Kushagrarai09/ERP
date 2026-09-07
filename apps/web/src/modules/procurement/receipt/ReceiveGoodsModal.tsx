import React, { useState } from 'react';
import { PurchaseOrder, GoodsReceiptItem } from '../../../types/procurement';
import { useProcurement } from '../procurementContext';
import { InventoryProvider, useInventory } from '../../inventory/inventoryContext';

interface ReceiveGoodsModalProps {
  po: PurchaseOrder;
  onClose: () => void;
}

const ReceiveGoodsForm: React.FC<ReceiveGoodsModalProps> = ({ po, onClose }) => {
  const { receiveGoods } = useProcurement();
  const { warehouses, recordMovement } = useInventory();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || 'wh-1');
  const [receivedItems, setReceivedItems] = useState<GoodsReceiptItem[]>(
    po.items.map((it) => ({
      productName: it.productName,
      orderedQty: it.quantity,
      receivedQty: it.quantity,
    }))
  );
  const [successNotice, setSuccessNotice] = useState(false);

  const handleQtyChange = (index: number, val: number) => {
    const newItems = [...receivedItems];
    newItems[index].receivedQty = Math.max(0, val);
    setReceivedItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWh = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

    receiveGoods(po, targetWh.id, targetWh.name, receivedItems, recordMovement);
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
          maxWidth: '580px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              Receive Goods: {po.code}
            </h2>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Target Warehouse Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Select Receiving Warehouse Hub *
            </label>
            <select
              value={selectedWarehouseId}
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            >
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>{wh.name} ({wh.location.split(',')[0]})</option>
              ))}
            </select>
          </div>

          {/* Line Items Receiving Table */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Product Item</th>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Ordered Qty</th>
                  <th style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>Received Qty (+IN)</th>
                </tr>
              </thead>
              <tbody>
                {receivedItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>{item.productName}</td>
                    <td style={{ padding: '0.625rem 0.875rem', color: '#64748B' }}>{item.orderedQty}</td>
                    <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>
                      <input
                        type="number"
                        min="0"
                        value={item.receivedQty}
                        onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
                        style={{ width: '80px', padding: '0.375rem', borderRadius: '4px', border: '1px solid #CBD5E1', textAlign: 'right', fontWeight: 700, color: '#059669' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {successNotice && (
            <div style={{ background: '#D1FAE5', border: '1px solid #34D399', padding: '0.875rem', borderRadius: '6px', fontSize: '0.875rem', color: '#065F46', fontWeight: 600 }}>
              ✓ <strong>Goods Receipt Created & Inventory Stock Increased (+IN):</strong> Added items to {warehouses.find(w => w.id === selectedWarehouseId)?.name}.
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
              Confirm Goods Receipt & Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ReceiveGoodsModal: React.FC<ReceiveGoodsModalProps> = (props) => (
  <InventoryProvider>
    <ReceiveGoodsForm {...props} />
  </InventoryProvider>
);
