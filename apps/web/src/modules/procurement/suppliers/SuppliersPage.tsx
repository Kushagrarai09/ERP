import React, { useState } from 'react';
import { useProcurement } from '../procurementContext';
import { Supplier } from '../../../types/procurement';
import { SupplierFormModal } from './SupplierFormModal';
import { SupplierDetailModal } from './SupplierDetailModal';

export const SuppliersPage: React.FC = () => {
  const { suppliers, deleteSupplier } = useProcurement();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Vendor Suppliers Directory
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Manage approved vendor partners, contact representatives, and purchasing history.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedSupplier(null);
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
          + Add Supplier
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
          placeholder="Search supplier name, contact, email..."
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
            background: 'white',
          }}
        >
          <option value="all">All Categories</option>
          <option value="Hardware & IT Equipment">Hardware & IT Equipment</option>
          <option value="Sensors & IoT Hubs">Sensors & IoT Hubs</option>
          <option value="Peripherals & Accessories">Peripherals & Accessories</option>
        </select>
      </div>

      {/* Suppliers Table */}
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Supplier Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Contact Person</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Phone</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Lifetime Spend</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedSupplier(s);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                    >
                      🤝 {s.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: '#0F172A' }}>
                    {s.contactPerson}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{s.category}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{s.phone}</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#059669' }}>
                    ₹{(s.totalPurchases / 100000).toFixed(2)}L
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
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedSupplier(s);
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
                        onClick={() => deleteSupplier(s.id)}
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
        <SupplierFormModal
          supplier={selectedSupplier}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSupplier(null);
          }}
        />
      )}

      {isDetailOpen && selectedSupplier && (
        <SupplierDetailModal
          supplier={selectedSupplier}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedSupplier(null);
          }}
          onEdit={() => setIsFormOpen(true)}
        />
      )}
    </div>
  );
};
