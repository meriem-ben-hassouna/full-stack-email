import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Settings() {
  const { user, isManager } = useAuth();

  return (
    <div className="stack max-narrow">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      <Card>
        <p className="section-title">Profile</p>
        <div className="stack">
          <div className="field">
            <label>Full name</label>
            <input type="text" value={user?.username || ""} disabled />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>
          <div className="field">
            <label>Role</label>
            <input type="text" value={isManager ? "Manager" : "Employee"} disabled />
          </div>
          <div className="field">
            <label>Company</label>
            <input type="text" value={user?.company_name || ""} disabled />
          </div>
          {isManager && (
            <div className="field">
              <label>Company Code</label>
              <input type="text" value={user?.company_code || ""} disabled />
              <p className="dropzone-hint" style={{ marginTop: 6 }}>
                Share this code (with your company name) with employees so
                they can join your workspace.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Button disabled>Save Changes</Button>
    </div>
  );
}
