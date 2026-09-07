import React, { useState } from 'react';
import { Contact } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface ContactFormModalProps {
  contact?: Contact | null;
  onClose: () => void;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({ contact, onClose }) => {
  const { addContact, updateContact, companies } = useCRM();

  const [firstName, setFirstName] = useState(contact?.firstName || '');
  const [lastName, setLastName] = useState(contact?.lastName || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [company, setCompany] = useState(contact?.company || '');
  const [title, setTitle] = useState(contact?.title || '');
  const [owner, setOwner] = useState(contact?.owner || 'Amit Sharma');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCompany = companies.find((c) => c.name.toLowerCase() === company.toLowerCase());

    if (contact) {
      updateContact(contact.id, {
        firstName,
        lastName,
        email,
        phone,
        company,
        companyId: matchedCompany?.id || contact.companyId,
        title,
        owner,
      });
    } else {
      addContact({
        firstName,
        lastName,
        email,
        phone,
        company,
        companyId: matchedCompany?.id,
        title,
        owner,
      });
    }
    onClose();
  };

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
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.75rem',
          maxWidth: '520px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {contact ? 'Edit Contact' : 'Create New Contact'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Account Owner
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                background: '#3B82F6',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {contact ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
