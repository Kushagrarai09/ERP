import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span className="separator">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
