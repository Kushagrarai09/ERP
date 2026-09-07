import React, { useState } from 'react';
import { useCRM } from '../crmContext';
import { Contact } from '../../../types/crm';
import { ContactFormModal } from './ContactFormModal';
import { ContactDetailModal } from './ContactDetailModal';

export const ContactsPage: React.FC = () => {
  const { contacts, deleteContact } = useCRM();

  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredContacts = contacts.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={{ padding: '1.5rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Contacts Directory
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Manage key stakeholders, decision makers, and company representatives.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedContact(null);
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
          + Create Contact
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
        }}
      >
        <input
          type="text"
          placeholder="Search contact by name, title, company, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.5rem 0.875rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '0.875rem',
          }}
        />
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Contact Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Job Title</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Phone</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                  No contacts found matching your search.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div
                      onClick={() => {
                        setSelectedContact(contact);
                        setIsDetailOpen(true);
                      }}
                      style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                    >
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{contact.email}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#334155' }}>{contact.title}</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0F172A' }}>
                    {contact.company}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{contact.phone}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>{contact.owner}</td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
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
                        onClick={() => deleteContact(contact.id)}
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
        <ContactFormModal
          contact={selectedContact}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedContact(null);
          }}
        />
      )}

      {isDetailOpen && selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedContact(null);
          }}
          onEdit={() => setIsFormOpen(true)}
        />
      )}
    </div>
  );
};
