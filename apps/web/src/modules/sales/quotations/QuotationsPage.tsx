import React, { useState } from 'react';
import { useSales } from '../salesContext';
import { Quotation, QuotationStatus } from '../../../types/sales';
import { QuotationFormModal } from './QuotationFormModal';
import { QuotationDetailModal } from './QuotationDetailModal';

export const QuotationsPage: React.FC = () => {
  const { quotations, deleteQuotation, convertQuotationToOrder } = useSales();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.code.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Sales Quotations
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Draft, issue, and convert official sales quotes for prospective clients.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedQuotation(null);
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
          + New Quotation
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
          placeholder="Search by code (QT-00124), customer..."
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
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Quotations Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Quotation Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Amount</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Valid Until</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No quotations found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredQuotations.map((q) => (
                <tr key={q.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedQuotation(q);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
                    >
                      {q.code}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {q.customerName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{q.total.toLocaleString()}
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
                          q.status === 'accepted'
                            ? '#D1FAE5'
                            : q.status === 'sent'
                            ? '#DBEAFE'
                            : q.status === 'rejected'
                            ? '#FEE2E2'
                            : '#F1F5F9',
                        color:
                          q.status === 'accepted'
                            ? '#065F46'
                            : q.status === 'sent'
                            ? '#1E40AF'
                            : q.status === 'rejected'
                            ? '#991B1B'
                            : '#475569',
                      }}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{q.owner}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {new Date(q.validUntil).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => convertQuotationToOrder(q)}
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
                        Convert to Order
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuotation(q);
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
                        onClick={() => deleteQuotation(q.id)}
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
        <QuotationFormModal
          quotation={selectedQuotation}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedQuotation(null);
          }}
        />
      )}

      {isDetailOpen && selectedQuotation && (
        <QuotationDetailModal
          quotation={selectedQuotation}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedQuotation(null);
          }}
          onEdit={() => setIsFormOpen(true)}
          onConvertToOrder={() => convertQuotationToOrder(selectedQuotation)}
        />
      )}
    </div>
  );
};
