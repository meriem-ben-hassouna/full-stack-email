import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";

// ---- mock contact files (left panel) ----
const NAME_POOL = [
  "Sarah Chen", "Tom Harrington", "James Okafor", "Elena Volkov",
  "Marcus Webb", "Priya Nair", "Liam Carter", "Ava Thompson",
  "Noah Patel", "Emma Rodriguez", "Grace Kim", "Daniel Osei",
];

function makeContacts(fileId, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${fileId}-c${i}`,
    name: NAME_POOL[i % NAME_POOL.length],
  }));
}

const FILES = [
  { id: "f1", name: "File 1 — Marketing department employees", count: 8 },
  { id: "f2", name: "File 2 — IT department employees", count: 6 },
  { id: "f3", name: "File 3 — Interns", count: 5 },
  { id: "f4", name: "File 4 — Clients", count: 10 },
].map((f) => ({ ...f, contacts: makeContacts(f.id, f.count) }));

// ---- initial groups (right panel) ----
const INITIAL_GROUPS = [
  {
    id: "g1",
    name: "Engineering Team",
    members: [
      { id: "f2-c0", name: "Sarah Chen" },
      { id: "f2-c2", name: "James Okafor" },
    ],
  },
  {
    id: "g2",
    name: "Team Leaders",
    members: [
      { id: "f2-c0", name: "Sarah Chen" },
      { id: "f1-c3", name: "Elena Volkov" },
    ],
  },
];

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("");
}

export default function Groups() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [openFileId, setOpenFileId] = useState(null);
  const [query, setQuery] = useState("");
  const [dragOverId, setDragOverId] = useState(null);

  const openFile = FILES.find((f) => f.id === openFileId) || null;

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setGroups([...groups, { id: `g${Date.now()}`, name: newGroupName, members: [] }]);
    setNewGroupName("");
    setShowNewGroup(false);
  };

  const removeGroup = (groupId) => setGroups(groups.filter((g) => g.id !== groupId));

  const removeMember = (groupId, memberId) => {
    setGroups(groups.map((g) =>
      g.id === groupId ? { ...g, members: g.members.filter((m) => m.id !== memberId) } : g
    ));
  };

  const addMembersToGroup = (groupId, incoming) => {
    setGroups(groups.map((g) => {
      if (g.id !== groupId) return g;
      const existingIds = new Set(g.members.map((m) => m.id));
      const merged = [...g.members, ...incoming.filter((m) => !existingIds.has(m.id))];
      return { ...g, members: merged };
    }));
  };

  const handleDragStart = (e, payload) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e, groupId) => {
    e.preventDefault();
    setDragOverId(null);
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }
    if (payload.type === "contact") {
      addMembersToGroup(groupId, [payload.contact]);
    } else if (payload.type === "file") {
      addMembersToGroup(groupId, payload.contacts);
    }
  };

  const filteredFiles = FILES.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Group Builder</h1>
        <p className="page-subtitle">Drag contacts from the left into a group.</p>
      </div>

      <div className="gb-grid">
        <Card>
          {!openFile ? (
            <>
              <div className="gb-panel-header">
                <span className="gb-panel-title">Contacts</span>
              </div>
              <input
                className="gb-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
              />
              <div>
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="file-row"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, { type: "file", contacts: file.contacts })
                    }
                    onClick={() => setOpenFileId(file.id)}
                  >
                    <div className="file-row-left">
                      <span className="file-icon">▤</span>
                      <span className="file-name">{file.name}</span>
                    </div>
                    <span className="file-meta">{file.count} lines</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button className="back-link" onClick={() => setOpenFileId(null)}>
                ← Back
              </button>
              <div className="gb-panel-header">
                <span className="gb-panel-title">{openFile.name}</span>
              </div>
              <input className="gb-search" placeholder="Search for file" />
              <div>
                {openFile.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="contact-row"
                    draggable
                    onDragStart={(e) => handleDragStart(e, { type: "contact", contact })}
                  >
                    <div className="contact-avatar">{initials(contact.name)}</div>
                    <span className="contact-name">{contact.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <div className="stack">
          <div className="gb-panel-header">
            <span className="gb-panel-title">{groups.length} Groups</span>
            <Button onClick={() => setShowNewGroup(!showNewGroup)}>+ New Group</Button>
          </div>

          {showNewGroup && (
            <form onSubmit={handleAddGroup} className="new-group-row">
              <input
                autoFocus
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="New group name..."
              />
              <Button type="submit">Add</Button>
            </form>
          )}

          <div className="group-list">
            {groups.map((g) => (
              <Card
                key={g.id}
                className={`group-card${dragOverId === g.id ? " drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(g.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, g.id)}
              >
                <div className="group-header">
                  <span className="group-dot" />
                  <span className="group-name">{g.name}</span>
                  <span className="group-count">{g.members.length}</span>
                  <button className="group-remove" onClick={() => removeGroup(g.id)} aria-label="Delete group">
                    ×
                  </button>
                </div>

                {g.members.length === 0 ? (
                  <p className="group-empty">Drag a file or a contact here</p>
                ) : (
                  <div className="member-pills">
                    {g.members.map((m) => (
                      <span className="member-pill" key={m.id}>
                        {m.name}
                        <button onClick={() => removeMember(g.id, m.id)} aria-label={`Remove ${m.name}`}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

