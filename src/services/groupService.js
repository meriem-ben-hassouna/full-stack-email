import api from "./api.js";

export async function getGroups(companyId) {
  const { data } = await api.get("/groups", { params: { company_id: companyId } });
  return data;
}

export async function getGroupWithMembers(groupId) {
  const { data } = await api.get(`/groups/${groupId}`);
  return data;
}

export async function createGroup({ name, companyId, createdBy }) {
  const { data } = await api.post("/groups", {
    name,
    company_id: companyId,
    created_by: createdBy,
  });
  return data;
}

export async function renameGroup(groupId, name) {
  const { data } = await api.put(`/groups/${groupId}`, { name });
  return data;
}

export async function deleteGroup(groupId) {
  const { data } = await api.delete(`/groups/${groupId}`);
  return data;
}

export async function addContactToGroup(groupId, contactId) {
  const { data } = await api.post(`/groups/${groupId}/contacts/${contactId}`);
  return data;
}

export async function addContactsToGroup(groupId, contactIds) {
  const { data } = await api.post(`/groups/${groupId}/contacts`, {
    contact_ids: contactIds,
  });
  return data;
}

export async function removeContactFromGroup(groupId, contactId) {
  const { data } = await api.delete(`/groups/${groupId}/contacts/${contactId}`);
  return data;
}
