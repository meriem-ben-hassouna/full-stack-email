import api from "./api.js";

export async function getContacts(companyId) {
  const { data } = await api.get("/contacts", { params: { company_id: companyId } });
  return data;
}

export async function deleteContact(contactId) {
  const { data } = await api.delete(`/contacts/${contactId}`);
  return data;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function importContacts({ companyId, importedBy, file }) {
  if (!(file instanceof File)) {
    throw new Error("No file was selected. Please choose a .xlsx file first.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const url = new URL("/contacts/import", API_BASE_URL);
  url.searchParams.set("company_id", companyId);
  url.searchParams.set("imported_by", importedBy);

  // Deliberately NOT using the shared `api` axios instance here: it sets
  // a default "Content-Type: application/json" header, and relying on
  // axios/the browser to correctly strip that in favor of the
  // auto-generated multipart boundary has proven unreliable. Plain
  // fetch() has no such ambiguity — when the body is a FormData object
  // and no Content-Type is set manually, the browser always computes
  // the correct "multipart/form-data; boundary=..." header itself.
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail
      ? typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail)
      : `Import failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function getContactFiles(companyId) {
  const { data } = await api.get("/contact-files", { params: { company_id: companyId } });
  return data;
}

export async function getFileContacts(fileId) {
  const { data } = await api.get(`/contact-files/${fileId}/contacts`);
  return data;
}