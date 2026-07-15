import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

import contactsIcon from "../../assets/icons/totalContacts.png";
import groupsIcon from "../../assets/icons/ContactGroups.png";
import emailIcon from "../../assets/icons/emailsSent.png";

import { getContacts } from "../../services/contactService.js";
import { getGroups } from "../../services/groupService.js";
import { getEmailHistory } from "../../services/emailService.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [contactsCount, setContactsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [contacts, groups, history] = await Promise.all([
          getContacts(user.company_id),
          getGroups(user.company_id),
          getEmailHistory(user.id_user),
        ]);

        if (cancelled) return;

        setContactsCount(contacts.length);
        setGroupsCount(groups.length);
        setEmails(history);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const kpis = [
    { icon: contactsIcon, label: "Total Contacts", value: contactsCount },
    { icon: groupsIcon, label: "Contact Groups", value: groupsCount },
    { icon: emailIcon, label: "Emails Sent", value: emails.length },
  ];

  const recent = emails.slice(0, 5);

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Welcome Back, <br/>{user?.username || "there"}</h1>
        <p className="page-subtitle">Here's what's happening at {user?.company_name || "your company"} today.</p>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div className="kpi-card" key={kpi.label}>
            <img
                src={kpi.icon}
                alt={kpi.label}
                className="kpi-icon"
                />
            <div>
              <p className="kpi-value">{loading ? "…" : kpi.value}</p>
              <p className="kpi-label">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <p className="section-title">Recent Emails</p>
        {!loading && recent.length === 0 && (
          <p className="page-subtitle" style={{ padding: "8px 0" }}>
            No emails sent yet. Compose one to get started.
          </p>
        )}
        <ul className="activity-list">
          {recent.map((email) => (
            <li className="activity-item" key={email.id_email}>
              <div>
                <p style={{ fontWeight: 600, fontFamily: 'var(--font-main)', fontSize: '19px' }}>
                {email.subject}
                </p>
                <p className="activity-time">
                  {email.recipients_count} recipient{email.recipients_count === 1 ? "" : "s"} · {new Date(email.sent_at).toLocaleDateString()}
                </p>
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
