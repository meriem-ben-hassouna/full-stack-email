import { useEffect, useRef, useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
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
  const textareaRef = useRef(null);

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

  // Wraps (bold/italic/underline) or prefixes (H1/H2) the currently
  // selected text in the body textarea with lightweight markup. The
  // backend converts this markup into real HTML formatting (<b>, <i>,
  // <u>, <h1>, <h2>) when the email is actually sent, so bold really
  // shows up bold in the recipient's inbox.
  const applyFormat = (type) => {
    const el = textareaRef.current;
    if (!el) return;

    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd) || "text";

    let before = value.slice(0, selectionStart);
    let after = value.slice(selectionEnd);
    let inserted = selected;
    let cursorOffset = 0;

    if (type === "bold") {
      inserted = `**${selected}**`;
      cursorOffset = 2;
    } else if (type === "italic") {
      inserted = `*${selected}*`;
      cursorOffset = 1;
    } else if (type === "underline") {
      inserted = `_${selected}_`;
      cursorOffset = 1;
    } else if (type === "h1" || type === "h2") {
      // Headings apply to the whole line the cursor/selection is on.
      const lineStart = before.lastIndexOf("\n") + 1;
      const lineEndRel = after.indexOf("\n");
      const lineEnd = lineEndRel === -1 ? value.length : selectionEnd + lineEndRel;
      const line = value.slice(lineStart, lineEnd).replace(/^#{1,2}\s*/, "");
      const prefix = type === "h1" ? "# " : "## ";

      const newValue = value.slice(0, lineStart) + prefix + line + value.slice(lineEnd);
      setForm((f) => ({ ...f, body: newValue }));

      requestAnimationFrame(() => {
        const pos = lineStart + prefix.length + line.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
      return;
    }

    const newValue = before + inserted + after;
    setForm((f) => ({ ...f, body: newValue }));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        selectionStart + cursorOffset,
        selectionStart + cursorOffset + selected.length
      );
    });
  };

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
            <button type="button" onClick={() => applyFormat("bold")} title="Bold"><b>B</b></button>
            <button type="button" onClick={() => applyFormat("italic")} title="Italic"><i>I</i></button>
            <button type="button" onClick={() => applyFormat("underline")} title="Underline"><u>U</u></button>
            <button type="button" onClick={() => applyFormat("h1")} title="Heading 1">H1</button>
            <button type="button" onClick={() => applyFormat("h2")} title="Heading 2">H2</button>
          </div>

          <div className="field">
            <textarea
              ref={textareaRef}
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={8}
              placeholder="Write your email here... Tip: use [contact name] and we'll swap in each recipient's real name."
              required
            />
            <p className="dropzone-hint" style={{ marginTop: 6 }}>
              Tip: write <code>[contact name]</code> anywhere in the message — each
              recipient will get a copy personalized with their own name. Select
              text and use B / I / U / H1 / H2 to format it — it'll appear
              properly formatted in the email recipients receive.
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
