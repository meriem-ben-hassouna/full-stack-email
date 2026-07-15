import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

import { getContactFiles, getFileContacts } from "../../services/contactService.js";
import {
  getGroups,
  getGroupWithMembers,
  createGroup,
  deleteGroup,
  addContactToGroup,
  addContactsToGroup,
  removeContactFromGroup,
} from "../../services/groupService.js";

function initials(name) {
  return name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("");
}

export default function Groups() {
  const { user, isManager } = useAuth();

  const [files, setFiles] = useState([]); // contact files (left panel, closed)
  const [openFileId, setOpenFileId] = useState(null);
  const [openFileContacts, setOpenFileContacts] = useState([]);
  const [loadingFileContacts, setLoadingFileContacts] = useState(false);

  const [groups, setGroups] = useState([]); // groups with members: {id_group, name, members:[...]}
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [dragOverId, setDragOverId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadEverything() {
    if (!user) return;
    setLoading(true);
    try {
      const [fileList, groupList] = await Promise.all([
        getContactFiles(user.company_id),
        getGroups(user.company_id),
      ]);
      setFiles(fileList);

      const withMembers = await Promise.all(
        groupList.map((g) => getGroupWithMembers(g.id_group))
      );
      setGroups(withMembers);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openFile = files.find((f) => f.id_file === openFileId) || null;

  useEffect(() => {
    if (!openFileId) {
      setOpenFileContacts([]);
      return;
    }
    let cancelled = false;
    setLoadingFileContacts(true);
    getFileContacts(openFileId)
      .then((contacts) => {
        if (!cancelled) setOpenFileContacts(contacts);
      })
      .catch((err) => alert(err.message))
      .finally(() => {
        if (!cancelled) setLoadingFileContacts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [openFileId]);

  const refreshGroup = async (groupId) => {
    const full = await getGroupWithMembers(groupId);
    setGroups((prev) => prev.map((g) => (g.id_group === groupId ? full : g)));
  };

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const created = await createGroup({
        name: newGroupName.trim(),
        companyId: user.company_id,
        createdBy: user.id_user,
      });
      setGroups((prev) => [...prev, { ...created, members: [] }]);
      setNewGroupName("");
      setShowNewGroup(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeGroup = async (groupId) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g.id_group !== groupId));
    } catch (err) {
      alert(err.message);
    }
  };

  const removeMember = async (groupId, contactId) => {
    try {
      await removeContactFromGroup(groupId, contactId);
      setGroups((prev) =>
        prev.map((g) =>
          g.id_group === groupId
            ? { ...g, members: g.members.filter((m) => m.id_contact !== contactId) }
            : g
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDragStart = (e, payload) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = async (e, groupId) => {
    e.preventDefault();
    setDragOverId(null);
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }

    try {
      if (payload.type === "contact") {
        await addContactToGroup(groupId, payload.contact.id_contact);
      } else if (payload.type === "file") {
        await addContactsToGroup(groupId, payload.contacts.map((c) => c.id_contact));
      }
      await refreshGroup(groupId);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.filename.toLowerCase().includes(query.toLowerCase())
  );

  if (!isManager) {
    return (
      <div className="stack">
        <h1 className="page-title">Group Builder</h1>
        <p className="page-subtitle">Only managers can build and edit contact groups.</p>
      </div>
    );
  }

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
                {loading && <p className="group-empty">Loading files…</p>}
                {!loading && filteredFiles.length === 0 && (
                  <p className="group-empty">No contact files uploaded yet.</p>
                )}
                {filteredFiles.map((file, idx) => (
                  <div
                    key={file.id_file}
                    className="file-row"
                    draggable
                    onDragStart={async (e) => {
                      // fetch this file's contacts on the fly for the drag payload
                      try {
                        const contacts = await getFileContacts(file.id_file);
                        handleDragStart(e, { type: "file", contacts });
                      } catch (err) {
                        e.preventDefault();
                        alert(err.message);
                      }
                    }}
                    onClick={() => setOpenFileId(file.id_file)}
                  >
                    <div className="file-row-left">
                      <span className="file-icon">▤</span>
                      <span className="file-name">File {idx + 1} – {file.filename}</span>
                    </div>
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
                <span className="gb-panel-title">{openFile.filename}</span>
              </div>
              <input className="gb-search" placeholder="Search for file" disabled />
              <div>
                {loadingFileContacts && <p className="group-empty">Loading…</p>}
                {openFileContacts.map((contact) => (
                  <div
                    key={contact.id_contact}
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
                key={g.id_group}
                className={`group-card${dragOverId === g.id_group ? " drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverId(g.id_group);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, g.id_group)}
              >
                <div className="group-header">
                  <span className="group-dot" />
                  <span className="group-name">{g.name}</span>
                  <span className="group-count">{g.members.length}</span>
                  <button className="group-remove" onClick={() => removeGroup(g.id_group)} aria-label="Delete group">
                    ×
                  </button>
                </div>

                {g.members.length === 0 ? (
                  <p className="group-empty">Drag a file or a contact here</p>
                ) : (
                  <div className="member-pills">
                    {g.members.map((m) => (
                      <span className="member-pill" key={m.id_contact}>
                        {m.name}
                        <button onClick={() => removeMember(g.id_group, m.id_contact)} aria-label={`Remove ${m.name}`}>
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
