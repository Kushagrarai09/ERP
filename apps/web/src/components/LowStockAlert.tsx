import React from 'react';

interface StockItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  icon?: string;
}

interface LowStockAlertProps {
  title: string;
  items?: StockItem[];
  onViewAll?: () => void;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
  title,
  items = [
    { id: '1', name: 'Laptop', stock: 5, minStock: 10, icon: '💻' },
    { id: '2', name: 'Monitor', stock: 8, minStock: 15, icon: '🖥️' },
    { id: '3', name: 'Keyboard', stock: 3, minStock: 20, icon: '⌨️' },
    { id: '4', name: 'Mouse', stock: 2, minStock: 30, icon: '🖱️' },
  ],
  onViewAll,
}) => {
  return (
    <div className="alert-card warning">
      <div className="alert-header">
        <h3 className="alert-title">⚠️ {title}</h3>
        {onViewAll && (
          <button className="view-all-btn" onClick={onViewAll}>
            View All →
          </button>
        )}
      </div>

      <div className="alert-list">
        {items.map((item) => (
          <div key={item.id} className="alert-item">
            <div className="item-info">
              {item.icon && <span className="item-icon">{item.icon}</span>}
              <div className="item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-stock">
                  {item.stock} left (min: {item.minStock})
                </p>
              </div>
            </div>
            <div className="item-action">
              <a href={`/inventory/products/${item.id}`} className="link-small">
                Reorder
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
