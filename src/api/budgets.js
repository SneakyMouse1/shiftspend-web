import api from "./axios";

export const getBudgetApi = async () => {
  const response = await api.get("/budgets");
  return response.data.data;
};

export const updateBudgetApi = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data.data;
};

export const deleteBudgetApi = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

export const createBudgetApi = async (budgetData) => {
  const response = await api.post("/budgets", budgetData);
  return response.data.data;
};