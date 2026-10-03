import React, { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const { user, loading, error, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login Mode: 'admin' or 'customer'
  const [loginMode, setLoginMode] = useState<'admin' | 'customer'>('admin');
  const [email, setEmail] = useState('admin@techvision.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showQuickCredentials, setShowQuickCredentials] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleModeChange = (mode: 'admin' | 'customer') => {
    setLoginMode(mode);
    if (mode === 'admin') {
      setEmail('admin@techvision.com');
      setPassword('password');
    } else {
      setEmail('sales@techvision.com');
      setPassword('password');
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || '/dashboard', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-container-page">
      {/* Left Authentication Form Section */}
      <section className="auth-form-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div className="auth-brand-text">
            <h2>ERP PLATFORM</h2>
            <span>Enterprise Suite</span>
          </div>
        </div>

        {/* Tab Navigation: Sign In vs Sign Up */}
        <div className="auth-nav-tabs">
          <button className="auth-tab-btn active">Sign In</button>
          <Link to="/signup" className="auth-tab-btn">Register Workspace</Link>
        </div>

        {/* Portal Switcher: Admin vs Customer */}
        <div className="portal-selector-wrapper">
          <div className="portal-selector-label">
            <span>Select Access Portal:</span>
            <button
              type="button"
              className="secret-toggle-btn"
              onClick={() => setShowQuickCredentials(!showQuickCredentials)}
              title="Toggle demo test credentials"
            >
              🔑 Demo Logins {showQuickCredentials ? '▲' : '▼'}
            </button>
          </div>

          <div className="portal-pills">
            <button
              type="button"
              className={`portal-pill-btn ${loginMode === 'admin' ? 'active-admin' : ''}`}
              onClick={() => handleModeChange('admin')}
            >
              <span className="portal-icon">⚡</span>
              <div className="portal-text-group">
                <strong>Admin Portal</strong>
                <small>Full System Privileges</small>
              </div>
            </button>

            <button
              type="button"
              className={`portal-pill-btn ${loginMode === 'customer' ? 'active-customer' : ''}`}
              onClick={() => handleModeChange('customer')}
            >
              <span className="portal-icon">👤</span>
              <div className="portal-text-group">
                <strong>Customer & Staff</strong>
                <small>Role-Restricted Portal</small>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Demo Credentials Drawer (Hidden / Expandable) */}
        {showQuickCredentials && (
          <div className="quick-credentials-drawer">
            <div className="drawer-header">⚡ One-Click Role Testing:</div>
            <div className="drawer-chips">
              <button
                type="button"
                className="chip-btn admin"
                onClick={() => {
                  setLoginMode('admin');
                  handleQuickFill('admin@techvision.com');
                }}
              >
                🛡️ Admin (Rajesh)
              </button>
              <button
                type="button"
                className="chip-btn sales"
                onClick={() => {
                  setLoginMode('customer');
                  handleQuickFill('sales@techvision.com');
                }}
              >
                💰 Sales (Priya)
              </button>
              <button
                type="button"
                className="chip-btn inventory"
                onClick={() => {
                  setLoginMode('customer');
                  handleQuickFill('inventory@techvision.com');
                }}
              >
                📦 Inventory (Vikram)
              </button>
            </div>
          </div>
        )}

        {/* Mode Banner Indicator */}
        <div className={`portal-banner ${loginMode === 'admin' ? 'banner-admin' : 'banner-customer'}`}>
          <span className="banner-icon">{loginMode === 'admin' ? '🛡️' : '👥'}</span>
          <span>
            {loginMode === 'admin'
              ? 'Admin Mode: Access all company data & user management'
              : 'Customer/Staff Mode: Access assigned modules & records'}
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="auth-form-body">
          <div className="form-field-group">
            <label>Work Email Address</label>
            <div className="input-with-icon">
              <span className="field-icon">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="form-field-group">
            <div className="label-row">
              <label>Password</label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => alert('Default demo password is: password')}
              >
                Forgot?
              </button>
            </div>
            <div className="input-with-icon">
              <span className="field-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="visibility-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error-alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            type="submit"
            className={`auth-submit-btn ${loginMode === 'admin' ? 'admin-gradient' : 'customer-gradient'}`}
            disabled={loading || submitting}
          >
            {submitting ? (
              <span className="btn-loader">Authenticating...</span>
            ) : (
              <span>Sign In to {loginMode === 'admin' ? 'Admin Workspace' : 'Portal'} →</span>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="auth-footer-prompt">
          <span>Need a new company organization?</span>
          <Link to="/signup" className="prompt-link">
            Create Workspace →
          </Link>
        </div>
      </section>

      {/* Right Hero / Showcase Section */}
      <aside className="auth-hero-aside">
        <div className="hero-decor-orb orb-1"></div>
        <div className="hero-decor-orb orb-2"></div>

        <div className="hero-top-badge">
          <span className="pulse-dot"></span>
          <span>NEXT-GEN ENTERPRISE ERP</span>
        </div>

        <div className="hero-main-content">
          <h1 className="hero-headline">
            One unified platform to operate your entire business.
          </h1>
          <p className="hero-subtext">
            Seamlessly synchronize CRM pipelines, sales orders, multi-warehouse stock, procurement, and financial accounting in real-time.
          </p>

          {/* Feature Highlights Grid */}
          <div className="hero-features-grid">
            <div className="feature-mini-card">
              <span className="feature-icon">🏢</span>
              <div className="feature-info">
                <strong>Multi-Tenant SaaS</strong>
                <small>Isolated company datasets & zero leakage</small>
              </div>
            </div>

            <div className="feature-mini-card">
              <span className="feature-icon">🛡️</span>
              <div className="feature-info">
                <strong>Admin & RBAC Controls</strong>
                <small>Granular permissions for staff & customers</small>
              </div>
            </div>

            <div className="feature-mini-card">
              <span className="feature-icon">⚡</span>
              <div className="feature-info">
                <strong>High Velocity Postgres</strong>
                <small>Sub-millisecond queries with Prisma ORM</small>
              </div>
            </div>

            <div className="feature-mini-card">
              <span className="feature-icon">📊</span>
              <div className="feature-info">
                <strong>Cross-Module Sync</strong>
                <small>Auto stock movements on PO and Invoice</small>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Metric Bar */}
        <div className="hero-metrics-bar">
          <div className="metric-item">
            <strong>24</strong>
            <span>Core Tables</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>5</strong>
            <span>Modules</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>99.9%</strong>
            <span>Uptime</span>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default LoginPage;