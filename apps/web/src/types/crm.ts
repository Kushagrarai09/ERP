// CRM Types & Specifications

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'cold-call' | 'email' | 'social' | 'event';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  title?: string;
  status: LeadStatus;
  score: number; // 0-100
  source: LeadSource;
  owner: string;
  createdAt: Date;
  value?: number;
  notes?: string;
  convertedContactId?: string;
  convertedCompanyId?: string;
  convertedDealId?: string;
}

export type DealStage = 'new' | 'qualification' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  name: string;
  company: string;
  companyId?: string;
  contactId?: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number; // 0-100
  owner: string;
  closingDate: Date;
  description?: string;
  createdAt: Date;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  companyId?: string;
  title: string;
  owner: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue?: string;
  website?: string;
  email: string;
  phone: string;
  owner: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description: string;
  relatedTo: string; // Lead, Contact, Company, or Deal ID
  relatedType?: 'lead' | 'contact' | 'company' | 'deal';
  owner: string;
  date: Date;
  completed: boolean;
}

export interface ConvertLeadPayload {
  leadId: string;
  createContact: boolean;
  contactTitle?: string;
  createCompany: boolean;
  industry?: string;
  createDeal: boolean;
  dealName?: string;
  dealValue?: number;
  dealStage?: DealStage;
}
