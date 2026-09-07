import React from 'react';

interface CrossModuleReferenceProps {
  label: string;
  code: string;
  module: 'CRM' | 'Sales' | 'Inventory' | 'Finance' | 'Procurement';
  onClick?: () => void;
}

/**
 * Displays a link to a related document in another module
 * Used for showing Deal -> Quotation -> Order -> Invoice workflow
 */
export const CrossModuleReference: React.FC<CrossModuleReferenceProps> = ({
  label,
  code,
  module,
  onClick,
}) => {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    CRM: { bg: '#FEF3C7', text: '#92400E', icon: '🤝' },
    Sales: { bg: '#D1FAE5', text: '#065F46', icon: '📋' },
    Inventory: { bg: '#DBEAFE', text: '#1E40AF', icon: '📦' },
    Finance: { bg: '#E9D5FF', text: '#6B21A8', icon: '💳' },
    Procurement: { bg: '#FECACA', text: '#7F1D1D', icon: '🛒' },
  };

  const config = colors[module];

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.875rem',
        borderRadius: '6px',
        border: 'none',
        background: config.bg,
        color: config.text,
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 600,
        fontSize: '0.875rem',
        fontFamily: 'inherit',
      }}
    >
      <span>{config.icon}</span>
      <span>{label}</span>
      <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>({code})</span>
    </button>
  );
};

export default CrossModuleReference;
