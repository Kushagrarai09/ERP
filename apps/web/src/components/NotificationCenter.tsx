import React, { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Order Confirmed',
      message: 'Order #12345 has been confirmed',
      type: 'success',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'Inventory Low',
      message: 'Product SKU-001 is running low',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-center">
      <button
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="clear-btn" onClick={clearAll}>
                Clear All
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="empty-state">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.type} ${
                    notif.read ? 'read' : 'unread'
                  }`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                  </div>
                  <span className="notification-time">
                    {notif.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
