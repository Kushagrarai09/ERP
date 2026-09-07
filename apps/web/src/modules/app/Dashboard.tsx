import React, { useState } from 'react';
import AppShell from '../../layouts/AppShell';
import Breadcrumb from '../../components/Breadcrumb';
import PageHeader from '../../components/PageHeader';
import DashboardKPICard from '../../components/DashboardKPICard';
import RevenueChart from '../../components/RevenueChart';
import SalesFunnel from '../../components/SalesFunnel';
import RecentOrdersTable from '../../components/RecentOrdersTable';
import LowStockAlert from '../../components/LowStockAlert';

export const Dashboard: React.FC = () => {
  const [userName] = useState('Kushagra');

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard' },
  ];

  const handleCreateNew = () => {
    console.log('Create new clicked');
  };

  const handleImport = () => {
    console.log('Import clicked');
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  const headerActions = (
    <div className="header-actions">
      <button className="btn btn-primary" onClick={handleCreateNew}>
        + Create
      </button>
      <button className="btn btn-secondary" onClick={handleImport}>
        Import
      </button>
      <button className="btn btn-secondary" onClick={handleExport}>
        Export
      </button>
    </div>
  );

  return (
    <AppShell>
      <div className="dashboard-page">
        <PageHeader
          title={`Good morning, ${userName}`}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={headerActions}
        />

        {/* KPI Cards */}
        <section className="dashboard-kpis">
          <DashboardKPICard
            title="Revenue"
            value="₹24.5L"
            trend={{ percentage: 12.5, isPositive: true }}
            icon="📊"
            color="blue"
          />
          <DashboardKPICard
            title="Orders"
            value="1,284"
            trend={{ percentage: 8.2, isPositive: true }}
            icon="📦"
            color="green"
          />
          <DashboardKPICard
            title="Customers"
            value="2,840"
            trend={{ percentage: 15, isPositive: true }}
            icon="👥"
            color="orange"
          />
          <DashboardKPICard
            title="Inventory"
            value="₹18.2L"
            trend={{ percentage: 3.2, isPositive: false }}
            icon="📦"
            color="red"
          />
        </section>

        {/* Charts Row */}
        <section className="dashboard-charts">
          <div className="chart-wrapper">
            <RevenueChart title="Revenue Overview" />
          </div>
          <div className="chart-wrapper">
            <SalesFunnel title="Sales Funnel" />
          </div>
        </section>

        {/* Tables Row */}
        <section className="dashboard-tables">
          <div className="table-wrapper">
            <RecentOrdersTable title="Recent Orders" />
          </div>
          <div className="table-wrapper">
            <LowStockAlert title="Low Stock" />
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default Dashboard;
