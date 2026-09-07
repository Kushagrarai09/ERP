import React, { useState } from 'react';
import { Lead, DealStage } from '../../../types/crm';
import { useCRM } from '../crmContext';

interface ConvertLeadModalProps {
  lead: Lead;
  onClose: () => void;
}

export const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({ lead, onClose }) => {
  const { convertLead } = useCRM();

  const [createContact, setCreateContact] = useState(true);
  const [contactTitle, setContactTitle] = useState(lead.title || 'Decision Maker');

  const [createCompany, setCreateCompany] = useState(true);
  const [industry, setIndustry] = useState('Technology');

  const [createDeal, setCreateDeal] = useState(true);
  const [dealName, setDealName] = useState(`${lead.company} - Expansion Deal`);
  const [dealValue, setDealValue] = useState<number>(lead.value || 250000);
  const [dealStage, setDealStage] = useState<DealStage>('qualification');

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    convertLead({
      leadId: lead.id,
      createContact,
      contactTitle,
      createCompany,
      industry,
      createDeal,
      dealName,
      dealValue,
      dealStage,
    });
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
          maxWidth: '560px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
              Convert Lead: {lead.name}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
              Transform this qualified lead into a Contact, Company account, and active Deal.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleConvert} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Contact Section */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#F8FAFC' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={createContact}
                onChange={(e) => setCreateContact(e.target.checked)}
              />
              Create Contact Person ({lead.name})
            </label>
            {createContact && (
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            )}
          </div>

          {/* Company Section */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#F8FAFC' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={createCompany}
                onChange={(e) => setCreateCompany(e.target.checked)}
              />
              Create Company Account ({lead.company})
            </label>
            {createCompany && (
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="Technology">Technology</option>
                  <option value="Software">Software</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>
            )}
          </div>

          {/* Deal Section */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#F8FAFC' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={createDeal}
                onChange={(e) => setCreateDeal(e.target.checked)}
              />
              Create Sales Deal
            </label>
            {createDeal && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Deal Name
                  </label>
                  <input
                    type="text"
                    value={dealName}
                    onChange={(e) => setDealName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                      Deal Value (₹)
                    </label>
                    <input
                      type="number"
                      value={dealValue}
                      onChange={(e) => setDealValue(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                      Stage
                    </label>
                    <select
                      value={dealStage}
                      onChange={(e) => setDealStage(e.target.value as DealStage)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.875rem',
                      }}
                    >
                      <option value="new">New</option>
                      <option value="qualification">Qualification</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
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
                background: '#10B981',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Convert Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
