import api from "./axios";

export async function getDashboardApi() {
  const { data } = await api.get("/dashboard");
  return data.data;
}
