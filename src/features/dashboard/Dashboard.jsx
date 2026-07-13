import Card from "../../components/Card.jsx";

import contactsIcon from "../../assets/icons/totalContacts.png";
import groupsIcon from "../../assets/icons/ContactGroups.png";
import emailIcon from "../../assets/icons/emailsSent.png";

const KPIS = [
  { icon: contactsIcon, label: "Total Contacts", value: "1220", change: "+12 this month" },
  { icon: groupsIcon, label: "Contact Groups", value: "15", change: "3 recently updated" },
  { icon: emailIcon, label: "Emails Sent", value: "75432", change: "12 this week" },
];

const RECENT_EMAILS = [
  { subject: "Q3 Product Roadmap — All Hands", meta: "All Hands · 48 recipients", status: "delivered" },
  { subject: "Sprint Planning Reminder", meta: "All Hands · 48 recipients", status: "partial" },
  { subject: "Q3 Product Roadmap — All Hands", meta: "Engineering Team · 12 recipients", status: "delivered" },
  { subject: "Q3 Product Roadmap — All Hands", meta: "All Hands · 48 recipients", status: "partial" },
];

export default function Dashboard() {
  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Welcome Back, <br/>Sarah Miller</h1>
        <p className="page-subtitle">Here's what's happening at Flowbase today.</p>
      </div>

      <div className="kpi-grid">
        {KPIS.map((kpi) => (
          <div className="kpi-card" key={kpi.label}>
            <img
                src={kpi.icon}
                alt={kpi.label}
                className="kpi-icon"
                />
            <div>
              <p className="kpi-value">{kpi.value}</p>
              <p className="kpi-label">{kpi.label}</p>
              <p className="kpi-change">{kpi.change}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <p className="section-title">Recent Emails</p>
        <ul className="activity-list">
          {RECENT_EMAILS.map((email, i) => (
            <li className="activity-item" key={i}>
              <div>
                <p style={{ fontWeight: 600, fontFamily: 'var(--font-main)', fontSize: '19px' }}>
                {email.subject}
                </p>
                <p className="activity-time">{email.meta}</p>
              </div>
              <span className={`badge${email.status === "partial" ? " muted" : ""}`}>
                {email.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
