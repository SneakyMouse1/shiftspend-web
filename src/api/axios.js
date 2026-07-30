import axios from "axios";

if (!import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL is not set. Add it to your .env file");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        if (json.message || json.error) {
          error.message = json.message || json.error;
        }
      } catch {
        // Blob wasn't JSON
      }
    } else if (error.response?.data?.message || error.response?.data?.error) {
      error.message = error.response.data.message || error.response.data.error;
    }

    return Promise.reject(error);
  }
);

export default api;