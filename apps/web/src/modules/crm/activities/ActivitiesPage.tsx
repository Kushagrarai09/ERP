import React from 'react';
import AppShell from '../../layouts/AppShell';
import Breadcrumb from '../../components/Breadcrumb';
import PageHeader from '../../components/PageHeader';
import ActivitiesList from '../../components/ActivitiesList';
import { Activity } from '../../types/crm';

export const ActivitiesPage: React.FC = () => {
  const handleAddActivity = () => {
    console.log('Add new activity');
  };

  const handleEditActivity = (activity: Activity) => {
    console.log('Edit activity:', activity);
  };

  const handleDeleteActivity = (activityId: string) => {
    console.log('Delete activity:', activityId);
  };

  const handleToggleComplete = (activityId: string) => {
    console.log('Toggle complete activity:', activityId);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CRM', href: '/crm' },
    { label: 'Activities' },
  ];

  const headerActions = (
    <button className="btn btn-primary" onClick={handleAddActivity}>
      + Add Activity
    </button>
  );

  return (
    <AppShell>
      <div className="activities-page">
        <PageHeader
          title="Activities"
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={headerActions}
        />

        <div className="page-content">
          <ActivitiesList
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </AppShell>
  );
};

export default ActivitiesPage;
