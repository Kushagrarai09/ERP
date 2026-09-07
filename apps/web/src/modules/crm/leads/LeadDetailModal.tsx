import React from 'react';
import { Lead } from '../../../types/crm';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
  onConvert: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onEdit,
  onConvert,
}) => {
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
          maxWidth: '540px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                {lead.name}
              </h2>
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  background:
                    lead.status === 'converted'
                      ? '#D1FAE5'
                      : lead.status === 'qualified'
                      ? '#E0E7FF'
                      : lead.status === 'contacted'
                      ? '#FEF3C7'
                      : '#F1F5F9',
                  color:
                    lead.status === 'converted'
                      ? '#065F46'
                      : lead.status === 'qualified'
                      ? '#3730A3'
                      : lead.status === 'contacted'
                      ? '#92400E'
                      : '#475569',
                }}
              >
                {lead.status}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              {lead.title ? `${lead.title} at ` : ''}{lead.company}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Email</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{lead.email}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Phone</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{lead.phone || 'N/A'}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Lead Score</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563EB' }}>{lead.score} / 100</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Source</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>{lead.source}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Est. Deal Value</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
              ₹{lead.value ? lead.value.toLocaleString() : '0'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Lead Owner</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{lead.owner}</span>
          </div>
        </div>

        {lead.notes && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Notes</span>
            <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0, background: '#FFFBEB', padding: '0.75rem', borderRadius: '6px' }}>
              {lead.notes}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          {lead.status !== 'converted' ? (
            <button
              onClick={() => {
                onClose();
                onConvert();
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                background: '#10B981',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              🔄 Convert Lead
            </button>
          ) : (
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>
              ✓ Lead Converted
            </span>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
              Edit Lead
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
    </div>
  );
};
