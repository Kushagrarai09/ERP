import React from 'react';
import { Contact } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface ContactDetailModalProps {
  contact: Contact;
  onClose: () => void;
  onEdit: () => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  onClose,
  onEdit,
}) => {
  const { deals } = useCRM();

  // Related Deals
  const relatedDeals = deals.filter(
    (d) => d.contactId === contact.id || d.company.toLowerCase() === contact.company.toLowerCase()
  );

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
          maxWidth: '560px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              {contact.firstName} {contact.lastName}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              {contact.title} at <strong style={{ color: '#1E293B' }}>{contact.company}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Email Address</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{contact.email}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Phone Number</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{contact.phone}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Company Account</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB' }}>{contact.company}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Account Owner</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{contact.owner}</span>
          </div>
        </div>

        {/* Related Deals Section */}
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
            Associated Deals ({relatedDeals.length})
          </h4>
          {relatedDeals.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>No active deals linked to this contact.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedDeals.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.625rem 0.875rem',
                    background: '#F1F5F9',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{deal.name}</span>
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.125rem 0.375rem',
                        borderRadius: '4px',
                        background: '#DBEAFE',
                        color: '#1D4ED8',
                        textTransform: 'capitalize',
                      }}
                    >
                      {deal.stage}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#059669' }}>₹{deal.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <button
            onClick={() => {
              onClose();
              onEdit();
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#334155',
            }}
          >
            Edit Contact
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#F1F5F9',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#475569',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
