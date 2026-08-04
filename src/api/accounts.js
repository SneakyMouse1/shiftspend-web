import api from "./axios";

export async function getAccounts() {
  const { data } = await api.get("/accounts");
  return data.data;
}

export async function createAccount(payload) {
  const { data } = await api.post("/accounts", payload);
  return data.data;
}

export async function updateAccount(id, payload) {
  const { data } = await api.patch(`/accounts/${id}`, payload);
  return data.data;
}

export async function deleteAccount(id) {
  await api.delete(`/accounts/${id}`);
}
