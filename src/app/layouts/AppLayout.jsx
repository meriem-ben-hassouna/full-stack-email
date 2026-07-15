import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../hooks/useAuth.js";

// Full SaaS shell: sidebar stays fixed, only the <Outlet/> content changes.
export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const role = user?.role === "MANAGER" ? "manager" : "employee";

  return (
    <div className="app-shell">

      <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="app-content">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
