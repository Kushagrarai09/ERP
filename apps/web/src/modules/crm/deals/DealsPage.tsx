import React, { useState } from 'react';
import { useCRM } from '../crmContext';
import { useSales } from '../../sales/salesContext';
import { Deal } from '../../../types/crm';
import { DealKanbanBoard } from './DealKanbanBoard';
import { DealFormModal } from './DealFormModal';
import { DealDetailModal } from './DealDetailModal';

export const DealsPage: React.FC = () => {
  const { deals, deleteDeal } = useCRM();
  const { convertDealToQuotation } = useSales();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [createdQuotation, setCreatedQuotation] = useState<any>(null);

  const handleCreateQuotation = (deal: Deal) => {
    const quotation = convertDealToQuotation(deal);
    setCreatedQuotation(quotation);
    // Keep the modal open for 2 seconds to show the success message
    setTimeout(() => {
      setIsDetailOpen(false);
      setSelectedDeal(null);
    }, 2000);
  };

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'all' || d.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Deals & Pipeline
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Track deal stages, win probabilities, closing dates, and revenue projections.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: '#E2E8F0', padding: '0.25rem', borderRadius: '6px' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '0.375rem 0.75rem',
                border: 'none',
                borderRadius: '4px',
                background: viewMode === 'kanban' ? 'white' : 'transparent',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: viewMode === 'kanban' ? '#0F172A' : '#64748B',
                boxShadow: viewMode === 'kanban' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📊 Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.375rem 0.75rem',
                border: 'none',
                borderRadius: '4px',
                background: viewMode === 'list' ? 'white' : 'transparent',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: viewMode === 'list' ? '#0F172A' : '#64748B',
                boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              ☰ List View
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedDeal(null);
              setIsFormOpen(true);
            }}
            style={{
              padding: '0.625rem 1.25rem',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            + Create Deal
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search deals by name, company, owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '220px',
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
          }}
        />

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Stages</option>
          <option value="new">New</option>
          <option value="qualification">Qualification</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Content View */}
      {viewMode === 'kanban' ? (
        <DealKanbanBoard
          deals={filteredDeals}
          onSelectDeal={(deal) => {
            setSelectedDeal(deal);
            setIsDetailOpen(true);
          }}
        />
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Deal Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Company</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Value</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Stage</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Win Probability</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Owner</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                    No deals found.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((deal) => (
                  <tr key={deal.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div
                        onClick={() => {
                          setSelectedDeal(deal);
                          setIsDetailOpen(true);
                        }}
                        style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                      >
                        {deal.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: '#0F172A' }}>
                      {deal.company}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                      ₹{deal.value.toLocaleString()}
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
                            deal.stage === 'won'
                              ? '#D1FAE5'
                              : deal.stage === 'lost'
                              ? '#FEE2E2'
                              : '#DBEAFE',
                          color:
                            deal.stage === 'won'
                              ? '#065F46'
                              : deal.stage === 'lost'
                              ? '#991B1B'
                              : '#1E40AF',
                        }}
                      >
                        {deal.stage}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#2563EB' }}>
                      {deal.probability}%
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{deal.owner}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setSelectedDeal(deal);
                            setIsFormOpen(true);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            background: 'white',
                            color: '#475569',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDeal(deal.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#FEE2E2',
                            color: '#991B1B',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {isFormOpen && (
        <DealFormModal
          deal={selectedDeal}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedDeal(null);
          }}
        />
      )}

      {isDetailOpen && selectedDeal && (
        <DealDetailModal
          deal={selectedDeal}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedDeal(null);
            setCreatedQuotation(null);
          }}
          onEdit={() => setIsFormOpen(true)}
          onCreateQuotation={() => handleCreateQuotation(selectedDeal)}
        />
      )}
    </div>
  );
};
