
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

import groupBuilder from "../assets/icons/group.png";
import dashboardGrid from "../assets/icons/grid.png";
import historyIcon from "../assets/icons/Clock.png";
import contactsIcon from "../assets/icons/Atsign.png";
import importsIcon from "../assets/icons/filePlus.png";
import settingsIcon from "../assets/icons/settings.png";
import logo from "../assets/icons/noxlogo.png";

// ======================
// MANAGER MENU
// ======================

const managerMenu = [
  { to: "/dashboard", label: "Dashboard", icon: dashboardGrid },
  { to: "/contacts", label: "Contacts", icon: contactsIcon },
  { to: "/groups", label: "Group Builder", icon: groupBuilder },
  { to: "/history", label: "Email History", icon: historyIcon },
];

const managerTools = [
  { to: "/upload", label: "Upload Contacts", icon: importsIcon },
  { to: "/settings", label: "Settings", icon: settingsIcon },
];

// ======================
// EMPLOYEE MENU
// ======================

const employeeMenu = [
  { to: "/dashboard", label: "Dashboard", icon: dashboardGrid },
  { to: "/history", label: "Email History", icon: historyIcon },
];

const employeeTools = [
  { to: "/settings", label: "Settings", icon: settingsIcon },
];

const linkClass = ({ isActive }) =>
  `nav-link${isActive ? " active" : ""}`;

export default function Sidebar({
  role = "manager",
  mobileOpen,
  onClose,
}) {
  const { user, logout } = useAuth();

  const menuItems =
    role === "manager" ? managerMenu : employeeMenu;

  const toolItems =
    role === "manager" ? managerTools : employeeTools;

  const displayName = user?.username || "Guest";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src={logo} alt="NoxInbox Logo" />
          </div>

          <span className="sidebar-logo-name">
            NoxInbox
          </span>
        </div>

        <p className="sidebar-section-label">MENU</p>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={onClose}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="nav-icon"
              />

              <span className="nav-text">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <p className="sidebar-section-label">TOOLS</p>

        <nav>
          {toolItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={onClose}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="nav-icon"
              />

              <span className="nav-text">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer"></div>

        <NavLink
          to="/email"
          className="compose-btn"
          onClick={onClose}
        >
          <span className="compose-btn-icon">+</span>
          Compose Email
        </NavLink>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials || "?"}</div>

          <div>
            <p className="sidebar-user-name">
              {displayName}
            </p>

            <p className="sidebar-user-role">
              {role.toUpperCase()}
            </p>
          </div>
        </div>

        <NavLink
          to="/login"
          className="logout-link"
          onClick={() => {
            logout();
            onClose && onClose();
          }}
        >
          Log out
        </NavLink>
      </aside>
    </>
  );
}