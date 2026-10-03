import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import Search from './Search';
import NotificationCenter from './NotificationCenter';
import UserMenu from './UserMenu';
import { useAuth } from '../auth/AuthContext';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const quickActions = [
    { label: 'New Lead', icon: '🎯', path: '/crm' },
    { label: 'New Quotation', icon: '📋', path: '/sales' },
    { label: 'New Sales Order', icon: '📦', path: '/sales' },
    { label: 'New Product', icon: '📱', path: '/inventory' },
    { label: 'New Purchase Order', icon: '📝', path: '/procurement' },
    { label: 'New Invoice', icon: '📄', path: '/finance' },
  ];

  return (
    <header className="topbar">
      {/* Left Section: Logo & Workspace */}
      <div className="topbar-left">
        <Link to="/dashboard" className="erp-logo-brand">
          <div className="logo-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div className="logo-text-group">
            <span className="logo-title">ERP PLATFORM</span>
            <span className="logo-subtext">Enterprise</span>
          </div>
        </Link>

        <div className="topbar-divider-vertical" />

        <WorkspaceSwitcher />
      </div>

      {/* Center Section: Global Search */}
      <div className="topbar-center">
        <Search />
      </div>

      {/* Right Section: Quick Create, Notifications, User Profile */}
      <div className="topbar-right">
        {/* Quick Create Dropdown */}
        <div className="quick-create-wrapper">
          <button
            className="create-btn"
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            title="Quick create"
          >
            <span className="create-btn-icon">+</span>
            <span className="create-btn-text">Create</span>
            <span className="create-btn-arrow">▾</span>
          </button>

          {isQuickCreateOpen && (
            <>
              <div className="dropdown-overlay" onClick={() => setIsQuickCreateOpen(false)} />
              <div className="quick-create-menu">
                <div className="quick-create-header">Quick Actions</div>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className="quick-action-item"
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      navigate(action.path);
                    }}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span className="action-label">{action.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <NotificationCenter />

        <div className="topbar-divider-vertical" />

        <UserMenu
          user={
            user
              ? {
                  name: user.name,
                  email: user.email,
                  avatar: user.name.slice(0, 2).toUpperCase(),
                  role: user.role,
                }
              : undefined
          }
          onLogout={logout}
        />
      </div>
    </header>
  );
};

export default Topbar;
