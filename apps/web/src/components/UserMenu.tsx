import React, { useState } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserMenuProps {
  user?: User;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👤',
    role: 'Admin',
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Help & Support', href: '/help' },
    { label: 'Logout', href: '/logout' },
  ];

  return (
    <div className="user-menu">
      <button
        className="user-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="avatar">{user.avatar}</span>
      </button>

      {isOpen && (
        <div className="user-menu-panel">
          <div className="user-info">
            <div className="avatar-large">{user.avatar}</div>
            <div className="user-details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>

          <hr />

          <div className="menu-items">
            {menuItems.map((item, index) => (
              <a key={index} href={item.href} className="menu-item">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
