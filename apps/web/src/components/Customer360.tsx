import React, { useMemo } from 'react';
import { useCRM } from '../modules/crm/crmContext';
import { useSales } from '../modules/sales/salesContext';
import { useFinance } from '../modules/finance/financeContext';
import { Company } from '../types/crm';

interface Customer360Props {
  companyId: string;
  onClose: () => void;
}

export const Customer360: React.FC<Customer360Props> = ({ companyId, onClose }) => {
  const { companies, contacts, deals } = useCRM();
  const { quotations, orders } = useSales();
  const { invoices } = useFinance();

  const company = useMemo(() => companies.find((c) => c.id === companyId), [companies, companyId]);
  const companyContacts = useMemo(
    () => contacts.filter((c) => c.companyId === companyId),
    [contacts, companyId]
  );
  const companyDeals = useMemo(() => deals.filter((d) => d.companyId === companyId), [deals, companyId]);
  const companyQuotations = useMemo(
    () => quotations.filter((q) => q.companyId === companyId),
    [quotations, companyId]
  );
  const companyOrders = useMemo(() => orders.filter((o) => o.companyId === companyId), [orders, companyId]);
  const companyInvoices = useMemo(
    () => invoices.filter((i) => i.companyId === companyId),
    [invoices, companyId]
  );

  const totalOrderValue = companyOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPaidAmount = companyInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalOutstanding = companyInvoices.reduce((sum, i) => sum + i.outstandingAmount, 0);
  const activeDealsCount = companyDeals.filter((d) => !['lost', 'won'].includes(d.stage)).length;
  const wonDealsCount = companyDeals.filter((d) => d.stage === 'won').length;
  const totalPipeline = companyDeals
    .filter((d) => !['lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

  if (!company) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.75rem',
          maxWidth: '900px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          margin: '2rem auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
              🏢 {company.name} (360° View)
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              {company.industry} • {company.employees} employees • {company.revenue || 'N/A'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: '#F8FAFC', borderRadius: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Email</span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#0F172A' }}>{company.email}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Phone</span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#0F172A' }}>{company.phone}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Account Owner</span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#0F172A' }}>{company.owner}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Created</span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#0F172A' }}>{new Date(company.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0C4A6E' }}>₹{(totalOrderValue / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Total Order Value</div>
          </div>
          <div style={{ background: '#D1FAE5', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#065F46' }}>₹{(totalPaidAmount / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Amount Paid</div>
          </div>
          <div style={{ background: '#FEE2E2', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991B1B' }}>₹{(totalOutstanding / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Outstanding Amount</div>
          </div>
          <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#92400E' }}>₹{(totalPipeline / 100000).toFixed(1)}L</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Pipeline Value</div>
          </div>
        </div>

        {/* Deal Counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#E9D5FF', padding: '0.875rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6B21A8' }}>{activeDealsCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Active Deals</div>
          </div>
          <div style={{ background: '#DDD6FE', padding: '0.875rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4338CA' }}>{wonDealsCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Won Deals</div>
          </div>
          <div style={{ background: '#F3E8FF', padding: '0.875rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7C3AED' }}>{companyOrders.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 600, marginTop: '0.25rem' }}>Total Orders</div>
          </div>
        </div>

        {/* Contacts Section */}
        {companyContacts.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
              👥 Key Contacts ({companyContacts.length})
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {companyContacts.map((contact) => (
                <div
                  key={contact.id}
                  style={{
                    background: '#F1F5F9',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#0F172A',
                  }}
                >
                  <strong>{contact.firstName} {contact.lastName}</strong> ({contact.title})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quotations Section */}
        {companyQuotations.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
              📋 Quotations ({companyQuotations.length})
            </h3>
            <div style={{ fontSize: '0.875rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {companyQuotations.map((q) => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#E0F2FE', padding: '0.375rem 0.625rem', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#0C4A6E' }}>{q.code}</span>
                  <span style={{ color: '#64748B' }}>₹{(q.total / 100000).toFixed(1)}L</span>
                  <span style={{ fontSize: '0.75rem', background: '#BAE6FD', padding: '0.125rem 0.375rem', borderRadius: '2px', color: '#0C4A6E', fontWeight: 600 }}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {companyOrders.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
              📦 Sales Orders ({companyOrders.length})
            </h3>
            <div style={{ fontSize: '0.875rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {companyOrders.map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#DCFCE7', padding: '0.375rem 0.625rem', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#065F46' }}>{o.code}</span>
                  <span style={{ color: '#64748B' }}>₹{(o.total / 100000).toFixed(1)}L</span>
                  <span style={{ fontSize: '0.75rem', background: '#BBFACB', padding: '0.125rem 0.375rem', borderRadius: '2px', color: '#065F46', fontWeight: 600 }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoices Section */}
        {companyInvoices.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
              💳 Invoices ({companyInvoices.length})
            </h3>
            <div style={{ fontSize: '0.875rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {companyInvoices.map((i) => (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#F3E8FF', padding: '0.375rem 0.625rem', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#6B21A8' }}>{i.code}</span>
                  <span style={{ color: '#64748B' }}>₹{(i.total / 100000).toFixed(1)}L</span>
                  <span style={{ fontSize: '0.75rem', background: '#E9D5FF', padding: '0.125rem 0.375rem', borderRadius: '2px', color: '#6B21A8', fontWeight: 600 }}>
                    {i.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              background: '#F1F5F9',
              color: '#475569',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customer360;
