import React from 'react';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
}

interface SalesFunnelProps {
  title: string;
  stages?: FunnelStage[];
}

export const SalesFunnel: React.FC<SalesFunnelProps> = ({
  title,
  stages = [
    { name: 'Leads', count: 1250, percentage: 100 },
    { name: 'Qualified', count: 850, percentage: 68 },
    { name: 'Proposal', count: 420, percentage: 33.6 },
    { name: 'Won', count: 156, percentage: 12.5 },
  ],
}) => {
  return (
    <div className="funnel-card">
      <h3 className="funnel-title">{title}</h3>

      <div className="funnel-container">
        {stages.map((stage, index) => (
          <div key={index} className="funnel-stage">
            <div
              className="funnel-bar"
              style={{
                width: `${stage.percentage}%`,
              }}
            >
              <div className="funnel-content">
                <span className="funnel-name">{stage.name}</span>
                <span className="funnel-count">{stage.count}</span>
              </div>
            </div>
            <div className="funnel-percentage">{stage.percentage.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesFunnel;
