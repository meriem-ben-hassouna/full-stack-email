import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { getEmailHistory } from "../../services/emailService.js";

export default function History() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getEmailHistory(user.id_user)
      .then(setLogs)
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Email History</h1>
        <p className="page-subtitle">Track past campaigns and activity.</p>
      </div>

      <Card flat>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Sent To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4}>Loading…</td></tr>
              )}
              {!loading && logs.length === 0 && (
                <tr><td colSpan={4}>No emails sent yet.</td></tr>
              )}
              {logs.map((log) => (
                <tr key={log.id_email}>
                  <td style={{ fontWeight: 700 }}>{log.subject}</td>
                  <td><span className={`badge${log.status === "partial" ? " muted" : ""}`}>{log.status}</span></td>
                  <td>{log.recipients_count}</td>
                  <td>{new Date(log.sent_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
