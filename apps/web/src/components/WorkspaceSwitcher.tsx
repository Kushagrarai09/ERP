import React, { useState } from 'react';

interface Workspace {
  id: string;
  name: string;
  icon: string;
}

export const WorkspaceSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    id: '1',
    name: 'Main Workspace',
    icon: '🏢',
  });

  const workspaces: Workspace[] = [
    { id: '1', name: 'Main Workspace', icon: '🏢' },
    { id: '2', name: 'Development', icon: '🔧' },
    { id: '3', name: 'Testing', icon: '🧪' },
  ];

  const handleSwitch = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setIsOpen(false);
  };

  return (
    <div className="workspace-switcher">
      <button
        className="workspace-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="workspace-icon">{currentWorkspace.icon}</span>
        <span className="workspace-name">{currentWorkspace.name}</span>
        <span className="dropdown-icon">▼</span>
      </button>

      {isOpen && (
        <div className="workspace-menu">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              className={`workspace-item ${
                ws.id === currentWorkspace.id ? 'active' : ''
              }`}
              onClick={() => handleSwitch(ws)}
            >
              <span className="icon">{ws.icon}</span>
              <span className="name">{ws.name}</span>
            </button>
          ))}
          <hr />
          <button className="workspace-item create-workspace">
            + Create Workspace
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
