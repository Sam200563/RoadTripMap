import axios from "axios";

const API_URL = "http://localhost:5000"; // your backend URL
export const api = axios.create({
  baseURL: API_URL,
});

// Add Auth Token if available
export const setAuthToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
