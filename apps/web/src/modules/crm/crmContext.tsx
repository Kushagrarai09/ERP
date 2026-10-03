import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Activity, Company, Contact, ConvertLeadPayload, Deal, DealStage, Lead, LeadStatus } from '../../types/crm';

interface CRMContextType {
  leads: Lead[]; contacts: Contact[]; companies: Company[]; deals: Deal[]; activities: Activity[];
  loading: boolean; error: string | null; reload: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<Lead | undefined>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertLead: (payload: ConvertLeadPayload) => Promise<{ contactId?: string; companyId?: string; dealId?: string }>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Promise<Contact | undefined>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => Promise<Company | undefined>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Promise<Deal | undefined>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
  updateDealStage: (id: string, stage: DealStage) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => Promise<Activity | undefined>;
  toggleActivity: (id: string) => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);
const stageToApi: Record<DealStage, string> = { new: 'DISCOVERY', qualification: 'DISCOVERY', proposal: 'PROPOSAL', negotiation: 'NEGOTIATION', won: 'WON', lost: 'LOST' };
const stageFromApi: Record<string, DealStage> = { DISCOVERY: 'qualification', PROPOSAL: 'proposal', NEGOTIATION: 'negotiation', WON: 'won', LOST: 'lost' };
const statusFromApi: Record<string, LeadStatus> = { NEW: 'new', CONTACTED: 'contacted', QUALIFIED: 'qualified', PROPOSAL: 'qualified', NEGOTIATION: 'qualified', LOST: 'lost', CONVERTED: 'converted' };
const mapCompany = (item: any): Company => ({ id: item.id, name: item.name, industry: item.industry || 'General', employees: item.employeeCount || 0, revenue: item.revenue?.toString(), website: item.website || '', email: item.email || '', phone: item.phone || '', owner: item.ownerName || 'Unassigned', createdAt: new Date(item.createdAt) });
const mapContact = (item: any): Contact => ({ id: item.id, firstName: item.firstName, lastName: item.lastName, email: item.email || '', phone: item.phone || '', company: item.company?.name || item.companyId || '', companyId: item.companyId, title: item.title || '', owner: 'Unassigned', createdAt: new Date(item.createdAt) });
const mapLead = (item: any): Lead => ({ id: item.id, name: item.title, company: item.company?.name || item.companyId || '', email: item.email || '', phone: item.phone, title: item.title, status: statusFromApi[item.status] || 'new', score: item.status === 'QUALIFIED' ? 75 : 25, source: item.source || 'website', owner: 'Unassigned', createdAt: new Date(item.createdAt), value: item.budget ? Number(item.budget) : undefined, convertedCompanyId: item.companyId, convertedContactId: item.contactId });
const mapDeal = (item: any): Deal => ({ id: item.id, name: item.title, company: item.company?.name || item.companyId, companyId: item.companyId, contactId: item.contactId, value: Number(item.value), currency: '₹', stage: stageFromApi[item.stage] || 'qualification', probability: item.probability, owner: 'Unassigned', closingDate: item.expectedCloseDate ? new Date(item.expectedCloseDate) : new Date(), createdAt: new Date(item.createdAt) });
const mapActivity = (item: any): Activity => ({ id: item.id, type: (item.type || 'NOTE').toLowerCase() as Activity['type'], subject: item.title, description: item.description || '', relatedTo: item.dealId || '', relatedType: item.dealId ? 'deal' : undefined, owner: 'Unassigned', date: new Date(item.dueDate || item.createdAt), completed: Boolean(item.completedDate) });

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]); const [contacts, setContacts] = useState<Contact[]>([]); const [companies, setCompanies] = useState<Company[]>([]); const [deals, setDeals] = useState<Deal[]>([]); const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const run = async <T,>(operation: () => Promise<T>) => { try { setError(null); return await operation(); } catch (caught) { setError(caught instanceof Error ? caught.message : 'CRM request failed'); return undefined; } };
  const reload = async () => { setLoading(true); setError(null); try { const [leadData, contactData, companyData, dealData, activityData] = await Promise.all([api.get<any[]>('/leads'), api.get<any[]>('/contacts'), api.get<any[]>('/companies'), api.get<any[]>('/deals'), api.get<any[]>('/activities')]); setLeads(leadData.map(mapLead)); setContacts(contactData.map(mapContact)); setCompanies(companyData.map(mapCompany)); setDeals(dealData.map(mapDeal)); setActivities(activityData.map(mapActivity)); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load CRM data'); } finally { setLoading(false); } };
  useEffect(() => { void reload(); }, []);
  const addLead = async (data: Omit<Lead, 'id' | 'createdAt'>) => { const item = await run(() => api.post<any>('/leads', { title: data.name, email: data.email, phone: data.phone, status: data.status.toUpperCase(), source: data.source, budget: data.value })); if (item) { const mapped = mapLead(item); setLeads((current) => [mapped, ...current]); return mapped; } };
  const updateLead = async (id: string, data: Partial<Lead>) => { await run(() => api.patch(`/leads/${id}`, { title: data.name, email: data.email, phone: data.phone, status: data.status?.toUpperCase(), source: data.source, budget: data.value })); await reload(); };
  const deleteLead = async (id: string) => { await run(() => api.delete(`/leads/${id}`)); setLeads((current) => current.filter((item) => item.id !== id)); };
  const convertLead = async (payload: ConvertLeadPayload) => { const result = await run(() => api.post<any>(`/leads/${payload.leadId}/convert`, { ...payload, dealValue: payload.dealValue || 0 })); await reload(); return { companyId: result?.company?.id, contactId: result?.contact?.id, dealId: result?.deal?.id }; };
  const addContact = async (data: Omit<Contact, 'id' | 'createdAt'>) => { const item = await run(() => api.post<any>('/contacts', { ...data, companyId: data.companyId })); if (item) { const mapped = mapContact(item); setContacts((current) => [mapped, ...current]); return mapped; } };
  const updateContact = async (id: string, data: Partial<Contact>) => { await run(() => api.patch(`/contacts/${id}`, data)); await reload(); };
  const deleteContact = async (id: string) => { await run(() => api.delete(`/contacts/${id}`)); setContacts((current) => current.filter((item) => item.id !== id)); };
  const addCompany = async (data: Omit<Company, 'id' | 'createdAt'>) => { const item = await run(() => api.post<any>('/companies', { ...data, employeeCount: data.employees, ownerName: data.owner })); if (item) { const mapped = mapCompany(item); setCompanies((current) => [mapped, ...current]); return mapped; } };
  const updateCompany = async (id: string, data: Partial<Company>) => { await run(() => api.patch(`/companies/${id}`, { ...data, employeeCount: data.employees, ownerName: data.owner })); await reload(); };
  const deleteCompany = async (id: string) => { await run(() => api.delete(`/companies/${id}`)); setCompanies((current) => current.filter((item) => item.id !== id)); };
  const addDeal = async (data: Omit<Deal, 'id' | 'createdAt'>) => { const item = await run(() => api.post<any>('/deals', { title: data.name, value: data.value, probability: data.probability, stage: stageToApi[data.stage], expectedCloseDate: data.closingDate, companyId: data.companyId })); if (item) { const mapped = mapDeal(item); setDeals((current) => [mapped, ...current]); return mapped; } };
  const updateDeal = async (id: string, data: Partial<Deal>) => { await run(() => api.patch(`/deals/${id}`, { title: data.name, value: data.value, probability: data.probability, stage: data.stage && stageToApi[data.stage], expectedCloseDate: data.closingDate, companyId: data.companyId })); await reload(); };
  const updateDealStage = async (id: string, stage: DealStage) => updateDeal(id, { stage });
  const deleteDeal = async (id: string) => { await run(() => api.delete(`/deals/${id}`)); setDeals((current) => current.filter((item) => item.id !== id)); };
  const addActivity = async (data: Omit<Activity, 'id' | 'date'>) => { const item = await run(() => api.post<any>('/activities', { title: data.subject, description: data.description, type: data.type.toUpperCase(), dealId: data.relatedType === 'deal' ? data.relatedTo : undefined, completedDate: data.completed ? new Date() : undefined })); if (item) { const mapped = mapActivity(item); setActivities((current) => [mapped, ...current]); return mapped; } };
  const toggleActivity = async (id: string) => { const current = activities.find((item) => item.id === id); await run(() => api.patch(`/activities/${id}`, { completedDate: current?.completed ? null : new Date() })); await reload(); };
  return <CRMContext.Provider value={{ leads, contacts, companies, deals, activities, loading, error, reload, addLead, updateLead, deleteLead, convertLead, addContact, updateContact, deleteContact, addCompany, updateCompany, deleteCompany, addDeal, updateDeal, updateDealStage, deleteDeal, addActivity, toggleActivity }}>{children}</CRMContext.Provider>;
};

export const useCRM = () => { const context = useContext(CRMContext); if (!context) throw new Error('useCRM must be used within a CRMProvider'); return context; };
