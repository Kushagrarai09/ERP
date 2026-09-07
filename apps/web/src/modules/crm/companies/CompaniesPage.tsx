import React, { useState } from 'react';
import { useCRM } from '../crmContext';
import { Company } from '../../../types/crm';
import { CompanyFormModal } from './CompanyFormModal';
import { CompanyDetailModal } from './CompanyDetailModal';
import { Customer360 } from '../../../components/Customer360';

export const CompaniesPage: React.FC = () => {
  const { companies, deleteCompany } = useCRM();

  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [show360View, setShow360View] = useState(false);

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Company Accounts (Customer 360)
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Manage client organization profiles, employee stats, and associated contracts.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCompany(null);
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
          + Create Company
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
          placeholder="Search by company name, email, owner..."
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Industry</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Employees</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Est. Revenue</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Phone</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No companies found matching your search.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((comp) => (
                <tr key={comp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedCompany(comp);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                    >
                      🏢 {comp.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{comp.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#F1F5F9',
                        color: '#334155',
                      }}
                    >
                      {comp.industry}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{comp.employees} staff</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {comp.revenue || 'N/A'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{comp.phone}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{comp.owner}</td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedCompany(comp);
                          setShow360View(true);
                          setIsDetailOpen(true);
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #3B82F6',
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        360 View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCompany(comp);
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
                        onClick={() => deleteCompany(comp.id)}
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
        <CompanyFormModal
          company={selectedCompany}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {isDetailOpen && selectedCompany && show360View && (
        <Customer360
          companyId={selectedCompany.id}
          onClose={() => {
            setIsDetailOpen(false);
            setShow360View(false);
            setSelectedCompany(null);
          }}
        />
      )}

      {isDetailOpen && selectedCompany && !show360View && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedCompany(null);
          }}
          onEdit={() => setIsFormOpen(true)}
        />
      )}
    </div>
  );
};
