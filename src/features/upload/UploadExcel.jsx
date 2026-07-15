import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { importContacts } from "../../services/contactService.js";

export default function UploadExcel() {
  const { user, isManager } = useAuth();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
    }
  };

  const handleImport = async () => {
    console.log("SELECTED FILE:", file);
    console.log("FILE NAME:", file?.name);
    console.log("FILE SIZE:", file?.size);
    console.log("FILE TYPE:", file?.type);
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const data = await importContacts({
        companyId: user.company_id,
        importedBy: user.id_user,
        file,
      });
      setResult(data);
      setFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setImporting(false);
    }
  };

  if (!isManager) {
    return (
      <div className="stack">
        <h1 className="page-title">Upload Contacts</h1>
        <p className="page-subtitle">Only managers can import contacts.</p>
      </div>
    );
  }

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Upload Contacts</h1>
        <p className="page-subtitle">Import contacts from an Excel (.xlsx) file.</p>
      </div>

      <div className="max-narrow">
        <Card flat style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ padding: "12px 16px 0" }}>Required file structure</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>name</th>
                  <th>email</th>
                  <th>dep</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ava Thompson</td>
                  <td>ava@company.com</td>
                  <td>Marketing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="dropzone-hint" style={{ padding: "0 16px 12px" }}>
            Row 1 must be the header. Columns must be in this exact order:
            name, email, department. Contacts already in your company
            (matched by name + email) are skipped automatically.
          </p>
        </Card>

        <label htmlFor="file-upload" className="dropzone">
          <span className="dropzone-icon">⇧</span>
          <p className="dropzone-title">
            {file ? file.name : "Click to select a .xlsx file"}
          </p>
          <p className="dropzone-hint">or drag and drop it here</p>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        <Button
          className="btn-block"
          style={{ marginTop: 16, width: '89%', marginRight: 50, marginLeft: 50 }}
          disabled={!file || importing}
          onClick={handleImport}
        >
          {importing ? "Importing..." : "Import Contacts"}
        </Button>

        {result && (
          <p className="sent-msg" style={{ marginTop: 12, textAlign: "center" }}>
            Imported {result.imported} new contact(s)
            {result.skipped_duplicates > 0 ? `, skipped ${result.skipped_duplicates} duplicate(s)` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}
