import React, { useState } from 'react';
import { useSales } from '../salesContext';
import { useFinance } from '../../finance/financeContext';
import { SalesOrder, OrderStatus } from '../../../types/sales';
import { OrderFormModal } from './OrderFormModal';
import { OrderDetailModal } from './OrderDetailModal';

export const OrdersPage: React.FC = () => {
  const { orders, deleteOrder, updateOrderStatus } = useSales();
  const { convertOrderToInvoice } = useFinance();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);

  const handleCreateInvoice = (order: SalesOrder) => {
    const invoice = convertOrderToInvoice(order);
    setCreatedInvoice(invoice);
    // Keep the modal open for 2 seconds to show the success message
    setTimeout(() => {
      setIsDetailOpen(false);
      setSelectedOrder(null);
    }, 2000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.quotationCode && o.quotationCode.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Sales Orders
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Confirmed client purchase orders, delivery status tracking, and fulfillment bridge.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedOrder(null);
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
          + Create Sales Order
        </button>
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
          placeholder="Search by code (SO-00124), customer, quotation..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Orders Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Order Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ref Quotation</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Amount</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Order Date</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No sales orders found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedOrder(o);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
                    >
                      {o.code}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {o.customerName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {o.quotationCode || 'Direct'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(o.total / 100000).toFixed(2)}L
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
                          o.status === 'completed'
                            ? '#D1FAE5'
                            : o.status === 'processing'
                            ? '#E0E7FF'
                            : o.status === 'confirmed'
                            ? '#DBEAFE'
                            : '#FEF3C7',
                        color:
                          o.status === 'completed'
                            ? '#065F46'
                            : o.status === 'processing'
                            ? '#3730A3'
                            : o.status === 'confirmed'
                            ? '#1D4ED8'
                            : '#92400E',
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(o.orderDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {o.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'processing')}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #8B5CF6',
                            background: '#F5F3FF',
                            color: '#6D28D9',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Process
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
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
                        onClick={() => deleteOrder(o.id)}
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

      {/* Modals */}
      {isFormOpen && (
        <OrderFormModal
          order={selectedOrder}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {isDetailOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
            setCreatedInvoice(null);
          }}
          onEdit={() => setIsFormOpen(true)}
          onCreateInvoice={() => handleCreateInvoice(selectedOrder)}
        />
      )}
    </div>
  );
};
