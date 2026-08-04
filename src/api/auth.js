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
  const formData = new FormData();

  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.avatar instanceof File) formData.append("avatar", payload.avatar);

  if (payload.settings) {
    Object.entries(payload.settings).forEach(([key, value]) => {
      formData.append(`settings[${key}]`, value);
    });
  }

  formData.append("_method", "PATCH");

  const { data } = await api.post("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data;
}


export async function changePassword(payload) {
  const { data } = await api.patch("/auth/password", payload);
  return data.data;
}


export async function deleteAccount(payload) {
  const { data } = await api.delete("/auth/account", { data: payload });
  return data.data;
}