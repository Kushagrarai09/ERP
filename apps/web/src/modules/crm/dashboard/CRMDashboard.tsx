import React from 'react';
import { useCRM } from '../crmContext';
import '../../../styles/dashboard.css';

export const CRMDashboard: React.FC = () => {
  const { leads, deals, activities } = useCRM();

  // Calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
  const convertedLeads = leads.filter((l) => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);

  const wonDeals = deals.filter((d) => d.stage === 'won');
  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  // Sales Funnel Counts
  const funnelStages = [
    { name: 'New Leads', count: leads.filter((l) => l.status === 'new').length, color: '#3B82F6' },
    { name: 'Contacted', count: leads.filter((l) => l.status === 'contacted').length, color: '#6366F1' },
    { name: 'Qualified', count: qualifiedLeads, color: '#8B5CF6' },
    { name: 'Converted / Deals', count: convertedLeads, color: '#10B981' },
  ];

  // Deal Stage Breakdown
  const dealStages = [
    { stage: 'New', count: deals.filter((d) => d.stage === 'new').length, value: deals.filter((d) => d.stage === 'new').reduce((s, d) => s + d.value, 0) },
    { stage: 'Qualification', count: deals.filter((d) => d.stage === 'qualification').length, value: deals.filter((d) => d.stage === 'qualification').reduce((s, d) => s + d.value, 0) },
    { stage: 'Proposal', count: deals.filter((d) => d.stage === 'proposal').length, value: deals.filter((d) => d.stage === 'proposal').reduce((s, d) => s + d.value, 0) },
    { stage: 'Negotiation', count: deals.filter((d) => d.stage === 'negotiation').length, value: deals.filter((d) => d.stage === 'negotiation').reduce((s, d) => s + d.value, 0) },
    { stage: 'Won', count: wonDeals.length, value: totalWonRevenue },
    { stage: 'Lost', count: deals.filter((d) => d.stage === 'lost').length, value: deals.filter((d) => d.stage === 'lost').reduce((s, d) => s + d.value, 0) },
  ];

  return (
    <div className="dashboard-page" style={{ padding: '1.5rem', background: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            CRM Dashboard
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Real-time pipeline analytics, lead conversion metrics, and recent activities.
          </p>
        </div>
      </div>

      {/* 1. KPI Cards */}
      <div className="dashboard-kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="kpi-card kpi-blue">
          <div className="kpi-header">
            <span className="kpi-title">Total Leads</span>
            <span className="kpi-icon">🎯</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{totalLeads}</h3>
            <span className="kpi-trend positive">+12%</span>
          </div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-header">
            <span className="kpi-title">Qualified Leads</span>
            <span className="kpi-icon">⭐</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{qualifiedLeads}</h3>
            <span className="kpi-trend positive">+8%</span>
          </div>
        </div>

        <div className="kpi-card kpi-orange">
          <div className="kpi-header">
            <span className="kpi-title">Open Deals</span>
            <span className="kpi-icon">💼</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{openDeals.length}</h3>
            <span className="kpi-trend positive">{openDeals.length} Active</span>
          </div>
        </div>

        <div className="kpi-card kpi-green">
          <div className="kpi-header">
            <span className="kpi-title">Pipeline Value</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(pipelineValue / 100000).toFixed(1)}L</h3>
            <span className="kpi-trend positive">Active</span>
          </div>
        </div>

        <div className="kpi-card kpi-green" style={{ borderLeftColor: '#059669' }}>
          <div className="kpi-header">
            <span className="kpi-title">Won Revenue</span>
            <span className="kpi-icon">🏆</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">₹{(totalWonRevenue / 100000).toFixed(1)}L</h3>
            <span className="kpi-trend positive">{wonDeals.length} Won</span>
          </div>
        </div>

        <div className="kpi-card kpi-blue" style={{ borderLeftColor: '#2563EB' }}>
          <div className="kpi-header">
            <span className="kpi-title">Lead Conversion</span>
            <span className="kpi-icon">📈</span>
          </div>
          <div className="kpi-content">
            <h3 className="kpi-value">{conversionRate}%</h3>
            <span className="kpi-trend positive">{convertedLeads} Converted</span>
          </div>
        </div>
      </div>

      {/* 2. Charts & Funnels Section */}
      <div className="dashboard-charts" style={{ marginTop: '1.5rem' }}>
        {/* Sales Funnel */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Lead Conversion Funnel</h2>
          <div className="funnel-container" style={{ gap: '0.875rem' }}>
            {funnelStages.map((stg) => {
              const pct = totalLeads > 0 ? Math.round((stg.count / totalLeads) * 100) : 0;
              return (
                <div key={stg.name} className="funnel-stage">
                  <div
                    className="funnel-bar"
                    style={{
                      background: stg.color,
                      width: `${Math.max(pct, 25)}%`,
                      transition: 'width 0.3s ease',
                    }}
                  >
                    <div className="funnel-content">
                      <span className="funnel-name">{stg.name}</span>
                      <span className="funnel-count">{stg.count} leads</span>
                    </div>
                  </div>
                  <span className="funnel-percentage">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deal Pipeline Stage Breakdown */}
        <div className="chart-wrapper">
          <h2 className="chart-title">Deal Pipeline by Stage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dealStages.map((stg) => (
              <div
                key={stg.stage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'space-between',
                  padding: '0.625rem 0.875rem',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                    {stg.stage}
                  </span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#64748B' }}>
                    ({stg.count} deals)
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                  ₹{(stg.value / 100000).toFixed(2)}L
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Activities */}
      <div className="chart-wrapper" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="chart-title" style={{ margin: 0 }}>Recent Activities & Tasks</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{activities.length} total tasks</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activities.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No recent activities.</p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify-content: 'space-between',
                  padding: '0.75rem 1rem',
                  background: act.completed ? '#F8FAFC' : '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  opacity: act.completed ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      background: act.type === 'call' ? '#DBEAFE' : act.type === 'meeting' ? '#E0E7FF' : '#FEF3C7',
                      color: act.type === 'call' ? '#1D4ED8' : act.type === 'meeting' ? '#4338CA' : '#D97706',
                    }}
                  >
                    {act.type}
                  </span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                      {act.subject}
                    </h4>
                    <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                      {act.description} • Owner: {act.owner}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                  {new Date(act.date).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
