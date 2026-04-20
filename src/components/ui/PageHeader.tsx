import { type ReactNode } from 'react';

interface PageHeaderProps {
  title:    string;
  children?: ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h2 className="page-header__title">{title}</h2>
      {children && <div className="page-header__actions">{children}</div>}
    </div>
  );
}
