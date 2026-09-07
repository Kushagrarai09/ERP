import React from 'react';
import { Deal } from '../../types/crm';

interface DealCardProps {
  deal: Deal;
  onEdit?: (deal: Deal) => void;
  onDelete?: (dealId: string) => void;
}

interface DealPipelineProps {
  deals?: Deal[];
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (dealId: string) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit, onDelete }) => {
  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return '#10B981';
    if (probability >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="deal-card">
      <div className="deal-header">
        <h4 className="deal-name">{deal.name}</h4>
        <div className="deal-menu">
          <button className="menu-btn" onClick={() => onEdit?.(deal)}>
            ✎
          </button>
          <button className="menu-btn" onClick={() => onDelete?.(deal.id)}>
            ✕
          </button>
        </div>
      </div>

      <div className="deal-company">{deal.company}</div>

      <div className="deal-value">
        {deal.currency}
        {(deal.value / 100000).toFixed(1)}L
      </div>

      <div className="deal-probability">
        <div className="probability-bar">
          <div
            className="probability-fill"
            style={{
              width: `${deal.probability}%`,
              backgroundColor: getProbabilityColor(deal.probability),
            }}
          />
        </div>
        <span className="probability-text">{deal.probability}%</span>
      </div>

      <div className="deal-footer">
        <span className="deal-owner">{deal.owner}</span>
        <span className="deal-date">
          {new Date(deal.closingDate).toLocaleDateString('en-IN')}
        </span>
      </div>
    </div>
  );
};

export const DealPipeline: React.FC<DealPipelineProps> = ({
  deals = [],
  onEditDeal,
  onDeleteDeal,
}) => {
  const stages = [
    { id: 'qualification', label: 'Qualification', color: '#3B82F6' },
    { id: 'proposal', label: 'Proposal', color: '#8B5CF6' },
    { id: 'negotiation', label: 'Negotiation', color: '#F59E0B' },
    { id: 'won', label: 'Won', color: '#10B981' },
  ];

  const groupedDeals = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = deals.filter((d) => d.stage === stage.id);
      return acc;
    },
    {} as Record<string, Deal[]>
  );

  const calculateStageTotal = (stageId: string) => {
    return groupedDeals[stageId].reduce((sum, d) => sum + d.value, 0);
  };

  return (
    <div className="deal-pipeline">
      <div className="pipeline-grid">
        {stages.map((stage) => (
          <div key={stage.id} className="pipeline-column">
            <div className="column-header" style={{ borderTopColor: stage.color }}>
              <h3 className="column-title">{stage.label}</h3>
              <span className="column-count">
                {groupedDeals[stage.id].length}
              </span>
            </div>

            <div className="column-total">
              {stage.id === 'won'
                ? `₹${(calculateStageTotal(stage.id) / 100000).toFixed(1)}L`
                : `₹${(calculateStageTotal(stage.id) / 100000).toFixed(1)}L`}
            </div>

            <div className="column-cards">
              {groupedDeals[stage.id].length === 0 ? (
                <div className="empty-column">
                  <p>No deals</p>
                </div>
              ) : (
                groupedDeals[stage.id].map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onEdit={onEditDeal}
                    onDelete={onDeleteDeal}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealPipeline;
