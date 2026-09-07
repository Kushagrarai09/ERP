import React, { useState } from 'react';
import { useCRM } from '../../crm/crmContext';
import { useSales } from '../salesContext';
import { Company } from '../../../types/crm';
import { CustomerDetailModal } from './CustomerDetailModal';

export const CustomersPage: React.FC = () => {
  const { companies, contacts, deals } = useCRM();
  const { orders } = useSales();

  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Customers (Reused CRM Accounts)
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
          Customer directory unified with CRM Companies, active deals, and order history.
        </p>
      </div>

      {/* Filters */}
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
          placeholder="Search customer by name, email..."
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
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Software">Software</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Fintech">Fintech</option>
          <option value="Logistics">Logistics</option>
        </select>
      </div>

      {/* Customer Directory Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Primary Contact</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Active Deals</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Orders</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Total Spent</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((comp) => {
              const primaryContact = contacts.find((c) => c.company.toLowerCase() === comp.name.toLowerCase());
              const customerDeals = deals.filter((d) => d.company.toLowerCase() === comp.name.toLowerCase());
              const customerOrders = orders.filter((o) => o.customerName.toLowerCase() === comp.name.toLowerCase());
              const totalSpent = customerOrders.reduce((s, o) => s + o.total, 0);

              return (
                <tr key={comp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => setSelectedCompany(comp)}
                      style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                    >
                      🛍️ {comp.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{comp.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>
                    {primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : 'N/A'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {customerDeals.length} deals
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {customerOrders.length} orders
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(totalSpent / 100000).toFixed(2)}L
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#D1FAE5',
                        color: '#065F46',
                      }}
                    >
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedCompany(comp)}
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        border: '1px solid #3B82F6',
                        background: '#EFF6FF',
                        color: '#1D4ED8',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      View Customer 360°
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedCompany && (
        <CustomerDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
};
