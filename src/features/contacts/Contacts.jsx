import { useState } from "react";
import Card from "../../components/Card.jsx";

const TABS = ["Employees", "Interns", "Clients", "Partners"];

const CONTACTS = {
  Employees: [
    { name: "Ava Thompson", email: "ava@northwind.com", dept: "Marketing" },
    { name: "Liam Carter", email: "liam@brightside.io", dept: "Sales" },
  ],
  Interns: [
    { name: "Noah Patel", email: "noah@vertex.com", dept: "Support" },
  ],
  Clients: [
    { name: "Emma Rodriguez", email: "emma@northwind.com", dept: "Success" },
  ],
  Partners: [
    { name: "Windows", email: "sarah.chen@windows.com", dept: "IT" },
    { name: "Peacock", email: "marcus.webb@peacock.com", dept: "advertisement" },
    { name: "Windows", email: "sarah.chen@windows.com", dept: "IT" },
  ],
};

export default function Contacts() {
  const [tab, setTab] = useState("Partners");
  const [query, setQuery] = useState("");

  const rows = CONTACTS[tab].filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Contacts</h1>
      </div>

      <div className="table-toolbar" style={{ padding: 0, border: "none" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="search-input"
        />
        <div className="pill-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`pill-tab${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Card flat>
        <p className="section-title" style={{ padding: "18px 18px 0" }}>{tab}</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    <span className="badge">{c.dept}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
