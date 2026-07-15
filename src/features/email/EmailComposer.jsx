import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getGroups } from "../../services/groupService.js";
import { getContacts } from "../../services/contactService.js";
import { sendEmail } from "../../services/emailService.js";

const ALL_OPTION = "__all__";

export default function EmailComposer() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [form, setForm] = useState({ target: ALL_OPTION, subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([getGroups(user.company_id), getContacts(user.company_id)])
      .then(([groupList, contacts]) => {
        setGroups(groupList);
        setAllContacts(contacts);
      })
      .catch((err) => alert(err.message));
  }, [user]);

  const handleChange = (e) => {
    setSent(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const targetLabel =
    form.target === ALL_OPTION
      ? "All Contacts"
      : groups.find((g) => g.id_group === form.target)?.name || "";

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = {
        senderId: user.id_user,
        subject: form.subject,
        body: form.body,
        groupIds: [],
        contactIds: [],
      };

      if (form.target === ALL_OPTION) {
        payload.contactIds = allContacts.map((c) => c.id_contact);
      } else {
        payload.groupIds = [form.target];
      }

      if (payload.contactIds.length === 0 && payload.groupIds.length === 0) {
        alert("There are no contacts to send to yet.");
        setSending(false);
        return;
      }

      await sendEmail(payload);
      setSent(true);
      setForm({ ...form, subject: "", body: "" });
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stack">
      <h1 className="page-title">Compose Email</h1>

      <Card className="max-medium">
        <form onSubmit={handleSend} className="stack">
          <div className="field">
            <label>To</label>
            <select name="target" value={form.target} onChange={handleChange}>
              <option value={ALL_OPTION}>All Contacts</option>
              {groups.map((g) => (
                <option key={g.id_group} value={g.id_group}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter email subject"
              required
            />
          </div>

          <div className="composer-toolbar">
            <button type="button"><b>B</b></button>
            <button type="button"><i>I</i></button>
            <button type="button"><u>U</u></button>
            <button type="button">H1</button>
            <button type="button">H2</button>
          </div>

          <div className="field">
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={8}
              placeholder="Write your email here... Tip: use [contact name] and we'll swap in each recipient's real name."
              required
            />
            <p className="dropzone-hint" style={{ marginTop: 6 }}>
              Tip: write <code>[contact name]</code> anywhere in the message — each
              recipient will get a copy personalized with their own name.
            </p>
          </div>

          <div className="inline-form" style={{ alignItems: "center" }}>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send to Group"}
            </Button>
            {sent && <span className="sent-msg">Sent to {targetLabel}!</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
