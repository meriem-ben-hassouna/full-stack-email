import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";

export default function UploadExcel() {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleImport = () => {
    // TODO: send file to backend for parsing via Axios
    alert(`Importing ${fileName}...`);
  };

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Upload Contacts</h1>
        <p className="page-subtitle">Import contacts from an Excel or CSV file.</p>
      </div>

      <div className="max-narrow">
        <label htmlFor="file-upload" className="dropzone">
          <span className="dropzone-icon">⇧</span>
          <p className="dropzone-title">
            {fileName ? fileName : "Click to select a .xlsx or .csv file"}
          </p>
          <p className="dropzone-hint">or drag and drop it here</p>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        <Button className="btn-block" style={{ marginTop: 16 , width: '89%'  , marginRight: 50  , marginLeft: 50  }} disabled={!fileName} onClick={handleImport}>
          Import Contacts
        </Button>
      </div>
    </div>
  );
}
