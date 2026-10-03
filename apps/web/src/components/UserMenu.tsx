import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserMenuProps {
  user?: User;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user = {
    name: 'Administrator',
    email: 'admin@techvision.com',
    avatar: 'AD',
    role: 'ADMIN',
  },
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="user-menu">
      <button
        className="user-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="User profile and settings"
      >
        <div className="avatar-circle">{user.avatar}</div>
        <div className="user-menu-info-desktop">
          <span className="user-menu-name">{user.name}</span>
          <span className="user-menu-role-badge">{user.role}</span>
        </div>
        <span className="user-menu-chevron">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="user-menu-panel">
            {/* Header / User Card */}
            <div className="user-profile-header">
              <div className="avatar-circle-large">{user.avatar}</div>
              <div className="profile-details">
                <div className="profile-name">{user.name}</div>
                <div className="profile-email">{user.email}</div>
                <div className="profile-badge-row">
                  <span className="role-tag">{user.role}</span>
                  <span className="org-tag">Online</span>
                </div>
              </div>
            </div>

            <div className="menu-divider" />

            {/* Menu Links */}
            <div className="menu-items-group">
              <button
                className="menu-action-link"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard');
                }}
              >
                <span className="menu-icon">📊</span>
                <span className="menu-label">Main Dashboard</span>
              </button>
              <button
                className="menu-action-link"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/crm');
                }}
              >
                <span className="menu-icon">👥</span>
                <span className="menu-label">CRM Workspace</span>
              </button>
              <button
                className="menu-action-link"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/sales');
                }}
              >
                <span className="menu-icon">💰</span>
                <span className="menu-label">Sales & Orders</span>
              </button>
              <button
                className="menu-action-link"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/inventory');
                }}
              >
                <span className="menu-icon">📦</span>
                <span className="menu-label">Inventory Matrix</span>
              </button>
              <button
                className="menu-action-link"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/finance');
                }}
              >
                <span className="menu-icon">💳</span>
                <span className="menu-label">Finance & Invoices</span>
              </button>
            </div>

            <div className="menu-divider" />

            {/* Logout Action */}
            <div className="menu-footer">
              <button
                type="button"
                className="logout-action-btn"
                onClick={() => {
                  setIsOpen(false);
                  onLogout?.();
                }}
              >
                <span className="logout-icon">🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
