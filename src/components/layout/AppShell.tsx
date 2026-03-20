import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { logoutCurrentUser } from "../../lib/auth";
import { useAppStore } from "../../store/useAppStore";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "Patients", path: "/patients" }
];

export const AppShell = (): JSX.Element => {
  const navigate = useNavigate();
  const session = useAppStore((state) => state.session);
  const clearSession = useAppStore((state) => state.clearSession);

  const handleLogout = async () => {
    await logoutCurrentUser();
    clearSession();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-mark">+</div>
          <div>
            <h1>RAGA Health Care</h1>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Today</p>
            <h2>{new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())}</h2>
          </div>

          <div className="topbar-actions">
            <div className="user-chip">
              <span>{session?.initials}</span>
              <div>
                <strong>{session?.name}</strong>
                <p>{session?.role}</p>
              </div>
            </div>

            <button
              className="ghost-button"
              onClick={handleLogout}
              type="button"
            >
              Sign out
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};
