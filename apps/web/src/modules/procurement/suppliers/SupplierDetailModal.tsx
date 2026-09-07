import React, { useState } from 'react';
import { Supplier } from '../../../types/procurement';
import { useProcurement } from '../procurementContext';

interface SupplierDetailModalProps {
  supplier: Supplier;
  onClose: () => void;
  onEdit: () => void;
}

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({ supplier, onClose, onEdit }) => {
  const { purchaseOrders, goodsReceipts } = useProcurement();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'receipts'>('overview');

  const relatedPOs = purchaseOrders.filter((po) => po.supplierId === supplier.id || po.supplierName.toLowerCase() === supplier.name.toLowerCase());
  const relatedGRs = goodsReceipts.filter((gr) => gr.supplierName.toLowerCase() === supplier.name.toLowerCase());

  const totalSpent = relatedPOs.reduce((sum, po) => sum + po.total, 0);

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
          maxWidth: '620px',
          width: '92%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#0F172A' }}>
                🤝 {supplier.name}
              </h2>
              <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>
                {supplier.status}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Category: {supplier.category} • Representative: {supplier.contactPerson}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* 3 Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', marginBottom: '1.25rem', gap: '0.75rem' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'orders', label: `Purchase Orders (${relatedPOs.length})` },
            { id: 'receipts', label: `Goods Receipts (${relatedGRs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.625rem 0.5rem',
                border: 'none',
                background: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#3B82F6' : '#64748B',
                borderBottom: activeTab === tab.id ? '2px solid #3B82F6' : '2px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Email Address</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{supplier.email}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Phone Number</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{supplier.phone}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Purchase Orders</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{relatedPOs.length} orders</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Lifetime Purchase Value</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>₹{(totalSpent / 100000).toFixed(2)} Lakhs</span>
            </div>
          </div>
        )}

        {/* Tab 2: Purchase Orders */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedPOs.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No purchase orders for this supplier yet.</p>
            ) : (
              relatedPOs.map((po) => (
                <div key={po.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2563EB' }}>{po.code}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Status: {po.status} • Date: {new Date(po.poDate).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#059669' }}>₹{po.total.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Goods Receipts */}
        {activeTab === 'receipts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedGRs.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No goods receipts logged for this vendor.</p>
            ) : (
              relatedGRs.map((gr) => (
                <div key={gr.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', background: '#ECFDF5' }}>
                  <div style={{ fontWeight: 600, color: '#065F46' }}>📦 {gr.code} (Ref {gr.poCode})</div>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>Received at {gr.warehouseName} • By {gr.receivedBy}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={() => {
              onClose();
              onEdit();
            }}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
          >
            Edit Supplier
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
