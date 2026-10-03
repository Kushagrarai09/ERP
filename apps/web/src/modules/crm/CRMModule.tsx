import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import { CRMDashboard } from './dashboard/CRMDashboard';
import { LeadsPage } from './leads/LeadsPage';
import { ContactsPage } from './contacts/ContactsPage';
import { CompaniesPage } from './companies/CompaniesPage';
import { DealsPage } from './deals/DealsPage';
import { useCRM } from './crmContext';

export type CRMTab = 'dashboard' | 'leads' | 'contacts' | 'companies' | 'deals';

interface CRMModuleProps {
  initialTab?: CRMTab;
}

export const CRMModule: React.FC<CRMModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<CRMTab>(initialTab);
  const { loading, error, reload } = useCRM();

  const tabs: { id: CRMTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'CRM Dashboard', icon: '📊' },
    { id: 'leads', label: 'Leads & Pipeline', icon: '🎯' },
    { id: 'contacts', label: 'Contacts', icon: '📇' },
    { id: 'companies', label: 'Companies (360°)', icon: '🏢' },
    { id: 'deals', label: 'Deals & Opportunities', icon: '🤝' },
  ];

  return (
    <AppShell>
      <div className="module-container">
        {loading && (
          <div className="module-banner info">
            <span className="banner-spinner"></span>
            <span>Loading CRM records...</span>
          </div>
        )}
        {error && (
          <div className="module-banner error">
            <span>{error}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => void reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Module Sub-Header Navigation */}
        <div className="module-subnav">
          <div className="module-subnav-left">
            <span className="module-brand-icon">👥</span>
            <div className="module-title-group">
              <h2 className="module-title">CRM & Accounts</h2>
              <span className="module-subtitle">Manage customer leads, contact directories, enterprise accounts & deal stages</span>
            </div>
          </div>

          <div className="module-tabs-list">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`module-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{t.icon}</span>
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Views */}
        <div className="module-tab-content">
          {activeTab === 'dashboard' && <CRMDashboard />}
          {activeTab === 'leads' && <LeadsPage />}
          {activeTab === 'contacts' && <ContactsPage />}
          {activeTab === 'companies' && <CompaniesPage />}
          {activeTab === 'deals' && <DealsPage />}
        </div>
      </div>
    </AppShell>
  );
};

export default CRMModule;
