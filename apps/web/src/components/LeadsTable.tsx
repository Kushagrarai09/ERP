import React, { useState } from 'react';
import { Lead } from '../../types/crm';

interface FilterOptions {
  status?: string;
  owner?: string;
  source?: string;
  scoreMin?: number;
}

interface LeadsTableProps {
  leads?: Lead[];
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads = [],
  onEdit,
  onDelete,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || lead.status === filters.status;
    const matchesOwner = !filters.owner || lead.owner === filters.owner;
    const matchesSource = !filters.source || lead.source === filters.source;
    const matchesScore = !filters.scoreMin || lead.score >= filters.scoreMin;

    return matchesSearch && matchesStatus && matchesOwner && matchesSource && matchesScore;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: '#3B82F6',
      qualified: '#10B981',
      contacted: '#F59E0B',
      proposal: '#8B5CF6',
      negotiation: '#EF4444',
      lost: '#6B7280',
    };
    return colors[status] || '#6B7280';
  };

  const statusLabels: Record<string, string> = {
    new: 'New',
    qualified: 'Qualified',
    contacted: 'Contacted',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    lost: 'Lost',
  };

  return (
    <div className="leads-table-container">
      {/* Search Bar */}
      <div className="leads-search-bar">
        <input
          type="text"
          placeholder="Search leads by name, company, or email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="leads-filters">
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value || undefined })
          }
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="contacted">Contacted</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="lost">Lost</option>
        </select>

        <select
          className="filter-select"
          value={filters.owner || ''}
          onChange={(e) =>
            setFilters({ ...filters, owner: e.target.value || undefined })
          }
        >
          <option value="">All Owners</option>
          <option value="Amit">Amit</option>
          <option value="Ravi">Ravi</option>
        </select>

        <select
          className="filter-select"
          value={filters.source || ''}
          onChange={(e) =>
            setFilters({ ...filters, source: e.target.value || undefined })
          }
        >
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="cold-call">Cold Call</option>
          <option value="email">Email</option>
          <option value="social">Social</option>
          <option value="event">Event</option>
        </select>

        <select
          className="filter-select"
          value={filters.scoreMin || ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              scoreMin: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
        >
          <option value="">All Scores</option>
          <option value="80">Score 80+</option>
          <option value="70">Score 70+</option>
          <option value="60">Score 60+</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Status</th>
              <th>Score</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-message">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="table-row">
                  <td className="lead-name">
                    <strong>{lead.name}</strong>
                  </td>
                  <td className="lead-company">{lead.company}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(lead.status)}20`,
                        color: getStatusColor(lead.status),
                      }}
                    >
                      {statusLabels[lead.status]}
                    </span>
                  </td>
                  <td className="lead-score">
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${lead.score}%`,
                          backgroundColor: getStatusColor(lead.status),
                        }}
                      />
                    </div>
                    <span>{lead.score}</span>
                  </td>
                  <td>{lead.owner}</td>
                  <td className="lead-email">{lead.email}</td>
                  <td className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit?.(lead)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete?.(lead.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>
    </div>
  );
};

export default LeadsTable;
