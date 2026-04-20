import type { PageId, Theme } from '@/types';

const PAGE_LABELS: Record<PageId, string> = {
  dashboard: 'Dashboard',
  dispatch:  'Dispatch Board',
  loads:     'Loads',
  carriers:  'Carriers',
  drivers:   'Drivers',
  brokers:   'Brokers',
  invoices:  'Invoices',
  reports:   'Reports',
};

interface TopBarProps {
  activePage:    PageId;
  theme:         Theme;
  onThemeToggle: () => void;
}

export default function TopBar({ activePage, theme, onThemeToggle }: TopBarProps) {
  return (
    <header className="topbar">
      <span className="topbar__title">{PAGE_LABELS[activePage].toUpperCase()}</span>

      <div className="topbar__right">
        <div className="topbar__status">
          <span className="topbar__status-dot" />
          System Live
        </div>

        {/* Theme toggle — mobile only, desktop has it in sidebar */}
        <button className="theme-toggle mobile-only" onClick={onThemeToggle}>
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </div>
    </header>
  );
}
