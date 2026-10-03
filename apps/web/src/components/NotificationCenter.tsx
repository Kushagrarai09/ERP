import React, { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Sales Order Confirmed',
      message: 'SO-00001 (Infosys) has been confirmed',
      type: 'success',
      timestamp: '10m ago',
      read: false,
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Enterprise License stock is below threshold',
      type: 'warning',
      timestamp: '1h ago',
      read: false,
    },
    {
      id: '3',
      title: 'Payment Received',
      message: '₹13,57,000 received for INV-00001',
      type: 'info',
      timestamp: '3h ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-center">
      <button
        className={`notification-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <div className="notification-title-group">
                <span className="notification-heading">Notifications</span>
                {unreadCount > 0 && <span className="unread-pill">{unreadCount} new</span>}
              </div>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button className="text-action-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button className="text-action-btn danger" onClick={clearAll}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <span className="empty-icon">🔔</span>
                  <p>All caught up! No new notifications.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'} notif-${notif.type}`}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                      );
                    }}
                  >
                    <div className="notification-item-dot" />
                    <div className="notification-item-content">
                      <div className="notif-top">
                        <span className="notif-title">{notif.title}</span>
                        <span className="notif-time">{notif.timestamp}</span>
                      </div>
                      <p className="notif-message">{notif.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
