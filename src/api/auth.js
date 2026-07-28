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


export async function updateProfile(payload) {
  let dataToSend = payload;

  if (!(payload instanceof FormData)) {
    dataToSend = new FormData();
    if (payload.name) dataToSend.append("name", payload.name);
    if (payload.settings) {
      dataToSend.append("settings", JSON.stringify(payload.settings));
    }
  }

  dataToSend.append("_method", "PATCH");

  const { data } = await api.post("/auth/profile", dataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data;
}