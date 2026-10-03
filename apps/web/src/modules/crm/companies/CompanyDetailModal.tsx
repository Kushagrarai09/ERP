import React, { useState } from 'react';
import { Company } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface CompanyDetailModalProps {
  company: Company;
  onClose: () => void;
  onEdit: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  onClose,
  onEdit,
}) => {
  const { contacts, deals } = useCRM();
  const [activeTab, setActiveTab] = useState<'info' | 'contacts' | 'deals'>('info');

  // Related contacts
  const relatedContacts = contacts.filter(
    (c) => c.companyId === company.id || c.company.toLowerCase() === company.name.toLowerCase()
  );

  // Related deals
  const relatedDeals = deals.filter(
    (d) => d.companyId === company.id || d.company.toLowerCase() === company.name.toLowerCase()
  );

  const totalDealValue = relatedDeals.reduce((sum, d) => sum + d.value, 0);

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
                🏢 {company.name}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: '#DBEAFE',
                  color: '#1E40AF',
                }}
              >
                {company.industry}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Account 360° View • Account Owner: {company.owner}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* 360 View Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #E2E8F0',
            marginBottom: '1.25rem',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: '0.625rem 0.5rem',
              border: 'none',
              background: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: activeTab === 'info' ? '#3B82F6' : '#64748B',
              borderBottom: activeTab === 'info' ? '2px solid #3B82F6' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              padding: '0.625rem 0.5rem',
              border: 'none',
              background: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: activeTab === 'contacts' ? '#3B82F6' : '#64748B',
              borderBottom: activeTab === 'contacts' ? '2px solid #3B82F6' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Contacts ({relatedContacts.length})
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            style={{
              padding: '0.625rem 0.5rem',
              border: 'none',
              background: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: activeTab === 'deals' ? '#3B82F6' : '#64748B',
              borderBottom: activeTab === 'deals' ? '2px solid #3B82F6' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Deals ({relatedDeals.length})
          </button>
        </div>

        {/* Tab 1: Information */}
        {activeTab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Industry</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.industry}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Employees</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.employees} staff</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Est. Annual Revenue</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.revenue || 'N/A'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Account Value</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                ₹{(totalDealValue / 100000).toFixed(2)} Lakhs
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Email</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.email}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Phone</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{company.phone}</span>
            </div>
            {company.website && (
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Website</span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', textDecoration: 'underline' }}
                >
                  {company.website}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contacts */}
        {activeTab === 'contacts' && (
          <div>
            {relatedContacts.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No contacts associated with this company yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {relatedContacts.map((cnt) => (
                  <div
                    key={cnt.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                        {cnt.firstName} {cnt.lastName}
                      </h4>
                      <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                        {cnt.title} • {cnt.email}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                      {cnt.phone}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Deals */}
        {activeTab === 'deals' && (
          <div>
            {relatedDeals.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>No active deals recorded for this account.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {relatedDeals.map((deal) => (
                  <div
                    key={deal.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                        {deal.name}
                      </h4>
                      <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                        Stage: <strong style={{ textTransform: 'capitalize', color: '#2563EB' }}>{deal.stage}</strong> • Owner: {deal.owner}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                      ₹{deal.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
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
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#334155',
            }}
          >
            Edit Company
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#F1F5F9',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
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
