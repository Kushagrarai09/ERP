import React, { createContext, useContext, useState } from 'react';
import { Lead, Contact, Company, Deal, Activity, ConvertLeadPayload, DealStage, LeadStatus } from '../../types/crm';
import { MOCK_LEADS, MOCK_CONTACTS, MOCK_COMPANIES, MOCK_DEALS, MOCK_ACTIVITIES } from '../../mock-data/crm';

interface CRMContextType {
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  activities: Activity[];

  // Lead CRUD & Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLead: (payload: ConvertLeadPayload) => { contactId?: string; companyId?: string; dealId?: string };

  // Contact CRUD
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Company CRUD
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => Company;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Deal CRUD & Stage Movement
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Deal;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  updateDealStage: (id: string, stage: DealStage) => void;
  deleteDeal: (id: string) => void;

  // Activity Actions
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => Activity;
  toggleActivity: (id: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  // --- LEADS ---
  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateLead = (id: string, updatedFields: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updatedFields } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  // LEAD CONVERSION WORKFLOW
  const convertLead = (payload: ConvertLeadPayload) => {
    const targetLead = leads.find((l) => l.id === payload.leadId);
    if (!targetLead) return {};

    let createdCompanyId: string | undefined = undefined;
    let createdContactId: string | undefined = undefined;
    let createdDealId: string | undefined = undefined;

    // 1. Create Company if requested
    if (payload.createCompany) {
      const existingComp = companies.find(
        (c) => c.name.toLowerCase() === targetLead.company.toLowerCase()
      );
      if (existingComp) {
        createdCompanyId = existingComp.id;
      } else {
        const newComp: Company = {
          id: `comp-${Date.now()}`,
          name: targetLead.company,
          industry: payload.industry || 'General',
          employees: 10,
          email: targetLead.email,
          phone: targetLead.phone || '',
          owner: targetLead.owner,
          createdAt: new Date(),
        };
        setCompanies((prev) => [newComp, ...prev]);
        createdCompanyId = newComp.id;
      }
    }

    // 2. Create Contact if requested
    if (payload.createContact) {
      const nameParts = targetLead.name.trim().split(' ');
      const firstName = nameParts[0] || targetLead.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      const newContact: Contact = {
        id: `cnt-${Date.now()}`,
        firstName,
        lastName,
        email: targetLead.email,
        phone: targetLead.phone || '',
        company: targetLead.company,
        companyId: createdCompanyId,
        title: payload.contactTitle || targetLead.title || 'Lead Contact',
        owner: targetLead.owner,
        createdAt: new Date(),
      };
      setContacts((prev) => [newContact, ...prev]);
      createdContactId = newContact.id;
    }

    // 3. Create Deal if requested
    if (payload.createDeal) {
      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        name: payload.dealName || `${targetLead.company} - Deal`,
        company: targetLead.company,
        companyId: createdCompanyId,
        contactId: createdContactId,
        value: payload.dealValue || targetLead.value || 100000,
        currency: '₹',
        stage: payload.dealStage || 'qualification',
        probability: payload.dealStage === 'qualification' ? 40 : 20,
        owner: targetLead.owner,
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
      };
      setDeals((prev) => [newDeal, ...prev]);
      createdDealId = newDeal.id;
    }

    // 4. Mark Lead as converted
    updateLead(targetLead.id, {
      status: 'converted',
      convertedCompanyId: createdCompanyId,
      convertedContactId: createdContactId,
      convertedDealId: createdDealId,
    });

    // Add activity record
    const conversionActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'task',
      subject: `Converted Lead: ${targetLead.name}`,
      description: `Lead converted into Contact, Company & Deal.`,
      relatedTo: targetLead.id,
      relatedType: 'lead',
      owner: targetLead.owner,
      date: new Date(),
      completed: true,
    };
    setActivities((prev) => [conversionActivity, ...prev]);

    return {
      companyId: createdCompanyId,
      contactId: createdContactId,
      dealId: createdDealId,
    };
  };

  // --- CONTACTS ---
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt'>): Contact => {
    const newContact: Contact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      createdAt: new Date(),
    };
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // --- COMPANIES ---
  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt'>): Company => {
    const newCompany: Company = {
      ...companyData,
      id: `comp-${Date.now()}`,
      createdAt: new Date(),
    };
    setCompanies((prev) => [newCompany, ...prev]);
    return newCompany;
  };

  const updateCompany = (id: string, updatedFields: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, ...updatedFields } : comp))
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((comp) => comp.id !== id));
  };

  // --- DEALS ---
  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt'>): Deal => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date(),
    };
    setDeals((prev) => [newDeal, ...prev]);
    return newDeal;
  };

  const updateDeal = (id: string, updatedFields: Partial<Deal>) => {
    setDeals((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, ...updatedFields } : deal))
    );
  };

  const updateDealStage = (id: string, stage: DealStage) => {
    let probability = 50;
    if (stage === 'new') probability = 20;
    if (stage === 'qualification') probability = 40;
    if (stage === 'proposal') probability = 60;
    if (stage === 'negotiation') probability = 80;
    if (stage === 'won') probability = 100;
    if (stage === 'lost') probability = 0;

    setDeals((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, stage, probability } : deal))
    );
  };

  const deleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  // --- ACTIVITIES ---
  const addActivity = (activityData: Omit<Activity, 'id' | 'date'>): Activity => {
    const newAct: Activity = {
      ...activityData,
      id: `act-${Date.now()}`,
      date: new Date(),
    };
    setActivities((prev) => [newAct, ...prev]);
    return newAct;
  };

  const toggleActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        contacts,
        companies,
        deals,
        activities,
        addLead,
        updateLead,
        deleteLead,
        convertLead,
        addContact,
        updateContact,
        deleteContact,
        addCompany,
        updateCompany,
        deleteCompany,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addActivity,
        toggleActivity,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
