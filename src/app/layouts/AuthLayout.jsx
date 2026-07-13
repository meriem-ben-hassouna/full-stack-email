import { Outlet } from "react-router-dom";
import SLogo from "../../assets/icons/LOGO.png"
// Clean, centered wrapper used by Login and Register.
// No sidebar / navbar here on purpose.
export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-wrap">
        <div className="auth-brand">
          <div className="auth-brand-icon"> <img src={SLogo}/> </div>
          <span className="auth-brand-name">NoxInbox</span>
          <span className="auth-brand-tag">Corporate email &amp; contact management</span>
        </div>

        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
