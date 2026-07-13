import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";

const GROUPS = ["Marketing", "Sales", "VIP Clients", "Support"];

export default function EmailComposer() {
  const [form, setForm] = useState({ group: GROUPS[0], subject: "", body: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSend = (e) => {
    e.preventDefault();
    // TODO: POST to backend email endpoint via Axios
    setSent(true);
  };

  return (
    <div className="stack">
      <h1 className="page-title">Compose Email</h1>

      <Card className="max-medium">
        <form onSubmit={handleSend} className="stack">
          <div className="field">
            <label>To</label>
            <select name="group" value={form.group} onChange={handleChange}>
              {GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
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
              placeholder="Write your email here..."
              required
            />
          </div>

          <div className="inline-form" style={{ alignItems: "center" }}>
            <Button type="submit">Send to Group</Button>
            {sent && <span className="sent-msg">Sent to {form.group}!</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
