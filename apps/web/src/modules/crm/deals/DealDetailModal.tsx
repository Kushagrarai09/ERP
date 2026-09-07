import React, { useState } from 'react';
import { Deal, DealStage } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface DealDetailModalProps {
  deal: Deal;
  onClose: () => void;
  onEdit: () => void;
  onCreateQuotation?: () => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({ deal, onClose, onEdit, onCreateQuotation }) => {
  const { updateDealStage } = useCRM();
  const [createdNotice, setCreatedNotice] = useState(false);

  const stages: { stage: DealStage; label: string }[] = [
    { stage: 'new', label: 'New' },
    { stage: 'qualification', label: 'Qualification' },
    { stage: 'proposal', label: 'Proposal' },
    { stage: 'negotiation', label: 'Negotiation' },
    { stage: 'won', label: 'Won' },
    { stage: 'lost', label: 'Lost' },
  ];

  const handleCreateQuote = () => {
    setCreatedNotice(true);
    if (onCreateQuotation) {
      onCreateQuotation();
    }
  };

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
          maxWidth: '560px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                {deal.name}
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Company Account: <strong style={{ color: '#1E293B' }}>{deal.company}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Stage Progression Buttons */}
        <div style={{ margin: '1rem 0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.375rem' }}>
            Pipeline Stage Progression:
          </span>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {stages.map((stg) => {
              const isActive = deal.stage === stg.stage;
              return (
                <button
                  key={stg.stage}
                  onClick={() => updateDealStage(deal.id, stg.stage)}
                  style={{
                    padding: '0.375rem 0.625rem',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isActive
                      ? stg.stage === 'won'
                        ? '#10B981'
                        : stg.stage === 'lost'
                        ? '#EF4444'
                        : '#3B82F6'
                      : '#F8FAFC',
                    color: isActive ? 'white' : '#475569',
                  }}
                >
                  {stg.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Deal Value</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>
              ₹{deal.value.toLocaleString()}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Win Probability</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#2563EB' }}>{deal.probability}%</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Expected Close</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
              {new Date(deal.closingDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Deal Owner</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{deal.owner}</span>
          </div>
        </div>

        {deal.description && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Description</span>
            <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0, background: '#F1F5F9', padding: '0.75rem', borderRadius: '6px' }}>
              {deal.description}
            </p>
          </div>
        )}

        {createdNotice && (
          <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', color: '#065F46', marginBottom: '1rem' }}>
            ✓ <strong>Quotation Initiated:</strong> Generated new draft quotation for {deal.company}.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={handleCreateQuote}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#3B82F6',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            📋 Create Quotation
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              Edit Deal
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
