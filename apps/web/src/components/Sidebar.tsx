import React, { useState } from 'react';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  category?: string;
  children?: SidebarItem[];
}

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['crm', 'sales', 'inventory']);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const menuItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '⌂',
      href: '/dashboard',
    },

    // CRM
    {
      id: 'crm',
      label: 'CRM',
      icon: '👥',
      href: '/crm',
      category: 'crm',
      children: [
        { id: 'leads', label: 'Leads', icon: '🎯', href: '/crm/leads' },
        { id: 'contacts', label: 'Contacts', icon: '📇', href: '/crm/contacts' },
        { id: 'companies', label: 'Companies', icon: '🏢', href: '/crm/companies' },
        { id: 'deals', label: 'Deals', icon: '🤝', href: '/crm/deals' },
        { id: 'activities', label: 'Activities', icon: '📅', href: '/crm/activities' },
      ],
    },

    // SALES
    {
      id: 'sales',
      label: 'SALES',
      icon: '💰',
      href: '/sales',
      category: 'sales',
      children: [
        { id: 'quotations', label: 'Quotations', icon: '📋', href: '/sales/quotations' },
        { id: 'sales-orders', label: 'Sales Orders', icon: '📦', href: '/sales/orders' },
        { id: 'customers', label: 'Customers', icon: '🛍️', href: '/sales/customers' },
        { id: 'pricing', label: 'Pricing', icon: '💳', href: '/sales/pricing' },
      ],
    },

    // INVENTORY
    {
      id: 'inventory',
      label: 'INVENTORY',
      icon: '📦',
      href: '/inventory',
      category: 'inventory',
      children: [
        { id: 'products', label: 'Products', icon: '📱', href: '/inventory/products' },
        { id: 'categories', label: 'Categories', icon: '🏷️', href: '/inventory/categories' },
        { id: 'warehouses', label: 'Warehouses', icon: '🏭', href: '/inventory/warehouses' },
        { id: 'stock', label: 'Stock', icon: '📊', href: '/inventory/stock' },
        { id: 'movements', label: 'Stock Movements', icon: '🔄', href: '/inventory/movements' },
        { id: 'transfers', label: 'Transfers', icon: '🚚', href: '/inventory/transfers' },
      ],
    },

    // PROCUREMENT
    {
      id: 'procurement',
      label: 'PROCUREMENT',
      icon: '🔗',
      href: '/procurement',
      category: 'procurement',
      children: [
        { id: 'suppliers', label: 'Suppliers', icon: '🤝', href: '/procurement/suppliers' },
        { id: 'purchase-requests', label: 'Purchase Requests', icon: '📝', href: '/procurement/requests' },
        { id: 'purchase-orders', label: 'Purchase Orders', icon: '📄', href: '/procurement/orders' },
        { id: 'goods-receipt', label: 'Goods Receipt', icon: '📬', href: '/procurement/receipt' },
      ],
    },

    // FINANCE
    {
      id: 'finance',
      label: 'FINANCE',
      icon: '💳',
      href: '/finance',
      category: 'finance',
      children: [
        { id: 'invoices', label: 'Invoices', icon: '📋', href: '/finance/invoices' },
        { id: 'payments', label: 'Payments', icon: '💸', href: '/finance/payments' },
        { id: 'expenses', label: 'Expenses', icon: '💰', href: '/finance/expenses' },
        { id: 'accounts', label: 'Accounts', icon: '📊', href: '/finance/accounts' },
        { id: 'taxes', label: 'Taxes', icon: '📑', href: '/finance/taxes' },
      ],
    },

    // OPERATIONS
    {
      id: 'operations',
      label: 'OPERATIONS',
      icon: '⚙️',
      href: '/operations',
      category: 'operations',
      children: [
        { id: 'projects', label: 'Projects', icon: '📁', href: '/operations/projects' },
        { id: 'tasks', label: 'Tasks', icon: '✓', href: '/operations/tasks' },
        { id: 'calendar', label: 'Calendar', icon: '📅', href: '/operations/calendar' },
        { id: 'assets', label: 'Assets', icon: '🔧', href: '/operations/assets' },
      ],
    },

    // HR
    {
      id: 'hr',
      label: 'HR',
      icon: '👨‍💼',
      href: '/hr',
      category: 'hr',
      children: [
        { id: 'employees', label: 'Employees', icon: '👤', href: '/hr/employees' },
        { id: 'attendance', label: 'Attendance', icon: '✓', href: '/hr/attendance' },
        { id: 'leave', label: 'Leave', icon: '🏖️', href: '/hr/leave' },
        { id: 'payroll', label: 'Payroll', icon: '💰', href: '/hr/payroll' },
      ],
    },

    // SUPPORT
    {
      id: 'support',
      label: 'SUPPORT',
      icon: '🎧',
      href: '/support',
      category: 'support',
      children: [
        { id: 'tickets', label: 'Tickets', icon: '🎫', href: '/support/tickets' },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: '📚', href: '/support/kb' },
      ],
    },

    // ANALYTICS
    {
      id: 'analytics',
      label: 'ANALYTICS',
      icon: '📈',
      href: '/analytics',
      category: 'analytics',
      children: [
        { id: 'analytics-dashboard', label: 'Dashboard', icon: '📊', href: '/analytics/dashboard' },
        { id: 'reports', label: 'Reports', icon: '📑', href: '/analytics/reports' },
        { id: 'sales-analytics', label: 'Sales Analytics', icon: '💹', href: '/analytics/sales' },
        { id: 'inventory-analytics', label: 'Inventory Analytics', icon: '📦', href: '/analytics/inventory' },
        { id: 'finance-analytics', label: 'Finance Analytics', icon: '💳', href: '/analytics/finance' },
      ],
    },

    // ADMINISTRATION
    {
      id: 'admin',
      label: 'ADMINISTRATION',
      icon: '🔐',
      href: '/admin',
      category: 'admin',
      children: [
        { id: 'users', label: 'Users', icon: '👥', href: '/admin/users' },
        { id: 'roles', label: 'Roles & Permissions', icon: '🔑', href: '/admin/roles' },
        { id: 'audit', label: 'Audit Logs', icon: '📋', href: '/admin/audit' },
        { id: 'settings', label: 'Settings', icon: '⚙️', href: '/admin/settings' },
        { id: 'billing', label: 'Billing', icon: '💳', href: '/admin/billing' },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle sidebar"
        >
          ☰
        </button>
        {!isCollapsed && <h2 className="sidebar-title">ERP PLATFORM</h2>}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="sidebar-section">
            {/* Dashboard - Direct Link */}
            {item.id === 'dashboard' && (
              <a href={item.href} className="sidebar-link dashboard-link">
                <span className="icon">{item.icon}</span>
                {!isCollapsed && <span className="label">{item.label}</span>}
              </a>
            )}

            {/* Divider after Dashboard */}
            {item.id === 'dashboard' && !isCollapsed && (
              <div className="sidebar-divider" />
            )}

            {/* Expandable Categories */}
            {item.id !== 'dashboard' && (
              <>
                <button
                  className={`sidebar-category ${
                    expandedItems.includes(item.id) ? 'expanded' : 'collapsed'
                  }`}
                  onClick={() => toggleExpand(item.id)}
                  title={item.label}
                >
                  <span className="icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="label">{item.label}</span>
                      <span className="expand-icon">
                        {expandedItems.includes(item.id) ? '▼' : '▶'}
                      </span>
                    </>
                  )}
                </button>

                {/* Submenu Items */}
                {expandedItems.includes(item.id) &&
                  item.children &&
                  !isCollapsed && (
                    <div className="sidebar-submenu">
                      {item.children.map((child) => (
                        <a
                          key={child.id}
                          href={child.href}
                          className="sidebar-sublink"
                        >
                          <span className="icon">{child.icon}</span>
                          <span className="label">{child.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
              </>
            )}

            {/* Admin Divider */}
            {item.id === 'analytics' && !isCollapsed && (
              <div className="sidebar-divider" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
