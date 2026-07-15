import api from "./api.js";

export async function getContacts(companyId) {
  const { data } = await api.get("/contacts", { params: { company_id: companyId } });
  return data;
}

export async function deleteContact(contactId) {
  const { data } = await api.delete(`/contacts/${contactId}`);
  return data;
}

export async function importContacts({ companyId, importedBy, file }) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/contacts/import", formData, {
    params: { company_id: companyId, imported_by: importedBy },
    headers: { "Content-Type": "multipart/form-data" },
  });
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
