import React from 'react';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import Search from './Search';
import NotificationCenter from './NotificationCenter';
import UserMenu from './UserMenu';

export const Topbar: React.FC = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="erp-logo">
          <span>ERP Logo</span>
        </div>
        <WorkspaceSwitcher />
      </div>

      <div className="topbar-center">
        <Search />
      </div>

      <div className="topbar-right">
        <button className="create-btn">+ Create</button>
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
