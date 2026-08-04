import api from "./axios";

export const getGoalApi = async () => {
  const response = await api.get("/goals");
  return response.data.data;
};

export const updateGoalApi = async (id, goalData) => {
  const response = await api.put(`/goals/${id}`, goalData);
  return response.data.data;
};

export const deleteGoalApi = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

export const createGoalApi = async (goalData) => {
  const response = await api.post("/goals", goalData);
  return response.data.data;
};

export const depositGoalApi = async (id, depositData) => {
  const response = await api.post(`/goals/${id}/deposit`, depositData);
  return response.data.data;
};