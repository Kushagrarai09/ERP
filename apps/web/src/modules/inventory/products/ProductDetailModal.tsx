import React, { useState } from 'react';
import { Product } from '../../../types/inventory';
import { useInventory } from '../inventoryContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onEdit }) => {
  const { stocks, movements } = useInventory();
  const [activeTab, setActiveTab] = useState<'overview' | 'warehouses' | 'sales' | 'history'>('overview');

  const productStocks = stocks.filter((s) => s.productId === product.id || s.productName.toLowerCase() === product.name.toLowerCase());
  const productMovements = movements.filter((m) => m.productId === product.id || m.productName.toLowerCase() === product.name.toLowerCase());
  const salesHistory = productMovements.filter((m) => m.type === 'Sale');

  const margin = product.sellingPrice > 0 ? (((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1) : '0';

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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#0F172A' }}>
                📦 {product.name}
              </h2>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: '#DBEAFE', color: '#1E40AF' }}>
                SKU: {product.sku}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Category: {product.category} • Unit: {product.unit}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* 4 Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', marginBottom: '1.25rem', gap: '0.75rem' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'warehouses', label: `Stock by Warehouse (${productStocks.length})` },
            { id: 'sales', label: `Recent Sales (${salesHistory.length})` },
            { id: 'history', label: `Movement History (${productMovements.length})` },
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
                whiteSpace: 'nowrap',
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
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Selling Price</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>₹{product.sellingPrice.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Cost Price</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>₹{product.costPrice.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Profit Margin</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563EB' }}>{margin}%</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Stock</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: product.stock <= product.reorderLevel ? '#DC2626' : '#0F172A' }}>
                {product.stock} {product.unit} {product.stock <= product.reorderLevel ? '⚠️ Low' : ''}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Reorder Level Threshold</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{product.reorderLevel} {product.unit}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Status</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669', textTransform: 'capitalize' }}>{product.status}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Stock by Warehouse */}
        {activeTab === 'warehouses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {productStocks.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Primary stock in Mumbai Central Hub ({product.stock} {product.unit}).</p>
            ) : (
              productStocks.map((ws) => (
                <div key={ws.id} style={{ padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{ws.warehouseName}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Reserved: {ws.reserved} | Total: {ws.total}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#059669' }}>
                    Available: {ws.available} {product.unit}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Recent Sales */}
        {activeTab === 'sales' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {salesHistory.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No recent sales movements recorded.</p>
            ) : (
              salesHistory.map((m) => (
                <div key={m.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>Ref Order: {m.referenceCode}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(m.date).toLocaleDateString()} • {m.warehouseName}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#DC2626' }}>{m.quantity} {product.unit}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Stock History */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {productMovements.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No stock movements recorded.</p>
            ) : (
              productMovements.map((m) => (
                <div key={m.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{m.type} ({m.referenceCode || 'System'})</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>{new Date(m.date).toLocaleDateString()} • {m.notes}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: m.quantity > 0 ? '#059669' : '#DC2626' }}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </span>
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
            Edit Product
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
