import React, { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationName: '',
    organizationEmail: '',
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create workspace account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-container-page">
      {/* Left Registration Form Section */}
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
          <Link to="/login" className="auth-tab-btn">Sign In</Link>
          <button className="auth-tab-btn active">Register Workspace</button>
        </div>

        {/* Section Header */}
        <div className="auth-section-title">
          <h3>Create Your Organization</h3>
          <p>Launch an isolated company tenant and become its Root Administrator.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={submit} className="auth-form-body">
          {/* Organization Details */}
          <div className="form-group-divider">
            <span>1. Organization Info</span>
          </div>

          <div className="form-row-2">
            <div className="form-field-group">
              <label>Company / Org Name</label>
              <div className="input-with-icon">
                <span className="field-icon">🏢</span>
                <input
                  value={form.organizationName}
                  onChange={(e) => update('organizationName', e.target.value)}
                  placeholder="Acme Global Inc."
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label>Org Billing Email</label>
              <div className="input-with-icon">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  value={form.organizationEmail}
                  onChange={(e) => update('organizationEmail', e.target.value)}
                  placeholder="contact@acme.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Admin User Details */}
          <div className="form-group-divider">
            <span>2. Root Administrator Credentials</span>
          </div>

          <div className="form-row-2">
            <div className="form-field-group">
              <label>Admin Full Name</label>
              <div className="input-with-icon">
                <span className="field-icon">👤</span>
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="John Doe"
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label>Admin Email Address</label>
              <div className="input-with-icon">
                <span className="field-icon">📧</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="admin@acme.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-field-group">
            <label>Master Password (Min. 8 characters)</label>
            <div className="input-with-icon">
              <span className="field-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Create strong password"
                required
                minLength={8}
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
            className="auth-submit-btn admin-gradient"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loader">Provisioning Workspace...</span>
            ) : (
              <span>Deploy Organization Workspace →</span>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="auth-footer-prompt">
          <span>Already have a workspace account?</span>
          <Link to="/login" className="prompt-link">
            Sign In Here →
          </Link>
        </div>
      </section>

      {/* Right Hero / Showcase Section */}
      <aside className="auth-hero-aside">
        <div className="hero-decor-orb orb-1"></div>
        <div className="hero-decor-orb orb-2"></div>

        <div className="hero-top-badge">
          <span className="pulse-dot"></span>
          <span>ENTERPRISE WORKSPACE PROVISIONING</span>
        </div>

        <div className="hero-main-content">
          <h1 className="hero-headline">
            Start operating with complete security and scale.
          </h1>
          <p className="hero-subtext">
            Every workspace created gets an isolated database tenancy, automated cross-module workflow engine, and full role-based administration controls.
          </p>

          {/* Guarantee Checklist */}
          <div className="hero-features-grid">
            <div className="feature-mini-card">
              <span className="feature-icon">🛡️</span>
              <div className="feature-info">
                <strong>Sole Admin Privileges</strong>
                <small>Full control over your company data & users</small>
              </div>
            </div>

            <div className="feature-mini-card">
              <span className="feature-icon">🔒</span>
              <div className="feature-info">
                <strong>Isolated Multi-Tenancy</strong>
                <small>No cross-tenant data leakage guaranteed</small>
              </div>
            </div>

            <div className="feature-mini-card">
              <span className="feature-icon">🚀</span>
              <div className="feature-info">
                <strong>Instant Provisioning</strong>
                <small>Ready-to-use CRM, Sales, Inventory & Finance</small>
              </div>
            </div>

            <div className="feature-mini-card">
              <span className="feature-icon">👥</span>
              <div className="feature-info">
                <strong>Unlimited Team Invites</strong>
                <small>Add staff with role-specific portal access</small>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Metric Bar */}
        <div className="hero-metrics-bar">
          <div className="metric-item">
            <strong>100%</strong>
            <span>Isolated</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>Instant</strong>
            <span>Setup</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <strong>24/7</strong>
            <span>Operational</span>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default SignupPage;