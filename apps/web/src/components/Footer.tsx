import React from 'react';
import { useAuth } from '../auth/AuthContext';

export const Footer: React.FC = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-left">
        <div className="system-status">
          <span className="status-dot online"></span>
          <span className="status-text">System Operational</span>
        </div>
        <span className="footer-divider">•</span>
        <span className="footer-meta">PostgreSQL Connected</span>
        <span className="footer-divider">•</span>
        <span className="footer-meta">
          Workspace: <strong>{user?.organization?.name || 'Main Workspace'}</strong>
        </span>
      </div>

      <div className="footer-center">
        <span className="footer-version">ERP Platform v2.4.0 (Enterprise)</span>
      </div>

      <div className="footer-right">
        <a href="#docs" className="footer-link">Documentation</a>
        <a href="#support" className="footer-link">Support</a>
        <a href="#api" className="footer-link">API Status</a>
        <span className="footer-copyright">© {currentYear} ERP Platform Inc.</span>
      </div>
    </footer>
  );
};

export default Footer;
