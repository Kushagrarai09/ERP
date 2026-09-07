import React, { useState } from 'react';
import { useProcurement } from '../procurementContext';
import { PurchaseOrder, POStatus } from '../../../types/procurement';
import { POFormModal } from './POFormModal';
import { PODetailModal } from './PODetailModal';
import { ReceiveGoodsModal } from '../receipt/ReceiveGoodsModal';

export const PurchaseOrdersPage: React.FC = () => {
  const { purchaseOrders, deletePO } = useProcurement();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.code.toLowerCase().includes(search.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      po.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Purchase Orders
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Issue official purchase orders to approved vendors and track inbound delivery status.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPO(null);
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
          + Create Purchase Order
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
          placeholder="Search PO code (PO-00125), supplier..."
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
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="approved">Approved</option>
          <option value="received">Received</option>
        </select>
      </div>

      {/* Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>PO Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Supplier Vendor</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Value</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>PO Date</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPOs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No purchase orders found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredPOs.map((po) => (
                <tr key={po.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedPO(po);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
                    >
                      {po.code}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {po.supplierName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(po.total / 100000).toFixed(2)}L
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
                          po.status === 'received'
                            ? '#D1FAE5'
                            : po.status === 'approved'
                            ? '#E0E7FF'
                            : po.status === 'sent'
                            ? '#FEF3C7'
                            : '#F1F5F9',
                        color:
                          po.status === 'received'
                            ? '#065F46'
                            : po.status === 'approved'
                            ? '#3730A3'
                            : po.status === 'sent'
                            ? '#92400E'
                            : '#475569',
                      }}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(po.poDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{po.owner}</td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {po.status !== 'received' && (
                        <button
                          onClick={() => {
                            setSelectedPO(po);
                            setIsReceiveOpen(true);
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #10B981',
                            background: '#ECFDF5',
                            color: '#047857',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Receive Goods
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedPO(po);
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
                        onClick={() => deletePO(po.id)}
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
        <POFormModal
          po={selectedPO}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPO(null);
          }}
        />
      )}

      {isDetailOpen && selectedPO && (
        <PODetailModal
          po={selectedPO}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedPO(null);
          }}
          onEdit={() => setIsFormOpen(true)}
          onReceiveGoods={() => setIsReceiveOpen(true)}
        />
      )}

      {isReceiveOpen && selectedPO && (
        <ReceiveGoodsModal
          po={selectedPO}
          onClose={() => {
            setIsReceiveOpen(false);
            setSelectedPO(null);
          }}
        />
      )}
    </div>
  );
};
