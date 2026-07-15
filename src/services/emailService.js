import api from "./api.js";

export async function sendEmail({ senderId, groupIds = [], contactIds = [], subject, body }) {
  const { data } = await api.post("/emails/send", {
    sender_id: senderId,
    group_ids: groupIds,
    contact_ids: contactIds,
    subject,
    body,
  });
  return data;
}

export async function getEmailHistory(senderId) {
  const { data } = await api.get("/emails/history", { params: { sender_id: senderId } });
  return data;
}
