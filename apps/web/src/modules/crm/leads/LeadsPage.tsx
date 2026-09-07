import React, { useState } from 'react';
import { useCRM } from '../crmContext';
import { Lead, LeadStatus, LeadSource } from '../../../types/crm';
import { LeadFormModal } from './LeadFormModal';
import { LeadDetailModal } from './LeadDetailModal';
import { ConvertLeadModal } from './ConvertLeadModal';

export const LeadsPage: React.FC = () => {
  const { leads, deleteLead } = useCRM();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  // Filtering
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Leads Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Capture, qualify, and convert potential clients into long-term accounts.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedLead(null);
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
          + Create Lead
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
          placeholder="Search by name, company, email..."
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
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="cold-call">Cold Call</option>
          <option value="email">Email</option>
          <option value="social">Social</option>
          <option value="event">Event</option>
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Lead Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Score</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Source</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Est. Value</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No leads found matching your search and filter criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                >
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                    >
                      {lead.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{lead.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: '#1E293B' }}>
                    {lead.company}
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
                          lead.status === 'converted'
                            ? '#D1FAE5'
                            : lead.status === 'qualified'
                            ? '#E0E7FF'
                            : lead.status === 'contacted'
                            ? '#FEF3C7'
                            : lead.status === 'lost'
                            ? '#FEE2E2'
                            : '#F1F5F9',
                        color:
                          lead.status === 'converted'
                            ? '#065F46'
                            : lead.status === 'qualified'
                            ? '#3730A3'
                            : lead.status === 'contacted'
                            ? '#92400E'
                            : lead.status === 'lost'
                            ? '#991B1B'
                            : '#475569',
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: lead.score > 80 ? '#059669' : lead.score > 50 ? '#D97706' : '#DC2626' }}>
                    {lead.score}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textTransform: 'capitalize', color: '#475569' }}>
                    {lead.source}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    ₹{lead.value ? lead.value.toLocaleString() : '0'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{lead.owner}</td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {lead.status !== 'converted' && (
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsConvertOpen(true);
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
                          Convert
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
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
                        onClick={() => deleteLead(lead.id)}
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
        <LeadFormModal
          lead={selectedLead}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedLead(null);
          }}
        />
      )}

      {isDetailOpen && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedLead(null);
          }}
          onEdit={() => setIsFormOpen(true)}
          onConvert={() => setIsConvertOpen(true)}
        />
      )}

      {isConvertOpen && selectedLead && (
        <ConvertLeadModal
          lead={selectedLead}
          onClose={() => {
            setIsConvertOpen(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};
