import React from 'react';
import { useProcurement } from '../procurementContext';
import '../../../styles/dashboard.css';

export const ProcurementDashboard: React.FC = () => {
  const { suppliers, purchaseOrders, goodsReceipts } = useProcurement();

  const totalSuppliers = suppliers.length;
  const openPOList = purchaseOrders.filter((po) => po.status !== 'received');
  const pendingReceipts = purchaseOrders.filter((po) => po.status === 'approved');
  const totalPurchaseValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0);

  return (
    <div className="dashboard-page" style={{ padding: '1.5rem', background: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Procurement Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Vendor management, inbound purchase orders, expected stock receipts, and procurement spend.
        </p>
      </div>

      {/* 1. KPI Cards */}
      <div className="dashboard-kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi-card kpi-blue">
          <div className="kpi-header">
            <span className="kpi-title">Total Suppliers</span>
            <span className="kpi-icon">🤝</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{totalSuppliers}</h3>
            <span className="kpi-trend positive">Active Vendors</span>
          </div>
        </div>

        <div className="kpi-card kpi-orange">
          <div className="kpi-header">
            <span className="kpi-title">Open POs</span>
            <span className="kpi-icon">📝</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{openPOList.length}</h3>
            <span className="kpi-trend positive">{openPOList.length} Active</span>
          </div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-header">
            <span className="kpi-title">Pending Receipts</span>
            <span className="kpi-icon">📬</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{pendingReceipts.length}</h3>
            <span className="kpi-trend positive" style={{ color: pendingReceipts.length > 0 ? '#3730A3' : '#059669' }}>
              {pendingReceipts.length > 0 ? 'Awaiting Delivery' : 'All Clear'}
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-green">
          <div className="kpi-header">
            <span className="kpi-title">Purchase Value</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalPurchaseValue / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend positive">Incl. 18% GST</span>
          </div>
        </div>
      </div>

      {/* 2. Tables & Streams Row */}
      <div className="dashboard-charts" style={{ marginTop: '1.5rem' }}>
        {/* Recent Purchase Orders */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Recent Purchase Orders</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <th style={{ padding: '0.625rem 0.875rem' }}>PO Code</th>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Supplier</th>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Total</th>
                  <th style={{ padding: '0.625rem 0.875rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.slice(0, 5).map((po) => (
                  <tr key={po.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.625rem 0.875rem', fontWeight: 700, color: '#2563EB' }}>
                      {po.code}
                    </td>
                    <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, color: '#0F172A' }}>
                      {po.supplierName}
                    </td>
                    <td style={{ padding: '0.625rem 0.875rem', fontWeight: 700, color: '#059669' }}>
                      ₹{(po.total / 100000).toFixed(2)}L
                    </td>
                    <td style={{ padding: '0.625rem 0.875rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Goods Receipts Stream */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Recent Goods Receipts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {goodsReceipts.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No goods receipts logged yet.</p>
            ) : (
              goodsReceipts.map((gr) => (
                <div
                  key={gr.id}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#ECFDF5',
                    borderLeft: '4px solid #10B981',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#065F46' }}>
                      📦 {gr.code} (Ref {gr.poCode})
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#047857' }}>
                      Received at {gr.warehouseName} • Supplier: {gr.supplierName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065F46' }}>
                    {new Date(gr.receivedDate).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
