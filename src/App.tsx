import { useState } from 'react';
import type { PageId, Theme } from '@/types';
import {
  initialLoads, initialCarriers, initialBrokers,
  initialDrivers, initialInvoices,
} from '@/data/seed';

import Sidebar    from '@/layout/Sidebar';
import TopBar     from '@/layout/TopBar';
import MobileNav  from '@/layout/MobileNav';

import Dashboard    from '@/pages/Dashboard';
import DispatchBoard from '@/pages/DispatchBoard';
import LoadsPage    from '@/pages/LoadsPage';
import CarriersPage from '@/pages/CarriersPage';
import DriversPage  from '@/pages/DriversPage';
import BrokersPage  from '@/pages/BrokersPage';
import InvoicesPage from '@/pages/InvoicesPage';
import ReportsPage  from '@/pages/ReportsPage';

export default function App() {
  // ── Theme ───────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>('dark');
  function toggleTheme() { setTheme((t) => (t === 'dark' ? 'light' : 'dark')); }

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState<PageId>('dashboard');

  // ── Data state ──────────────────────────────────────────────────────────────
  const [loads,    setLoads]    = useState(initialLoads);
  const [carriers, setCarriers] = useState(initialCarriers);
  const [brokers,  setBrokers]  = useState(initialBrokers);
  const [drivers,  setDrivers]  = useState(initialDrivers);
  const [invoices, setInvoices] = useState(initialInvoices);

  // ── Sidebar badge counts ────────────────────────────────────────────────────
  const badges: Partial<Record<PageId, number>> = {
    loads:    loads.filter((l) => l.status === 'In Transit' || l.status === 'Pending').length,
    invoices: invoices.filter((i) => i.status === 'Draft').length,
  };

  // ── Render the active page ──────────────────────────────────────────────────
  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard loads={loads} carriers={carriers} brokers={brokers} drivers={drivers} invoices={invoices} />;
      case 'dispatch':
        return <DispatchBoard loads={loads} setLoads={setLoads} carriers={carriers} brokers={brokers} />;
      case 'loads':
        return <LoadsPage loads={loads} setLoads={setLoads} carriers={carriers} brokers={brokers} />;
      case 'carriers':
        return <CarriersPage carriers={carriers} setCarriers={setCarriers} loads={loads} />;
      case 'drivers':
        return <DriversPage drivers={drivers} setDrivers={setDrivers} carriers={carriers} />;
      case 'brokers':
        return <BrokersPage brokers={brokers} setBrokers={setBrokers} loads={loads} />;
      case 'invoices':
        return <InvoicesPage invoices={invoices} setInvoices={setInvoices} loads={loads} brokers={brokers} />;
      case 'reports':
        return <ReportsPage loads={loads} carriers={carriers} brokers={brokers} />;
      default:
        return null;
    }
  }

  return (
    <div data-theme={theme} className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        theme={theme}
        onThemeToggle={toggleTheme}
        badges={badges}
      />

      <div className="content-wrapper">
        <TopBar activePage={activePage} theme={theme} onThemeToggle={toggleTheme} />

        <main className="main-scroll">
          {renderPage()}
        </main>
      </div>

      <MobileNav activePage={activePage} onNavigate={setActivePage} badges={badges} />
    </div>
  );
}
