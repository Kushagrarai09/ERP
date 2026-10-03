import React, { useState } from 'react';
import { Contact } from '../types/crm';

interface ContactsTableProps {
  contacts?: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'rahul@acme.com',
    phone: '+91-9876543210',
    company: 'Acme Corp',
    title: 'Manager',
    owner: 'Admin',
    createdAt: new Date('2024-08-20'),
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'priya@globex.com',
    phone: '+91-9876543211',
    company: 'Globex Industries',
    title: 'Director',
    owner: 'Admin',
    createdAt: new Date('2024-08-25'),
  },
  {
    id: '3',
    firstName: 'Arjun',
    lastName: 'Patel',
    email: 'arjun@techcorp.com',
    phone: '+91-9876543212',
    company: 'TechCorp Solutions',
    title: 'VP Sales',
    owner: 'Admin',
    createdAt: new Date('2024-08-18'),
  },
  {
    id: '4',
    firstName: 'Neha',
    lastName: 'Sharma',
    email: 'neha@startup.com',
    phone: '+91-9876543213',
    company: 'StartUp Innovations',
    title: 'Founder',
    owner: 'Admin',
    createdAt: new Date('2024-08-15'),
  },
];

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts = MOCK_CONTACTS,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contacts-table-container">
      {/* Search */}
      <div className="table-search">
        <input
          type="text"
          placeholder="Search contacts by name, company, or email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-message">
                  No contacts found
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.id} className="table-row">
                  <td className="contact-name">
                    <strong>
                      {contact.firstName} {contact.lastName}
                    </strong>
                  </td>
                  <td>{contact.company}</td>
                  <td>{contact.title}</td>
                  <td className="contact-email">{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit?.(contact)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete?.(contact.id)}
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
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>
    </div>
  );
};

export default ContactsTable;
