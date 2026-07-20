import api from "./axios";

export const getTagsApi = async () => {
  const response = await api.get("/tags");
  return response.data.data;
};

export const createTagApi = async (payload) => {
  const response = await api.post("/tags", payload);
  return response.data.data;
};
