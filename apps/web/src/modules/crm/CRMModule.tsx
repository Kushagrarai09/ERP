import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { CRMProvider } from './crmContext';
import { CRMDashboard } from './dashboard/CRMDashboard';
import { LeadsPage } from './leads/LeadsPage';
import { ContactsPage } from './contacts/ContactsPage';
import { CompaniesPage } from './companies/CompaniesPage';
import { DealsPage } from './deals/DealsPage';

export type CRMTab = 'dashboard' | 'leads' | 'contacts' | 'companies' | 'deals';

interface CRMModuleProps {
  initialTab?: CRMTab;
}

export const CRMModule: React.FC<CRMModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<CRMTab>(initialTab);

  const tabs: { id: CRMTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'CRM Dashboard', icon: '📊' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'contacts', label: 'Contacts', icon: '📇' },
    { id: 'companies', label: 'Companies (360°)', icon: '🏢' },
    { id: 'deals', label: 'Deals & Pipeline', icon: '🤝' },
  ];

  return (
    <AppShell>
      <CRMProvider>
        {/* Module Sub-Header Navigation */}
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.id ? '3px solid #3B82F6' : '3px solid transparent',
                color: activeTab === t.id ? '#2563EB' : '#64748B',
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'dashboard' && <CRMDashboard />}
          {activeTab === 'leads' && <LeadsPage />}
          {activeTab === 'contacts' && <ContactsPage />}
          {activeTab === 'companies' && <CompaniesPage />}
          {activeTab === 'deals' && <DealsPage />}
        </div>
      </CRMProvider>
    </AppShell>
  );
};

export default CRMModule;
