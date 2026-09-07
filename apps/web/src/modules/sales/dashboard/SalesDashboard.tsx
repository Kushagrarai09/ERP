import React from 'react';
import { useSales } from '../salesContext';
import { MOCK_COMPANIES } from '../../../mock-data/crm';
import '../../../styles/dashboard.css';

export const SalesDashboard: React.FC = () => {
  const { quotations, orders } = useSales();

  // Metrics Calculations
  const customerCount = MOCK_COMPANIES.length;
  const quotationCount = quotations.length;
  const orderCount = orders.length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Status Breakdowns
  const quotationStatusSummary = [
    { label: 'Draft', count: quotations.filter((q) => q.status === 'draft').length, color: '#64748B' },
    { label: 'Sent', count: quotations.filter((q) => q.status === 'sent').length, color: '#3B82F6' },
    { label: 'Accepted', count: quotations.filter((q) => q.status === 'accepted').length, color: '#10B981' },
    { label: 'Rejected', count: quotations.filter((q) => q.status === 'rejected').length, color: '#EF4444' },
  ];

  const orderStatusSummary = [
    { label: 'Pending', count: orders.filter((o) => o.status === 'pending').length, color: '#F59E0B' },
    { label: 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length, color: '#3B82F6' },
    { label: 'Processing', count: orders.filter((o) => o.status === 'processing').length, color: '#8B5CF6' },
    { label: 'Completed', count: orders.filter((o) => o.status === 'completed').length, color: '#10B981' },
  ];

  return (
    <div className="dashboard-page" style={{ padding: '1.5rem', background: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Sales Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Overview of customer orders, active quotations, revenue, and order fulfillment statuses.
        </p>
      </div>

      {/* 1. KPI Cards */}
      <div className="dashboard-kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi-card kpi-orange">
          <div className="kpi-header">
            <span className="kpi-title">Customers</span>
            <span className="kpi-icon">🛍️</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{customerCount}</h3>
            <span className="kpi-trend positive">Active CRM Accounts</span>
          </div>
        </div>

        <div className="kpi-card kpi-blue">
          <div className="kpi-header">
            <span className="kpi-title">Quotations</span>
            <span className="kpi-icon">📋</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{quotationCount}</h3>
            <span className="kpi-trend positive">{quotations.filter((q) => q.status === 'accepted').length} Accepted</span>
          </div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-header">
            <span className="kpi-title">Sales Orders</span>
            <span className="kpi-icon">📦</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{orderCount}</h3>
            <span className="kpi-trend positive">{orders.filter((o) => o.status === 'confirmed').length} Active</span>
          </div>
        </div>

        <div className="kpi-card kpi-green">
          <div className="kpi-header">
            <span className="kpi-title">Sales Revenue</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalRevenue / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend positive">+15.4%</span>
          </div>
        </div>
      </div>

      {/* 2. Status Summaries Section */}
      <div className="dashboard-charts" style={{ marginTop: '1.5rem' }}>
        {/* Quotation Status Summary */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Quotation Status Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {quotationStatusSummary.map((st) => (
              <div
                key={st.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${st.color}`,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                  {st.label}
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                  {st.count} quotations
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Sales Order Fulfillment Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {orderStatusSummary.map((st) => (
              <div
                key={st.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${st.color}`,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                  {st.label}
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                  {st.count} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Summary Table */}
      <div className="chart-wrapper" style={{ marginTop: '1.5rem' }}>
        <h2 className="chart-title" style={{ marginBottom: '1rem' }}>Recent Sales Orders</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Order Code</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ref Quotation</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Amount</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#2563EB' }}>
                    {ord.code}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {ord.customerName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {ord.quotationCode || 'Direct Order'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(ord.total / 100000).toFixed(2)}L
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background:
                          ord.status === 'completed'
                            ? '#D1FAE5'
                            : ord.status === 'processing'
                            ? '#E0E7FF'
                            : ord.status === 'confirmed'
                            ? '#DBEAFE'
                            : '#FEF3C7',
                        color:
                          ord.status === 'completed'
                            ? '#065F46'
                            : ord.status === 'processing'
                            ? '#3730A3'
                            : ord.status === 'confirmed'
                            ? '#1D4ED8'
                            : '#92400E',
                      }}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(ord.orderDate).toLocaleDateString()}
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
