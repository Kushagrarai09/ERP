import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export const WorkspaceSwitcher: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const orgName = user?.organization?.name || 'Main Workspace';

  const workspaces = [
    { id: '1', name: orgName, icon: '🏢', type: 'Primary Organization' },
    { id: '2', name: 'Sandbox / Dev Branch', icon: '🧪', type: 'Test Environment' },
  ];

  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);

  return (
    <div className="workspace-switcher">
      <button
        className="workspace-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Workspace"
      >
        <span className="workspace-status-dot"></span>
        <span className="workspace-name">{activeWorkspace.name}</span>
        <span className="dropdown-arrow">▾</span>
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="workspace-menu">
            <div className="workspace-menu-header">Active Organizations</div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                className={`workspace-item ${ws.id === activeWorkspace.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setIsOpen(false);
                }}
              >
                <span className="workspace-item-icon">{ws.icon}</span>
                <div className="workspace-item-info">
                  <span className="workspace-item-name">{ws.name}</span>
                  <span className="workspace-item-type">{ws.type}</span>
                </div>
                {ws.id === activeWorkspace.id && <span className="workspace-check">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
