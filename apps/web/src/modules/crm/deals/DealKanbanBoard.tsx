import React from 'react';
import { Deal, DealStage } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface DealKanbanBoardProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
}

export const DealKanbanBoard: React.FC<DealKanbanBoardProps> = ({ deals, onSelectDeal }) => {
  const { updateDealStage } = useCRM();

  const columns: { stage: DealStage; label: string; color: string }[] = [
    { stage: 'new', label: 'New', color: '#64748B' },
    { stage: 'qualification', label: 'Qualification', color: '#3B82F6' },
    { stage: 'proposal', label: 'Proposal', color: '#8B5CF6' },
    { stage: 'negotiation', label: 'Negotiation', color: '#F59E0B' },
    { stage: 'won', label: 'Won', color: '#10B981' },
    { stage: 'lost', label: 'Lost', color: '#EF4444' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        alignItems: 'start',
        overflowX: 'auto',
        paddingBottom: '1rem',
      }}
    >
      {columns.map((col) => {
        const stageDeals = deals.filter((d) => d.stage === col.stage);
        const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div
            key={col.stage}
            style={{
              background: '#F1F5F9',
              borderRadius: '8px',
              padding: '0.875rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '400px',
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: `3px solid ${col.color}`,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                  {col.label}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {stageDeals.length} {stageDeals.length === 1 ? 'deal' : 'deals'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                ₹{(stageTotal / 100000).toFixed(1)}L
              </span>
            </div>

            {/* Column Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {stageDeals.length === 0 ? (
                <div
                  style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '6px',
                    padding: '1.5rem 0.5rem',
                    textAlign: 'center',
                    color: '#94A3B8',
                    fontSize: '0.75rem',
                  }}
                >
                  No deals in {col.label}
                </div>
              ) : (
                stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => onSelectDeal(deal)}
                    style={{
                      background: 'white',
                      borderRadius: '8px',
                      padding: '0.875rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${col.color}`,
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                      {deal.name}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0.5rem 0', fontSize: '0.75rem', color: '#64748B' }}>
                      {deal.company}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                        ₹{(deal.value / 100000).toFixed(2)}L
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#2563EB',
                          background: '#EFF6FF',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '4px',
                        }}
                      >
                        {deal.probability}%
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.625rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid #F1F5F9',
                        fontSize: '0.75rem',
                        color: '#64748B',
                      }}
                    >
                      <span>Owner: {deal.owner.split(' ')[0]}</span>
                      {col.stage !== 'won' && col.stage !== 'lost' && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            title="Move forward"
                            onClick={(e) => {
                              e.stopPropagation();
                              const stageOrder: DealStage[] = ['new', 'qualification', 'proposal', 'negotiation', 'won'];
                              const currentIndex = stageOrder.indexOf(deal.stage);
                              if (currentIndex < stageOrder.length - 1) {
                                updateDealStage(deal.id, stageOrder[currentIndex + 1]);
                              }
                            }}
                            style={{
                              border: 'none',
                              background: '#DBEAFE',
                              color: '#1D4ED8',
                              borderRadius: '3px',
                              padding: '0.125rem 0.375rem',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
