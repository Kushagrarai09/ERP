import React, { useState } from 'react';
import { Company } from '../../types/crm';

interface CompaniesTableProps {
  companies?: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (companyId: string) => void;
}

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    industry: 'Software',
    employees: 500,
    revenue: '$50M',
    website: 'www.acme.com',
    email: 'contact@acme.com',
    phone: '+91-8800000001',
    createdAt: new Date('2024-08-20'),
  },
  {
    id: '2',
    name: 'Globex Industries',
    industry: 'Manufacturing',
    employees: 1200,
    revenue: '$120M',
    website: 'www.globex.com',
    email: 'info@globex.com',
    phone: '+91-8800000002',
    createdAt: new Date('2024-08-25'),
  },
  {
    id: '3',
    name: 'TechCorp Solutions',
    industry: 'IT Services',
    employees: 800,
    revenue: '$80M',
    website: 'www.techcorp.com',
    email: 'hello@techcorp.com',
    phone: '+91-8800000003',
    createdAt: new Date('2024-08-18'),
  },
  {
    id: '4',
    name: 'StartUp Innovations',
    industry: 'SaaS',
    employees: 50,
    revenue: '$5M',
    website: 'www.startupinnovations.com',
    email: 'team@startup.com',
    phone: '+91-8800000004',
    createdAt: new Date('2024-08-15'),
  },
];

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies = MOCK_COMPANIES,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const filteredCompanies = companies.filter(
    (company) =>
      (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!industryFilter || company.industry === industryFilter)
  );

  const industries = Array.from(
    new Set(companies.map((c) => c.industry))
  ).sort();

  return (
    <div className="companies-table-container">
      {/* Search and Filters */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search companies by name or email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Employees</th>
              <th>Revenue</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-message">
                  No companies found
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr key={company.id} className="table-row">
                  <td className="company-name">
                    <strong>{company.name}</strong>
                  </td>
                  <td>
                    <span className="badge">{company.industry}</span>
                  </td>
                  <td>{company.employees.toLocaleString()}</td>
                  <td>{company.revenue || 'N/A'}</td>
                  <td className="company-email">{company.email}</td>
                  <td>{company.phone}</td>
                  <td className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit?.(company)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete?.(company.id)}
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

      <div className="results-info">
        Showing {filteredCompanies.length} of {companies.length} companies
      </div>
    </div>
  );
};

export default CompaniesTable;
