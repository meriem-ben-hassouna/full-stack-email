import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { getEmailHistory } from "../../services/emailService.js";

export default function History() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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
        <p className="page-subtitle">Track past campaigns and activity. Click a row to see the full email.</p>
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
                <tr
                  key={log.id_email}
                  onClick={() => setSelected(log)}
                  style={{ cursor: "pointer" }}
                >
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

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="section-title">{selected.subject}</h2>
              <button className="group-remove" onClick={() => setSelected(null)} aria-label="Close">
                ×
              </button>
            </div>

            <div className="modal-meta">
              <span className={`badge${selected.status === "partial" ? " muted" : ""}`}>{selected.status}</span>
              <span>{selected.recipients_count} recipient{selected.recipients_count === 1 ? "" : "s"}</span>
              <span>{new Date(selected.sent_at).toLocaleString()}</span>
            </div>

            <div className="modal-body">{selected.body}</div>
          </div>
        </div>
      )}
    </div>
  );
}
