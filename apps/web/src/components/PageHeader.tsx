import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumb,
}) => {
  return (
    <div className="page-header">
      {breadcrumb && <div className="page-header-breadcrumb">{breadcrumb}</div>}

      <div className="page-header-top">
        <div className="page-header-title-section">
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>

        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
