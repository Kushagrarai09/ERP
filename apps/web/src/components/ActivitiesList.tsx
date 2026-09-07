import React, { useState } from 'react';
import { Activity } from '../../types/crm';

interface ActivitiesListProps {
  activities?: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
  onToggleComplete?: (activityId: string) => void;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'call',
    subject: 'Follow-up with Acme Corp',
    description: 'Discussed pricing and timeline',
    relatedTo: '1',
    owner: 'Amit',
    date: new Date(Date.now() - 86400000),
    completed: true,
  },
  {
    id: '2',
    type: 'email',
    subject: 'Sent proposal to Globex',
    description: 'Sent detailed proposal for ₹75L deal',
    relatedTo: '2',
    owner: 'Ravi',
    date: new Date(Date.now() - 172800000),
    completed: true,
  },
  {
    id: '3',
    type: 'meeting',
    subject: 'Demo with TechCorp',
    description: 'Product demonstration scheduled',
    relatedTo: '3',
    owner: 'Amit',
    date: new Date(Date.now() + 172800000),
    completed: false,
  },
  {
    id: '4',
    type: 'task',
    subject: 'Prepare contract for StartUp',
    description: 'Draft legal documents',
    relatedTo: '4',
    owner: 'Ravi',
    date: new Date(Date.now() + 259200000),
    completed: false,
  },
  {
    id: '5',
    type: 'note',
    subject: 'Acme decision maker is John',
    description: 'Key contact for negotiations',
    relatedTo: '1',
    owner: 'Amit',
    date: new Date(),
    completed: false,
  },
];

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities = MOCK_ACTIVITIES,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [filterType, setFilterType] = useState<string>('');
  const [filterOwner, setFilterOwner] = useState<string>('');

  const filteredActivities = activities.filter(
    (activity) =>
      (!filterType || activity.type === filterType) &&
      (!filterOwner || activity.owner === filterOwner)
  );

  const activityTypes = Array.from(new Set(activities.map((a) => a.type)));
  const owners = Array.from(new Set(activities.map((a) => a.owner)));

  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      call: '☎️',
      email: '📧',
      meeting: '📅',
      task: '✓',
      note: '📝',
    };
    return icons[type] || '📌';
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;

    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="activities-container">
      {/* Filters */}
      <div className="activities-filters">
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
        >
          <option value="">All Owners</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
      </div>

      {/* Activities List */}
      <div className="activities-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <p>No activities found</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`activity-item ${activity.completed ? 'completed' : ''}`}
            >
              <div className="activity-checkbox">
                <input
                  type="checkbox"
                  checked={activity.completed}
                  onChange={() => onToggleComplete?.(activity.id)}
                  className="checkbox"
                />
              </div>

              <div className="activity-icon">{getActivityIcon(activity.type)}</div>

              <div className="activity-content">
                <h4 className="activity-subject">{activity.subject}</h4>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="meta-owner">{activity.owner}</span>
                  <span className="meta-date">{formatDate(activity.date)}</span>
                </div>
              </div>

              <div className="activity-actions">
                <button
                  className="action-btn edit"
                  onClick={() => onEdit?.(activity)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => onDelete?.(activity.id)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="results-info">
        Showing {filteredActivities.length} of {activities.length} activities
      </div>
    </div>
  );
};

export default ActivitiesList;
