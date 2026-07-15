import api from "./axios";

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
}

export async function logout() {
  await api.post("/auth/logout");
}