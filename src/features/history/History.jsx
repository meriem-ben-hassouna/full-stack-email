import Card from "../../components/Card.jsx";

const LOGS = [
  { subject: "Q3 Newsletter", group: "Marketing", sentTo: 320, date: "Jul 4, 2026" },
  { subject: "Welcome Series #1", group: "Sales", sentTo: 145, date: "Jul 2, 2026" },
  { subject: "VIP Exclusive Offer", group: "VIP Clients", sentTo: 42, date: "Jun 29, 2026" },
  { subject: "Support Follow-up", group: "Support", sentTo: 88, date: "Jun 25, 2026" },
];

export default function History() {
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
                <th>Group</th>
                <th>Sent To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {LOGS.map((log) => (
                <tr key={log.subject}>
                  <td style={{ fontWeight: 700 }}>{log.subject}</td>
                  <td>{log.group}</td>
                  <td>{log.sentTo}</td>
                  <td>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
