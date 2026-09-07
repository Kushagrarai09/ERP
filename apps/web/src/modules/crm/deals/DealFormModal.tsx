import React, { useState } from 'react';
import { Deal, DealStage } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface DealFormModalProps {
  deal?: Deal | null;
  onClose: () => void;
}

export const DealFormModal: React.FC<DealFormModalProps> = ({ deal, onClose }) => {
  const { addDeal, updateDeal, companies, contacts } = useCRM();

  const [name, setName] = useState(deal?.name || '');
  const [company, setCompany] = useState(deal?.company || '');
  const [value, setValue] = useState<number>(deal?.value || 250000);
  const [stage, setStage] = useState<DealStage>(deal?.stage || 'qualification');
  const [probability, setProbability] = useState<number>(deal?.probability || 50);
  const [owner, setOwner] = useState(deal?.owner || 'Amit Sharma');
  const [closingDate, setClosingDate] = useState<string>(
    deal?.closingDate
      ? new Date(deal.closingDate).toISOString().substring(0, 10)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [description, setDescription] = useState(deal?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedComp = companies.find((c) => c.name.toLowerCase() === company.toLowerCase());
    const matchedCnt = contacts.find((c) => c.company.toLowerCase() === company.toLowerCase());

    if (deal) {
      updateDeal(deal.id, {
        name,
        company,
        companyId: matchedComp?.id || deal.companyId,
        contactId: matchedCnt?.id || deal.contactId,
        value,
        stage,
        probability,
        owner,
        closingDate: new Date(closingDate),
        description,
      });
    } else {
      addDeal({
        name,
        company,
        companyId: matchedComp?.id,
        contactId: matchedCnt?.id,
        value,
        currency: '₹',
        stage,
        probability,
        owner,
        closingDate: new Date(closingDate),
        description,
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
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
            {deal ? 'Edit Sales Deal' : 'Create New Sales Deal'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Deal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
            />
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
                Deal Value (₹) *
              </label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Pipeline Stage *
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              >
                <option value="new">New</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Probability % (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Expected Closing Date
              </label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Deal Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              Description / Scope
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {deal ? 'Save Changes' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
