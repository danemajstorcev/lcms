import type { PageId, Theme } from "@/types";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  theme: Theme;
  onThemeToggle: () => void;
  badges: Partial<Record<PageId, number>>;
}

const NAV_GROUPS = [
  {
    group: "Operations",
    items: [
      { id: "dashboard" as PageId, icon: "⬡", label: "Dashboard" },
      { id: "dispatch" as PageId, icon: "▦", label: "Dispatch Board" },
      { id: "loads" as PageId, icon: "▣", label: "Loads" },
    ],
  },
  {
    group: "People",
    items: [
      { id: "carriers" as PageId, icon: "◉", label: "Carriers" },
      { id: "drivers" as PageId, icon: "◎", label: "Drivers" },
      { id: "brokers" as PageId, icon: "◷", label: "Brokers" },
    ],
  },
  {
    group: "Finance",
    items: [
      { id: "invoices" as PageId, icon: "◫", label: "Invoices" },
      { id: "reports" as PageId, icon: "◬", label: "Reports" },
    ],
  },
];

export default function Sidebar({
  activePage,
  onNavigate,
  theme,
  onThemeToggle,
  badges,
}: SidebarProps) {
  return (
    <aside className="sidebar hide-mobile">
      <div className="sidebar__brand">
        <div className="sidebar__logo">COREVANTA</div>
        <div className="sidebar__tagline">Load &amp; Carrier Mgmt</div>
      </div>

      <nav className="sidebar__nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="sidebar__group">
            <div className="sidebar__group-label">{group.group}</div>
            {group.items.map((item) => {
              const isActive = activePage === item.id;
              const badge = badges[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`sidebar__nav-btn${isActive ? " sidebar__nav-btn--active" : ""}`}
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  <span className="sidebar__nav-label">{item.label}</span>
                  {badge != null && badge > 0 && (
                    <span className="nav-badge">{badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="theme-toggle" onClick={onThemeToggle}>
          {theme === "dark" ? "☀" : "🌙"}
        </button>
      </div>
    </aside>
  );
}
