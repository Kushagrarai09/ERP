import React, { useState } from 'react';
import { useFinance } from '../financeContext';
import { Invoice, InvoiceStatus } from '../../../types/finance';
import { InvoiceFormModal } from './InvoiceFormModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';

export const InvoicesPage: React.FC = () => {
  const { invoices, deleteInvoice } = useFinance();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.code.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.salesOrderCode && inv.salesOrderCode.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Sales Invoices
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Official customer billing slips, GST tax breakdown, and outstanding balance tracking.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedInvoice(null);
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
          + Create Invoice
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
          placeholder="Search by code (INV-00124), customer, sales order..."
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
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Directory Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Invoice Code</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ref Sales Order</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Amount</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Paid / Outstanding</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No invoices found matching your search.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
                    >
                      {inv.code}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {inv.customerName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748B' }}>
                    {inv.salesOrderCode || 'Direct'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(inv.total / 100000).toFixed(2)}L
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                    ₹{(inv.paidAmount / 100000).toFixed(2)}L / <strong style={{ color: inv.outstandingAmount > 0 ? '#DC2626' : '#059669' }}>₹{(inv.outstandingAmount / 100000).toFixed(2)}L</strong>
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
                          inv.status === 'paid'
                            ? '#D1FAE5'
                            : inv.status === 'sent'
                            ? '#DBEAFE'
                            : inv.status === 'overdue'
                            ? '#FEE2E2'
                            : '#F1F5F9',
                        color:
                          inv.status === 'paid'
                            ? '#065F46'
                            : inv.status === 'sent'
                            ? '#1E40AF'
                            : inv.status === 'overdue'
                            ? '#991B1B'
                            : '#475569',
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {inv.outstandingAmount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsRecordPaymentOpen(true);
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
                          Record Payment
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
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
                        onClick={() => deleteInvoice(inv.id)}
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
        <InvoiceFormModal
          invoice={selectedInvoice}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {isDetailOpen && selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedInvoice(null);
          }}
          onEdit={() => setIsFormOpen(true)}
          onRecordPayment={() => setIsRecordPaymentOpen(true)}
        />
      )}

      {isRecordPaymentOpen && selectedInvoice && (
        <RecordPaymentModal
          invoice={selectedInvoice}
          onClose={() => {
            setIsRecordPaymentOpen(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};
