import React, { useState } from 'react';
import { SalesOrder } from '../../../types/sales';
import { useInventory } from '../../inventory/inventoryContext';

interface InventoryCheckModalProps {
  order: SalesOrder;
  onClose: () => void;
  onFulfilled: () => void;
}

export const InventoryCheckModal: React.FC<InventoryCheckModalProps> = ({
  order,
  onClose,
  onFulfilled,
}) => {
  const { checkStockAvailability, reserveAndFulfillOrder, warehouses } = useInventory();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0].id);
  const [fulfilledNotice, setFulfilledNotice] = useState(false);

  const availability = checkStockAvailability(order.items);
  const allItemsAvailable = availability.every((item) => item.isAvailable);

  const handleReserveAndFulfill = () => {
    reserveAndFulfillOrder(order.code, order.items, selectedWarehouseId);
    setFulfilledNotice(true);
    setTimeout(() => {
      onFulfilled();
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                Inventory Check: {order.code}
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Customer: <strong style={{ color: '#0F172A' }}>{order.customerName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Fulfillment Hub Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
            Select Dispatch Warehouse Hub
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

        {/* Stock Matrix Availability Table */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.625rem 0.875rem' }}>Ordered Item</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Required Qty</th>
                <th style={{ padding: '0.625rem 0.875rem' }}>Available Stock</th>
                <th style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>Availability Status</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((chk, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>{chk.productName}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155', fontWeight: 600 }}>{chk.requiredQty}</td>
                  <td style={{ padding: '0.625rem 0.875rem', color: '#334155' }}>{chk.availableQty} units</td>
                  <td style={{ padding: '0.625rem 0.875rem', textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: chk.isAvailable ? '#D1FAE5' : '#FEE2E2',
                        color: chk.isAvailable ? '#065F46' : '#991B1B',
                      }}
                    >
                      {chk.isAvailable ? '✓ Available' : '⚠️ Insufficient'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fulfilledNotice && (
          <div style={{ background: '#D1FAE5', border: '1px solid #34D399', padding: '0.875rem', borderRadius: '6px', fontSize: '0.875rem', color: '#065F46', marginBottom: '1rem', fontWeight: 600 }}>
            ✓ <strong>Stock Reserved & Movement Logged:</strong> Inventory decremented and Stock Movement (`-OUT`) recorded in Inventory audit log.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={handleReserveAndFulfill}
            disabled={fulfilledNotice}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              background: allItemsAvailable ? '#10B981' : '#F59E0B',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.875rem',
              opacity: fulfilledNotice ? 0.6 : 1,
            }}
          >
            {allItemsAvailable ? '⚡ Reserve Stock & Dispatch' : '⚠️ Override & Fulfill Stock'}
          </button>

          <button
            onClick={onClose}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#F1F5F9', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
