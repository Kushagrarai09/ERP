import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface SidebarChild {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

interface SidebarCategory {
  id: string;
  label: string;
  icon: string;
  href: string;
  children?: SidebarChild[];
}

interface SidebarSection {
  title: string;
  items: SidebarCategory[];
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'crm',
    'sales',
    'inventory',
    'procurement',
    'finance',
  ]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sections: SidebarSection[] = [
    {
      title: 'CORE MODULES',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: '📊',
          href: '/dashboard',
        },
        {
          id: 'crm',
          label: 'CRM & Accounts',
          icon: '👥',
          href: '/crm',
          children: [
            { id: 'leads', label: 'Leads & Pipeline', icon: '🎯', href: '/crm' },
            { id: 'contacts', label: 'Contacts', icon: '📇', href: '/crm' },
            { id: 'companies', label: 'Companies (360°)', icon: '🏢', href: '/crm' },
            { id: 'deals', label: 'Deals & Opportunities', icon: '🤝', href: '/crm' },
          ],
        },
        {
          id: 'sales',
          label: 'Sales & Orders',
          icon: '💰',
          href: '/sales',
          children: [
            { id: 'quotations', label: 'Quotations', icon: '📋', href: '/sales' },
            { id: 'orders', label: 'Sales Orders', icon: '📦', href: '/sales' },
            { id: 'customers', label: 'Customers', icon: '🛍️', href: '/sales' },
          ],
        },
        {
          id: 'inventory',
          label: 'Inventory & Stock',
          icon: '📦',
          href: '/inventory',
          children: [
            { id: 'products', label: 'Products Catalog', icon: '📱', href: '/inventory' },
            { id: 'warehouses', label: 'Warehouses', icon: '🏭', href: '/inventory' },
            { id: 'stock', label: 'Stock Matrix', icon: '📈', href: '/inventory' },
            { id: 'movements', label: 'Stock Movements', icon: '🔄', href: '/inventory' },
          ],
        },
        {
          id: 'procurement',
          label: 'Procurement & PO',
          icon: '🔗',
          href: '/procurement',
          children: [
            { id: 'suppliers', label: 'Suppliers', icon: '🤝', href: '/procurement' },
            { id: 'orders', label: 'Purchase Orders', icon: '📝', href: '/procurement' },
            { id: 'receipts', label: 'Goods Receipts', icon: '📬', href: '/procurement' },
          ],
        },
        {
          id: 'finance',
          label: 'Finance & Accounts',
          icon: '💳',
          href: '/finance',
          children: [
            { id: 'invoices', label: 'Invoices', icon: '📄', href: '/finance' },
            { id: 'payments', label: 'Payments', icon: '💸', href: '/finance' },
            { id: 'expenses', label: 'Expenses', icon: '📉', href: '/finance' },
            { id: 'accounts', label: 'Chart of Accounts', icon: '🏛️', href: '/finance' },
          ],
        },
      ],
    },
    {
      title: 'ORGANIZATION',
      items: [
        {
          id: 'admin',
          label: 'Administration',
          icon: '🔐',
          href: '/dashboard',
          children: [
            { id: 'team', label: 'Team Members', icon: '👥', href: '/dashboard', badge: 'Admin' },
            { id: 'roles', label: 'Roles & RBAC', icon: '🔑', href: '/dashboard' },
            { id: 'settings', label: 'Workspace Settings', icon: '⚙️', href: '/dashboard' },
          ],
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-header-branding">
            <span className="sidebar-badge">ERP SUITE</span>
            <span className="sidebar-title">NAVIGATION</span>
          </div>
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="sidebar-group">
            {!isCollapsed && <div className="sidebar-group-title">{section.title}</div>}

            {section.items.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isExpanded = expandedItems.includes(item.id);
              const isActive =
                item.href === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.href);

              return (
                <div key={item.id} className="sidebar-section">
                  {hasChildren ? (
                    <div className="sidebar-category-wrapper">
                      <button
                        className={`sidebar-category ${isExpanded ? 'expanded' : ''} ${
                          isActive ? 'active' : ''
                        }`}
                        onClick={() => toggleExpand(item.id)}
                        title={item.label}
                      >
                        <div className="sidebar-category-left">
                          <span className="nav-icon">{item.icon}</span>
                          {!isCollapsed && <span className="nav-label">{item.label}</span>}
                        </div>
                        {!isCollapsed && (
                          <span className="expand-indicator">{isExpanded ? '▾' : '▸'}</span>
                        )}
                      </button>

                      {/* Submenu */}
                      {isExpanded && !isCollapsed && item.children && (
                        <div className="sidebar-submenu">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.id}
                              to={child.href}
                              className={({ isActive: subActive }) =>
                                `sidebar-sublink ${subActive && child.href === item.href ? 'active' : ''}`
                              }
                            >
                              <span className="subnav-icon">{child.icon}</span>
                              <span className="subnav-label">{child.label}</span>
                              {child.badge && <span className="subnav-badge">{child.badge}</span>}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive: linkActive }) =>
                        `sidebar-link ${linkActive ? 'active' : ''}`
                      }
                      title={item.label}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar-small">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="user-info-text">
              <span className="user-name-label">{user?.name || 'Administrator'}</span>
              <span className="user-role-tag">{user?.role || 'ADMIN'}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
