import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, CalendarClock, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/appointments', icon: CalendarClock, label: 'Appointments' },
];

export function AppSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-sidebar p-2 text-sidebar-foreground md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6">
          <Heart className="h-7 w-7 text-sidebar-primary" fill="currentColor" />
          <span className="font-display text-lg font-bold text-sidebar-primary-foreground">MedCore HMS</span>
        </div>

        {/* Nav */}
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-muted">
          © 2026 MedCore HMS
        </div>
      </aside>
    </>
  );
}
