import React from 'react';

interface Order {
  id: string;
  orderNumber: string;
  amount: number | string;
  status: 'paid' | 'pending' | 'cancelled' | 'processing';
  date?: string;
}

interface RecentOrdersTableProps {
  title: string;
  orders?: Order[];
  onViewAll?: () => void;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  title,
  orders = [
    { id: '1', orderNumber: 'SO-1023', amount: '₹50,000', status: 'paid' },
    { id: '2', orderNumber: 'SO-1022', amount: '₹25,000', status: 'pending' },
    { id: '3', orderNumber: 'SO-1021', amount: '₹75,500', status: 'paid' },
    { id: '4', orderNumber: 'SO-1020', amount: '₹12,300', status: 'processing' },
  ],
  onViewAll,
}) => {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: '✓ Paid',
      pending: '⏱ Pending',
      cancelled: '✗ Cancelled',
      processing: '⟳ Processing',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    return `status-${status}`;
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">{title}</h3>
        {onViewAll && (
          <button className="view-all-btn" onClick={onViewAll}>
            View All →
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="table-row">
                <td className="order-number">
                  <a href={`/sales/orders/${order.id}`} className="link">
                    {order.orderNumber}
                  </a>
                </td>
                <td className="order-amount">{order.amount}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusBadge(order.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
