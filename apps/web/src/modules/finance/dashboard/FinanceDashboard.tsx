import React from 'react';
import { useFinance } from '../financeContext';
import '../../../styles/dashboard.css';

export const FinanceDashboard: React.FC = () => {
  const { invoices, payments, expenses } = useFinance();

  // Metric Calculations
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCollected = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const outstandingReceivables = invoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);
  const totalExpensesSum = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Status Breakdowns
  const invoiceStatusSummary = [
    { label: 'Draft', count: invoices.filter((i) => i.status === 'draft').length, color: '#64748B' },
    { label: 'Sent', count: invoices.filter((i) => i.status === 'sent').length, color: '#3B82F6' },
    { label: 'Paid', count: invoices.filter((i) => i.status === 'paid').length, color: '#10B981' },
    { label: 'Overdue', count: invoices.filter((i) => i.status === 'overdue').length, color: '#EF4444' },
  ];

  const paymentMethodSummary = [
    { label: 'Bank Transfer', count: payments.filter((p) => p.method === 'Bank Transfer').length, color: '#3B82F6' },
    { label: 'UPI', count: payments.filter((p) => p.method === 'UPI').length, color: '#10B981' },
    { label: 'Card', count: payments.filter((p) => p.method === 'Card').length, color: '#8B5CF6' },
    { label: 'Cash', count: payments.filter((p) => p.method === 'Cash').length, color: '#F59E0B' },
  ];

  return (
    <div className="dashboard-page" style={{ padding: '1.5rem', background: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Finance Dashboard
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Real-time financial performance, accounts receivable, cash collections, and operating expenses.
        </p>
      </div>

      {/* 1. KPI Cards */}
      <div className="dashboard-kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="kpi-card kpi-green">
          <div className="kpi-header">
            <span className="kpi-title">Total Revenue</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalRevenue / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend positive">Billed Invoices</span>
          </div>
        </div>

        <div className="kpi-card kpi-red">
          <div className="kpi-header">
            <span className="kpi-title">Outstanding Receivables</span>
            <span className="kpi-icon">⏱️</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(outstandingReceivables / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend negative" style={{ color: outstandingReceivables > 0 ? '#DC2626' : '#059669' }}>
              Pending Collection
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-blue">
          <div className="kpi-header">
            <span className="kpi-title">Cash Collected</span>
            <span className="kpi-icon">💳</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalCollected / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend positive">Settled Payments</span>
          </div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-header">
            <span className="kpi-title">Operating Expenses</span>
            <span className="kpi-icon">📉</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalExpensesSum / 100000).toFixed(2)}L</h3>
            <span className="kpi-trend positive">Monthly Overhead</span>
          </div>
        </div>
      </div>

      {/* 2. Breakdowns Row */}
      <div className="dashboard-charts" style={{ marginTop: '1.5rem' }}>
        {/* Invoice Status Summary */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Invoice Status Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {invoiceStatusSummary.map((st) => (
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
                  {st.count} invoices
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods breakdown */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Collections by Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {paymentMethodSummary.map((pm) => (
              <div
                key={pm.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${pm.color}`,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                  {pm.label}
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                  {pm.count} payments
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Transactions Table Stream */}
      <div className="chart-wrapper" style={{ marginTop: '1.5rem' }}>
        <h2 className="chart-title" style={{ marginBottom: '1rem' }}>Recent Invoices & Collections</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Invoice Code</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ref Sales Order</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Amount</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Paid / Outstanding</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#2563EB' }}>
                    {inv.code}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {inv.customerName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {inv.salesOrderCode || 'Direct Invoice'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(inv.total / 100000).toFixed(2)}L
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                    ₹{(inv.paidAmount / 100000).toFixed(2)}L / <strong style={{ color: inv.outstandingAmount > 0 ? '#DC2626' : '#059669' }}>₹{(inv.outstandingAmount / 100000).toFixed(2)}L</strong>
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
                          inv.status === 'paid'
                            ? '#D1FAE5'
                            : inv.status === 'sent'
                            ? '#DBEAFE'
                            : inv.status === 'overdue'
                            ? '#FEE2E2'
                            : '#F1F5F9',
                        color:
                          inv.status === 'paid'
                            ? '#065F46'
                            : inv.status === 'sent'
                            ? '#1E40AF'
                            : inv.status === 'overdue'
                            ? '#991B1B'
                            : '#475569',
                      }}
                    >
                      {inv.status}
                    </span>
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
