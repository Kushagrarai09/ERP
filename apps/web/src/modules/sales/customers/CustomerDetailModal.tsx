import React, { useState } from 'react';
import { Company } from '../../../types/crm';
import { useCRM } from '../../crm/crmContext';
import { useSales } from '../salesContext';

interface CustomerDetailModalProps {
  company: Company;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ company, onClose }) => {
  const { contacts, deals } = useCRM();
  const { quotations, orders } = useSales();
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'deals' | 'quotations' | 'orders'>('overview');

  const relatedContacts = contacts.filter((c) => c.company.toLowerCase() === company.name.toLowerCase());
  const relatedDeals = deals.filter((d) => d.company.toLowerCase() === company.name.toLowerCase());
  const relatedQuotations = quotations.filter((q) => q.customerName.toLowerCase() === company.name.toLowerCase());
  const relatedOrders = orders.filter((o) => o.customerName.toLowerCase() === company.name.toLowerCase());

  const totalSpent = relatedOrders.reduce((sum, o) => sum + o.total, 0);

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
          maxWidth: '680px',
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
                🛍️ {company.name}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: '#D1FAE5',
                  color: '#065F46',
                }}
              >
                Active Customer
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Reused CRM Company Record • Industry: {company.industry} • Owner: {company.owner}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #E2E8F0',
            marginBottom: '1.25rem',
            gap: '0.75rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'contacts', label: `Contacts (${relatedContacts.length})` },
            { id: 'deals', label: `Deals (${relatedDeals.length})` },
            { id: 'quotations', label: `Quotations (${relatedQuotations.length})` },
            { id: 'orders', label: `Orders (${relatedOrders.length})` },
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Corporate Email</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.email}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Phone</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.phone}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Employees</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.employees}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Revenue / Spent</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>₹{(totalSpent / 100000).toFixed(2)} Lakhs</span>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedContacts.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No contacts found.</p>
            ) : (
              relatedContacts.map((cnt) => (
                <div key={cnt.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{cnt.firstName} {cnt.lastName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{cnt.title} • {cnt.email}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'deals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedDeals.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No CRM deals found.</p>
            ) : (
              relatedDeals.map((d) => (
                <div key={d.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{d.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', textTransform: 'capitalize' }}>Stage: {d.stage}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#059669' }}>₹{d.value.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'quotations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedQuotations.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No quotations linked.</p>
            ) : (
              relatedQuotations.map((q) => (
                <div key={q.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2563EB' }}>{q.code}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Status: {q.status}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>₹{q.total.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {relatedOrders.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No sales orders created yet.</p>
            ) : (
              relatedOrders.map((o) => (
                <div key={o.id} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2563EB' }}>{o.code}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Status: {o.status}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#059669' }}>₹{o.total.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              background: '#F1F5F9',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#475569',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
