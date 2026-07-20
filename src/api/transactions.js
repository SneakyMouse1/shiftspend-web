import api from "./axios";

export const getTransactionsApi = async (params) => {
  const response = await api.get("/transactions", { params });
  return response.data; // paginated: { data: [...], links, meta }
};

export const createTransactionApi = async (payload) => {
  const response = await api.post("/transactions", payload);
  return response.data.data;
};

export const deleteTransactionApi = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const updateTransactionApi = async (id, payload) => {
  const response = await api.patch(`/transactions/${id}`, payload);
  return response.data.data;
};
