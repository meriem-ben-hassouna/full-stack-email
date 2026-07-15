import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getContacts, deleteContact } from "../../services/contactService.js";
import { getGroups, getGroupWithMembers } from "../../services/groupService.js";

const ALL_TAB = "All";

export default function Contacts() {
  const { user, isManager } = useAuth();

  const [tab, setTab] = useState(ALL_TAB);
  const [query, setQuery] = useState("");

  const [allContacts, setAllContacts] = useState([]);
  const [groups, setGroups] = useState([]); // bubbles, from DB
  const [groupMembers, setGroupMembers] = useState([]); // members of the selected group bubble
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    if (!user) return;
    setLoading(true);
    try {
      const [contacts, groupList] = await Promise.all([
        getContacts(user.company_id),
        getGroups(user.company_id),
      ]);
      setAllContacts(contacts);
      setGroups(groupList);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Whenever a group bubble is selected, fetch its members
  useEffect(() => {
    if (tab === ALL_TAB) {
      setGroupMembers([]);
      return;
    }
    const group = groups.find((g) => g.name === tab);
    if (!group) return;

    let cancelled = false;
    getGroupWithMembers(group.id_group)
      .then((full) => {
        if (!cancelled) setGroupMembers(full.members || []);
      })
      .catch((err) => alert(err.message));

    return () => {
      cancelled = true;
    };
  }, [tab, groups]);

  const rowsSource = tab === ALL_TAB ? allContacts : groupMembers;

  const rows = rowsSource.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async (contact) => {
    if (!window.confirm(`Delete ${contact.name}? This removes them from every group too.`)) {
      return;
    }
    try {
      await deleteContact(contact.id_contact);
      await loadAll();
      // refresh currently viewed group bubble too
      if (tab !== ALL_TAB) {
        const group = groups.find((g) => g.name === tab);
        if (group) {
          const full = await getGroupWithMembers(group.id_group);
          setGroupMembers(full.members || []);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const tabs = [ALL_TAB, ...groups.map((g) => g.name)];

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
          {tabs.map((t) => (
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
                {isManager && <th></th>}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={isManager ? 4 : 3}>Loading…</td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 4 : 3}>No contacts here yet.</td>
                </tr>
              )}
              {rows.map((c) => (
                <tr key={c.id_contact}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    <span className="badge">{c.department || "—"}</span>
                  </td>
                  {isManager && (
                    <td>
                      <button
                        className="group-remove"
                        aria-label={`Delete ${c.name}`}
                        onClick={() => handleDelete(c)}
                      >
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
