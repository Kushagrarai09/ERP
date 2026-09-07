import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export const DashboardKPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  icon,
  color = 'blue',
}) => {
  return (
    <div className={`kpi-card kpi-${color}`}>
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        {icon && <span className="kpi-icon">{icon}</span>}
      </div>

      <div className="kpi-content">
        <p className="kpi-value">{value}</p>
        {trend && (
          <div className={`kpi-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            <span className="trend-icon">
              {trend.isPositive ? '↑' : '↓'}
            </span>
            <span className="trend-text">{Math.abs(trend.percentage)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardKPICard;
