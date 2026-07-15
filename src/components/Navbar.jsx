import { useAuth } from "../hooks/useAuth.js";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const displayName = user?.username || "Guest";
  const roleLabel = user?.role === "MANAGER" ? "Manager" : "Employee";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="navbar">
      <button onClick={onMenuClick} className="menu-toggle" aria-label="Open menu">
        ☰
      </button>

      <input type="text" placeholder="Search" className="search-input" />

      <div className="navbar-right">
        <div className="navbar-date">
            {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
            })}
        </div>
        <div className="navbar-user">
          <div className="navbar-avatar">{initials || "?"}</div>
          <div>
            <p className="navbar-user-name">{displayName}</p>
            <p className="navbar-user-role">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
