import type { PageId } from "@/types";

interface MobileNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  badges: Partial<Record<PageId, number>>;
}

const MOBILE_ITEMS: { id: PageId; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⬡", label: "Home" },
  { id: "dispatch", icon: "▦", label: "Dispatch" },
  { id: "loads", icon: "▣", label: "Loads" },
  { id: "carriers", icon: "◉", label: "Carriers" },
  { id: "drivers", icon: "◎", label: "Drivers" },
  { id: "brokers", icon: "◷", label: "Brokers" },
  { id: "invoices", icon: "◫", label: "Invoices" },
  { id: "reports", icon: "◬", label: "Reports" },
];

export default function MobileNav({
  activePage,
  onNavigate,
  badges,
}: MobileNavProps) {
  return (
    <nav className="mobile-nav mobile-only">
      {MOBILE_ITEMS.map((item) => {
        const isActive = activePage === item.id;
        const badge = badges[item.id];
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`mobile-nav__btn${isActive ? " mobile-nav__btn--active" : ""}`}
          >
            {badge != null && badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  right: 8,
                  background: "var(--clr-accent)",
                  color: "#000",
                  borderRadius: 20,
                  fontSize: 7.5,
                  fontWeight: 800,
                  padding: "0 4px",
                }}
              >
                {badge}
              </span>
            )}
            <span className="mobile-nav__icon">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
