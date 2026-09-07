import React, { useState } from 'react';
import { Lead, LeadSource, LeadStatus } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface LeadFormModalProps {
  lead?: Lead | null;
  onClose: () => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ lead, onClose }) => {
  const { addLead, updateLead } = useCRM();

  const [name, setName] = useState(lead?.name || '');
  const [company, setCompany] = useState(lead?.company || '');
  const [email, setEmail] = useState(lead?.email || '');
  const [phone, setPhone] = useState(lead?.phone || '');
  const [title, setTitle] = useState(lead?.title || '');
  const [status, setStatus] = useState<LeadStatus>(lead?.status || 'new');
  const [score, setScore] = useState<number>(lead?.score || 50);
  const [source, setSource] = useState<LeadSource>(lead?.source || 'website');
  const [owner, setOwner] = useState(lead?.owner || 'Amit Sharma');
  const [value, setValue] = useState<number>(lead?.value || 100000);
  const [notes, setNotes] = useState(lead?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lead) {
      updateLead(lead.id, {
        name,
        company,
        email,
        phone,
        title,
        status,
        score,
        source,
        owner,
        value,
        notes,
      });
    } else {
      addLead({
        name,
        company,
        email,
        phone,
        title,
        status,
        score,
        source,
        owner,
        value,
        notes,
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
          maxWidth: '540px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {lead ? 'Edit Lead' : 'Create New Lead'}
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
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
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
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Job Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Est. Deal Value (₹)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold-call">Cold Call</option>
                <option value="email">Email</option>
                <option value="social">Social</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Lead Score (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Owner
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Notes / Description
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              {lead ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
