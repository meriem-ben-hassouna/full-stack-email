import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";

export default function Settings() {
  const [role] = useState("Manager"); // swap with real user role once auth is wired up
  const [notifications, setNotifications] = useState(true);

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
            <input type="text" defaultValue="Sarah Miller" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email"  />
          </div>
          <div className="field">
            <label>Role</label>
            <input type="text" value={role} disabled />
          </div>
          <div className="field">
            <label>Department</label>
            <input type="text" disabled />
          </div>
          <div className="field">
            <label>Company Code</label>
            <input type="password" defaultValue="********" disabled />
          </div>
          
        </div>
      </Card>

      

      <Button>Save Changes</Button>
    </div>
  );
}
