import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface RevenueChartProps {
  title: string;
  data?: ChartDataPoint[];
  height?: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  title,
  data = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 67 },
  ],
  height = 300,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      
      <div className="chart-container" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 500 300"
          className="chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <line x1="40" y1="20" x2="40" y2="260" stroke="#ddd" />
          <line x1="40" y1="260" x2="490" y2="260" stroke="#ddd" />

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * 200;
            const x = 60 + i * 70;
            const y = 260 - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width="50"
                  height={barHeight}
                  fill="#3B82F6"
                  opacity="0.8"
                  className="chart-bar"
                />
                <text
                  x={x + 25}
                  y="280"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#3B82F6' }} />
          <span>Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
