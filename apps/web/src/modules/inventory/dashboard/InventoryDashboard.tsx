import React from 'react';
import { useInventory } from '../inventoryContext';
import '../../../styles/dashboard.css';

export const InventoryDashboard: React.FC = () => {
  const { products, warehouses, movements } = useInventory();

  // Metrics Calculations
  const totalProducts = products.length;
  const lowStockItems = products.filter((p) => p.stock <= p.reorderLevel);

  const totalStockValuation = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const warehouseCount = warehouses.length;

  return (
    <div className="dashboard-page" style={{ padding: '1.5rem', background: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Inventory Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Real-time stock valuation, low-stock warnings, warehouse distribution, and movement logs.
        </p>
      </div>

      {/* 1. KPI Cards */}
      <div className="dashboard-kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi-card kpi-blue">
          <div className="kpi-header">
            <span className="kpi-title">Total Products</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{totalProducts}</h3>
            <span className="kpi-trend positive">Active SKUs</span>
          </div>
        </div>

        <div className="kpi-card kpi-green">
          <div className="kpi-header">
            <span className="kpi-title">Stock Valuation</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalStockValuation / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend positive">At Cost Price</span>
          </div>
        </div>

        <div className="kpi-card kpi-red">
          <div className="kpi-header">
            <span className="kpi-title">Low Stock Items</span>
            <span className="kpi-icon">⚠️</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{lowStockItems.length}</h3>
            <span className="kpi-trend negative" style={{ color: lowStockItems.length > 0 ? '#DC2626' : '#059669' }}>
              {lowStockItems.length > 0 ? 'Action Needed' : 'Healthy Levels'}
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-header">
            <span className="kpi-title">Warehouses</span>
            <span className="kpi-icon">🏭</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{warehouseCount}</h3>
            <span className="kpi-trend positive">Fulfillment Hubs</span>
          </div>
        </div>
      </div>

      {/* 2. Low Stock Alerts & Warehouse Breakdown */}
      <div className="dashboard-charts" style={{ marginTop: '1.5rem' }}>
        {/* Low Stock Alerts */}
        <div className="chart-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="chart-title" style={{ margin: 0, color: '#D97706' }}>⚠️ Low Stock Warnings</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706' }}>
              {lowStockItems.length} items below reorder level
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lowStockItems.length === 0 ? (
              <p style={{ color: '#059669', fontSize: '0.875rem' }}>✓ All stock levels are currently healthy!</p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#FFFBEB',
                    borderLeft: '4px solid #F59E0B',
                    borderRadius: '6px',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      SKU: {item.sku} • Reorder Threshold: {item.reorderLevel} {item.unit}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#DC2626' }}>
                    {item.stock} {item.unit} remaining
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Warehouses Summary */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Stock Valuation by Warehouse</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                    🏭 {wh.name}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>
                    Location: {wh.location.split(',')[0]}
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#059669' }}>
                  ₹{((totalStockValuation / warehouses.length) / 100000).toFixed(1)}L
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Stock Movements Stream */}
      <div className="chart-wrapper" style={{ marginTop: '1.5rem' }}>
        <h2 className="chart-title" style={{ marginBottom: '1rem' }}>Recent Stock Movements</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Product Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Warehouse</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Quantity</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, 5).map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(m.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {m.productName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                    {m.warehouseName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: m.quantity > 0 ? '#D1FAE5' : '#FEE2E2',
                        color: m.quantity > 0 ? '#065F46' : '#991B1B',
                      }}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: m.quantity > 0 ? '#059669' : '#DC2626' }}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#2563EB', fontWeight: 600 }}>
                    {m.referenceCode || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
